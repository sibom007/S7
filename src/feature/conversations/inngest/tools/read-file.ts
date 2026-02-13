import { convex } from "@/lib/convex-client";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { createTool } from "@inngest/agent-kit";
import z from "zod";

interface ReadFileToolOption {
  internalKey: string;
}

const paramsSchema = z.object({
  fileIds: z
    .array(z.string().min(1, "File Id connot be empty"))
    .min(1, "provide at last one file ID"),
});

export const createReadFilesTool = ({ internalKey }: ReadFileToolOption) => {
  return createTool({
    name: "readFiles",
    description:
      "Read the content of files from the project. Returns file contents.",
    parameters: z.object({
      fileId: z.array(z.string()).describe("Array of the IDs to read"),
    }),
    handler: async (parama, { step: toolStep }) => {
      const parse = paramsSchema.safeParse(parama);

      if (!parse.success) {
        return `Error: ${parse.error.issues[0].message}`;
      }

      const {
        data: { fileIds },
      } = parse;

      try {
        return await toolStep?.run("read-files", async () => {
          const results: { id: string; name: string; content: string }[] = [];
          for (const fileId of fileIds) {
            const file = await convex.query(api.system.getFileById, {
              internalKey,
              fileId: fileId as Id<"files">,
            });

            if (file && file.content) {
              results.push({
                id: file._id,
                name: file.name,
                content: file.content,
              });
            }
          }

          if (results.length === 0) {
            return "Error: No files found with provided IDs. Use Filelists to get valid fileIDs";
          }
          return JSON.stringify(results);
        });
      } catch (error) {
        return `Error: reading files: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  });
};
