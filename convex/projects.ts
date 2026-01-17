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
  handler: async (ctx) => {
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

export const getOne = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const identaty = await verifyAuth(ctx);

    const project = await ctx.db.get(args.id);

    if (!project) {
      throw new Error("Project Not Found!");
    }

    if (project.ownerId !== identaty.subject) {
      throw new Error("UnAuthorized access to this project");
    }

    return project;
  },
});

export const rename = mutation({
  args: { projectId: v.id("projects"), name: v.string() },
  handler: async (ctx, args) => {
    const identaty = await verifyAuth(ctx);

    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new Error("Project Not Found!");
    }

    if (project.ownerId !== identaty.subject) {
      throw new Error("UnAuthorized access to this project");
    }

    await ctx.db.patch("projects", args.projectId, {
      name: args.name,
      updateAt: Date.now(),
    });

    return project;
  },
});

