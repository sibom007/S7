import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { verifyAuth } from "./auth";

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identaty = await verifyAuth(ctx);
    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      ownerId: identaty.subject,
      updateAt: Date.now(),
    });
    return projectId;
  },
});

export const getPartial = query({
  args: {
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const identaty = await verifyAuth(ctx);
    return await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerId", identaty.subject))
      .order("desc")
      .take(args.limit);
  },
});
export const lastUpdateProject = query({
  args: {},
  handler: async (ctx, args) => {
    const identaty = await verifyAuth(ctx);
    return await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerId", identaty.subject))
      .order("desc")
      .take(1);
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identaty = await verifyAuth(ctx);
    return await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerId", identaty.subject))
      .collect();
  },
});
