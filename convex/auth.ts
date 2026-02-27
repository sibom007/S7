import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { validateInternalKey } from "./system";

export const verifyAuth = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("unauthorized");
  }
  return identity;
};

export const createToken = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const clerkId = identity.subject;

    const tokenDoc = await ctx.db
      .query("tokens")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    // Lazy create only once (first login)
    if (!tokenDoc) {
      await ctx.db.insert("tokens", {
        clerkId,
        balance: 5,
        plan: "free",
        updateAt: Date.now(),
      });
      return { initialized: true };
    }

    return { initialized: false };
  },
});

export const getBalanceToken = query({
  args: { clerkId: v.string(), internalKey: v.string() },
  handler: async (ctx, args) => {
    validateInternalKey(args.internalKey);

    if (!args.clerkId) throw new Error("Unauthorized");

    const token = await ctx.db
      .query("tokens")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    return { credit: token?.balance ?? 0 };
  },
});
export const getBalanceTokenFromClient = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const clerkId = identity.subject;

    const token = await ctx.db
      .query("tokens")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    return { credit: token?.balance ?? 0 };
  },
});

export const updateBalanceToken = mutation({
  args: {
    internalKey: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    validateInternalKey(args.internalKey);

    const existingToken = await ctx.db
      .query("tokens")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!existingToken) {
      throw new Error("Token not found");
    }

    // Prevent usage if no balance left
    if ((existingToken.balance ?? 0) <= 0) {
      throw new Error("You have no balance left. Upgrade to Pro.");
    }

    return await ctx.db.patch("tokens", existingToken?._id, {
      balance: (existingToken.balance ?? 0) - 1,
    });
  },
});

export const updateBalanceTokenByBilling = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const tokenDoc = await ctx.db
      .query("tokens")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!tokenDoc) {
      throw new Error("Token not found");
    }

    // Prevent duplicate +40 on refresh
    if (tokenDoc.plan === "pro") {
      return {
        message: "Already synced",
        balance: tokenDoc.balance ?? 0,
      };
    }

    const previousBalance = tokenDoc.balance ?? 0;
    const newBalance = previousBalance + 40;

    await ctx.db.patch(tokenDoc._id, {
      balance: newBalance,
      plan: "pro",
      updateAt: Date.now(),
    });

    return {
      previousBalance,
      newBalance,
      upgraded: true,
    };
  },
});
