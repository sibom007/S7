import { inngest } from "@/inngest/client";

import { auth, clerkClient } from "@clerk/nextjs/server";

import { Id } from "@convex/_generated/dataModel";
import { NextResponse } from "next/server";
import z from "zod";

const requestSchema = z.object({
  projectId: z.string(),
  repoName: z.string(),
  visibility: z.enum(["public", "private"]).default("private"),
  description: z.string().max(350).optional(),
});

export async function POST(request: Request) {
  const { userId, has } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hasPro = has({
    plan: "pro",
  });
  if (!hasPro) {
    return NextResponse.json(
      { error: "Pro plan required", code: "PRO_REQUIRED" },
      { status: 403 },
    );
  }

  const body = await request.json();
  const { projectId, repoName, visibility, description } =
    requestSchema.parse(body);

  const client = await clerkClient();
  const tokens = await client.users.getUserOauthAccessToken(userId, "github");
  const githubToken = tokens.data[0]?.token;
  if (!githubToken) {
    return NextResponse.json(
      {
        error: "GitHub not connected. Please reconnect your GitHub account",
        code: "GITHUB_NOT_CONNECTED",
      },
      { status: 401 },
    );
  }
  const internalKey = process.env.S7_CONVEX_INTERNAL_KEY!;


  if (!internalKey) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  const event = await inngest.send({
    name: "github/export.repo",
    data: {
      projectId: projectId as Id<"projects">,
      githubToken,
      repoName,
      visibility,
      description,
      internalKey,
    },
  });

  return NextResponse.json({
    success: true,
    projectId,
    eventId: event.ids[0],
  });
}
