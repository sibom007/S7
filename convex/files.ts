import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { verifyAuth } from "./auth";
import { Doc, Id } from "./_generated/dataModel";

export const get = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const identaty = await verifyAuth(ctx);

    const project = await ctx.db.get("projects", args.projectId);

    if (!project) {
      throw new Error("Project Not Found!");
    }

    if (project.ownerId !== identaty.subject) {
      throw new Error("UnAuthorized access to this project");
    }

    return await ctx.db
      .query("files")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const getFile = query({
  args: { id: v.id("files") },
  handler: async (ctx, args) => {
    const identaty = await verifyAuth(ctx);

    const file = await ctx.db.get("files", args.id);

    if (!file) {
      throw new Error("Project Not Found!");
    }

    const project = await ctx.db.get("projects", file.projectId);

    if (!project) {
      throw new Error("Project Not Found!");
    }

    if (project.ownerId !== identaty.subject) {
      throw new Error("UnAuthorized access to this project");
    }

    return file;
  },
});

export const getFolderContants = query({
  args: {
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
  },
  handler: async (ctx, args) => {
    const identaty = await verifyAuth(ctx);

    const project = await ctx.db.get("projects", args.projectId);

    if (!project) {
      throw new Error("Project Not Found!");
    }

    if (project.ownerId !== identaty.subject) {
      throw new Error("UnAuthorized access to this project");
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", args.projectId).eq("parentId", args.parentId),
      )
      .collect();

    return files.sort((a, b) => {
      if (a.type === "folder" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "folder") return 1;

      return a.name.localeCompare(b.name);
    });
  },
});

export const createFile = mutation({
  args: {
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
    name: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identaty = await verifyAuth(ctx);

    const project = await ctx.db.get("projects", args.projectId);

    if (!project) {
      throw new Error("Project Not Found!");
    }

    if (project.ownerId !== identaty.subject) {
      throw new Error("UnAuthorized access to this project");
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", args.projectId).eq("parentId", args.parentId),
      )
      .collect();

    const existing = files.find(
      (file) => file.name === args.name && file.type === "file",
    );

    if (existing) {
      throw new Error("File already exists");
    }

    await ctx.db.insert("files", {
      name: args.name,
      projectId: args.projectId,
      parentId: args.parentId,
      content: args.content,
      type: "file",
      updateAt: Date.now(),
    });
    await ctx.db.patch("projects", args.projectId, {
      updateAt: Date.now(),
    });
  },
});

export const createFolder = mutation({
  args: {
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identaty = await verifyAuth(ctx);

    const project = await ctx.db.get("projects", args.projectId);

    if (!project) {
      throw new Error("Project Not Found!");
    }

    if (project.ownerId !== identaty.subject) {
      throw new Error("UnAuthorized access to this project");
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", args.projectId).eq("parentId", args.parentId),
      )
      .collect();

    const existing = files.find(
      (file) => file.name === args.name && file.type === "folder",
    );

    if (existing) {
      throw new Error("Folder already exists");
    }

    await ctx.db.insert("files", {
      name: args.name,
      projectId: args.projectId,
      parentId: args.parentId,
      type: "folder",
      updateAt: Date.now(),
    });
    await ctx.db.patch("projects", args.projectId, {
      updateAt: Date.now(),
    });
  },
});

export const renameFile = mutation({
  args: {
    id: v.id("files"),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    const identaty = await verifyAuth(ctx);

    const file = await ctx.db.get("files", args.id);

    if (!file) {
      throw new Error("file Not Found!");
    }

    const project = await ctx.db.get("projects", file.projectId);

    if (!project) {
      throw new Error("Project Not Found!");
    }

    if (project.ownerId !== identaty.subject) {
      throw new Error("UnAuthorized access to this project");
    }

    const siblings = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q.eq("projectId", file.projectId).eq("parentId", file.parentId),
      )
      .collect();

    const existing = siblings.find(
      (sibling) =>
        sibling.name === args.newName &&
        sibling.type === "folder" &&
        sibling._id !== args.id,
    );

    if (existing) {
      throw new Error(
        `A ${file.type} with this name already exists in this location`,
      );
    }

    await ctx.db.patch("files", args.id, {
      name: args.newName,
      updateAt: Date.now(),
    });
    await ctx.db.patch("projects", file.projectId, {
      updateAt: Date.now(),
    });
  },
});

export const deleteFile = mutation({
  args: {
    id: v.id("files"),
  },
  handler: async (ctx, args) => {
    const identaty = await verifyAuth(ctx);

    const file = await ctx.db.get("files", args.id);

    if (!file) {
      throw new Error("file Not Found!");
    }

    const project = await ctx.db.get("projects", file.projectId);

    if (!project) {
      throw new Error("Project Not Found!");
    }

    if (project.ownerId !== identaty.subject) {
      throw new Error("UnAuthorized access to this project");
    }

    const deleterecursive = async (fileId: Id<"files">) => {
      const item = await ctx.db.get("files", fileId);
      if (!item) return;

      if (item.type === "folder") {
        const children = await ctx.db
          .query("files")
          .withIndex("by_project_parent", (q) =>
            q.eq("projectId", item.projectId).eq("parentId", fileId),
          )
          .collect();

        for (const child of children) {
          await deleterecursive(child._id);
        }
      }

      //  Delete storage file
      if (item.storageId) {
        await ctx.storage.delete(item.storageId);
      }

      await ctx.db.delete("files", fileId);
    };

    await deleterecursive(args.id);
    await ctx.db.patch("projects", file.projectId, {
      updateAt: Date.now(),
    });
  },
});

export const updateFile = mutation({
  args: {
    id: v.id("files"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identaty = await verifyAuth(ctx);

    const file = await ctx.db.get("files", args.id);

    if (!file) {
      throw new Error("file Not Found!");
    }

    const project = await ctx.db.get("projects", file.projectId);

    if (!project) {
      throw new Error("Project Not Found!");
    }

    if (project.ownerId !== identaty.subject) {
      throw new Error("UnAuthorized access to this project");
    }

    await ctx.db.patch("files", args.id, {
      content: args.content,
      updateAt: Date.now(),
    });
    await ctx.db.patch("projects", file.projectId, {
      updateAt: Date.now(),
    });
  },
});

export const getFilePath = query({
  args: {
    id: v.id("files"),
  },
  handler: async (ctx, args) => {
    const identaty = await verifyAuth(ctx);

    const file = await ctx.db.get("files", args.id);

    if (!file) {
      throw new Error("file Not Found!");
    }

    const project = await ctx.db.get("projects", file.projectId);

    if (!project) {
      throw new Error("Project Not Found!");
    }

    if (project.ownerId !== identaty.subject) {
      throw new Error("UnAuthorized access to this project");
    }

    const path: { _id: string; name: string }[] = [];
    let currntId: Id<"files"> | undefined = args.id;

    while (currntId) {
      const file = (await ctx.db.get("files", currntId)) as
        | Doc<"files">
        | undefined;

      if (!file) {
        return;
      }

      path.unshift({ _id: file._id, name: file.name });
      currntId = file.parentId;
    }
    return path;
  },
});
