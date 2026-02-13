import { NextResponse } from "next/server";

export const VerifyInternalKey = () => {
  const internalKey = process.env.CONVEX_INTERNAL_KEY!;
  if (!internalKey) {
    return NextResponse.json(
      { error: "Internal key not configured" },
      { status: 500 },
    );
  }
};
