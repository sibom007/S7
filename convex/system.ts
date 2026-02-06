import { mutation, query } from "@convex/_generated/server";
import { v } from "convex/values";

export const validateInternalKey = (key: string) => {
  const internalKey = process.env.CONVEX_INTERNAL_KEY!;

  if (!internalKey) {
    throw new Error(" CONVEX_INTERNAL_KEY is not configured");
  }

  if (key !== internalKey) {
    throw new Error("invalid internal key");
  }
};

export const getConversationById = query({
  args: {
    conversationId: v.id("conversations"),
    internalKey: v.string(),
  },
  handler: async (ctx, args) => {
    validateInternalKey(args.internalKey);
    return await ctx.db.get(args.conversationId);
  },
});
export const createMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    internalKey: v.string(),
    projectId: v.id("projects"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    status: v.optional(
      v.union(
        v.literal("processing"),
        v.literal("completed"),
        v.literal("cancelled"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    validateInternalKey(args.internalKey);

    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      content: args.content,
      projectId: args.projectId,
      role: args.role,
      status: args.status,
      updateAt: Date.now(),
    });
    await ctx.db.patch(args.conversationId, {
      updateAt: Date.now(),
    });
    v.optional(
      v.union(
        v.literal("processing"),
        v.literal("completed"),
        v.literal("cancelled"),
      ),
    );

    return messageId;
  },
});

export const updateMessageContent = mutation({
  args: {
    messageId: v.id("messages"),
    internalKey: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    validateInternalKey(args.internalKey);

    return await ctx.db.patch(args.messageId, {
      content: args.content,
      status: "completed" as const,
    });
  },
});
