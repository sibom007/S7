import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";
import { auth } from "@clerk/nextjs/server";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { NextResponse } from "next/server";
import z from "zod";

const requestSchema = z.object({
  conversationId: z.string(),
  message: z.string(),
});

export const POST = async (request: Request) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const internalKey = process.env.CONVEX_INTERNAL_KEY;
  if (!internalKey) {
    return NextResponse.json(
      { error: "Internal key not configured" },
      { status: 500 },
    );
  }

  const body = await request.json();
  const { conversationId, message } = requestSchema.parse(body);

  const conversation = await convex.query(api.system.getConversationById, {
    internalKey,
    conversationId: conversationId as Id<"conversations">,
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "conversation not Found" },
      { status: 500 },
    );
  }

  const projectId = conversation.projectId;

  await convex.mutation(api.system.createMessage, {
    internalKey,
    conversationId: conversationId as Id<"conversations">,
    projectId,
    content: message,
    role: "user",
  });

  // Create assistant message placeholder with processing status
  const assistantId = await convex.mutation(api.system.createMessage, {
    internalKey,
    conversationId: conversationId as Id<"conversations">,
    projectId,
    content: "",
    role: "assistant",
    status: "processing",
  });

  const event = await inngest.send({
    name: "message/sent",
    data: {
      messageId: assistantId,
    },
  });

  return NextResponse.json({
    succes: true,
    eventId: event.ids[0],
    messageId: assistantId,
  });
};
