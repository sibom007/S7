import { openrouter } from "@/lib/ai-models";
import { firecrawl } from "@/lib/firecrawl";
import { auth } from "@clerk/nextjs/server";

import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import z from "zod";

const quickEditSchema = z.object({
  editedCode: z
    .string()
    .describe(
      "The Edited version of the selected code based on the instruction",
    ),
});

const URL_REGEX = /https?:\/\/[^\s)>\]]+/g;

const QUICK_EDIT_PROMPT = `You are a code editing assistant. Edit the selected code based on the user's instruction.

<context>
<selected_code>
{selectedCode}
</selected_code>
<full_code_context>
{fullCode}
</full_code_context>
</context>

{documentation}

<instruction>
{instruction}
</instruction>

<instructions>
Return ONLY the edited version of the selected code.
Maintain the same indentation level as the original.
Do not include any explanations or comments unless requested.
If the instruction is unclear or cannot be applied, return the original code unchanged.
</instructions>`;

export async function POST(request: Request) {
  try {
    const { selectedCode, fullCode, instruction } = await request.json();

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
    if (!selectedCode) {
      return NextResponse.json(
        { error: "Selected code is required" },
        {
          status: 400,
        },
      );
    }
    if (!instruction) {
      return NextResponse.json(
        { error: "instruction is required" },
        {
          status: 400,
        },
      );
    }

    const urls: string[] = instruction.match(URL_REGEX) || [];

    let documentationContext = "";

    if (urls.length > 0) {
      const scrapedResults = await Promise.all(
        urls.map(async (url) => {
          try {
            const result = await firecrawl.scrape(url, {
              formats: ["markdown"],
            });

            if (result.markdown) {
              return `<doc url="${url}">\n${result.markdown}\n</doc>`;
            }

            return null;
          } catch {
            return null;
          }
        }),
      );

      const vaildResults = scrapedResults.filter(Boolean);

      if (vaildResults.length > 0) {
        documentationContext = `<documentation>\n${vaildResults.join("\n\n")}\n</documentation>`;
      }
    }
    const prompt = QUICK_EDIT_PROMPT.replace("{selectedCode}", selectedCode)
      .replace("{fullCode}", fullCode)
      .replace("{instruction}", instruction)
      .replace("{instruction}", documentationContext);

    const { output } = await generateText({
      model: openrouter("openrouter/aurora-alpha"),
      output: Output.object({ schema: quickEditSchema }),
      prompt,
      maxRetries: 0,
    });

    return NextResponse.json({ editedCode: output.editedCode });
  } catch (error) {
    console.error("🚀 ~ Post ~ error:", error);
    return NextResponse.json(
      { error: "Failed to generate edit" },
      { status: 500 },
    );
  }
}
