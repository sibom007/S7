import z from "zod";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { api } from "@convex/_generated/api";
import { convex } from "@/lib/convex-client";
import { Id } from "@convex/_generated/dataModel";

const requestSchema = z.object({
  conversationId: z.string(),
  message: z.string(),
});

export const POST = async (request: Request) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const internalKey = process.env.S7_CONVEX_INTERNAL_KEY;
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

  //   Find all prossessing messages in this project
  const prossessingMessage = await convex.query(
    api.system.getProcessingMessages,
    {
      internalKey,
      projectId: projectId,
    },
  );

  if (prossessingMessage.length > 0) {
    //   cancel All prossing message
    await Promise.all(
      prossessingMessage.map(async (msg) => {
        await inngest.send({
          name: "message/cancel",
          data: {
            messageId: msg._id,
          },
        });

        await convex.mutation(api.system.updateMessageStatus, {
          internalKey,
          messageId: msg._id,
          status: "cancelled",
        });
        return msg._id;
      }),
    );
  }

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
    name: "message/send",
    data: {
      messageId: assistantId,
      conversationId,
      projectId,
      message,
      clerkId: userId,
    },
  });

  return NextResponse.json({
    succes: true,
    eventId: event.ids[0],
    messageId: assistantId,
  });
};
