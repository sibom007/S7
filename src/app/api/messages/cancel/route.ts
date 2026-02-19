import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";
import { auth } from "@clerk/nextjs/server";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { NextResponse } from "next/server";
import z from "zod";

const requestSchema = z.object({
  projectId: z.string(),
});

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { projectId } = requestSchema.parse(body);

  const internalKey = process.env.S7_CONVEX_INTERNAL_KEY!;
  if (!internalKey) {
    return NextResponse.json(
      { error: "Internal key not configured" },
      { status: 500 },
    );
  }

  //   Find all prossessing messages in this project
  const prossessingMessage = await convex.query(
    api.system.getProcessingMessages,
    {
      internalKey,
      projectId: projectId as Id<"projects">,
    },
  );

  if (!prossessingMessage) {
    return NextResponse.json({ success: true, cancelled: false, status: 500 });
  }

  //   cancel All prossing message
  const cancelledIds = await Promise.all(
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

  return NextResponse.json({
    success: true,
    cancelled: true,
    messageIds: cancelledIds,
  });
}
