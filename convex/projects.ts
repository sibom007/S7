import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identaty = await ctx.auth.getUserIdentity();

    if (!identaty) {
      throw new Error("unauthorized");
    }

    await ctx.db.insert("projects", {
      name: args.name,
      ownerId: identaty.subject,
    });
  },
});

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.db.query("projects").collect();
  },
});
