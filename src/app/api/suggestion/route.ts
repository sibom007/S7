import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@clerk/nextjs/server";
import { openrouter } from "@/lib/ai-models";

const suggestionSchema = z.object({
  suggestion: z
    .string()
    .describe("The code to insert at Cursor, or empty string if no completion"),
});

const SUGGESTION_PROMPT = `You are a code suggestion assistant.

<context>
<file_name>{fileName}</file_name>
<previous_lines>
{previousLines}
</previous_lines>
<current_line number="{lineNumber}">{currentLine}</current_line>
<before_cursor>{textBeforeCursor}</before_cursor>
<after_cursor>{textAfterCursor}</after_cursor>
<next_lines>
{nextLines}
</next_lines>
<full_code>
{code}
</full_code>
</context>

<instructions>
Follow these steps IN ORDER:

1. First, look at next_lines. If next_lines contains ANY code, check if it continues from where the cursor is. If it does, return empty string immediately - the code is already written.

2. Check if before_cursor ends with a complete statement (;, }, )). If yes, return empty string.

3. Only if steps 1 and 2 don't apply: suggest what should be typed at the cursor position, using context from full_code.

Your suggestion is inserted immediately after the cursor, so never suggest code that's already in the file.
</instructions>`;

export async function POST(request: Request) {
  let body;

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorised",
        },
        {
          status: 403,
        },
      );
    }
    body = await request.json();
  } catch {
    return NextResponse.json({ suggestion: "" }, { status: 200 });
  }

  const {
    fileName,
    code,
    currentLine,
    previousLine,
    textBeforeCursor,
    textAfterCursor,
    nextLines,
    lineNumber,
  } = await body;

  if (!code) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  // // Nothing meaningful typed
  // if (!textBeforeCursor || textBeforeCursor.trim().length < 2) {
  //   return NextResponse.json({ suggestion: "" });
  // }

  // // Cursor already at end of a statement
  // if (/[;})]\s*$/.test(textBeforeCursor)) {
  //   return NextResponse.json({ suggestion: "" });
  // }

  // // Code already continues below
  // if (nextLines && nextLines.trim().length > 0) {
  //   return NextResponse.json({ suggestion: "" });
  // }

  const prompt = SUGGESTION_PROMPT.replace("{fileName}", fileName)
    .replace("{code}", code)
    .replace("{currentLine}", currentLine)
    .replace("{previousLine}", previousLine || "")
    .replace("{textBeforeCursor}", textBeforeCursor)
    .replace("{textAfterCursor}", textAfterCursor)
    .replace("{nextLines}", nextLines || "")
    .replace("{lineNumber}", lineNumber);

  const { output } = await generateText({
    model: openrouter("arcee-ai/trinity-large-preview:free"),
    output: Output.object({ schema: suggestionSchema }),
    prompt,
    maxRetries: 0,
  });
  return NextResponse.json({
    suggestion: output.suggestion,
  });
}
