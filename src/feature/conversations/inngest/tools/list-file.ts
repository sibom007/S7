import { convex } from "@/lib/convex-client";
import { projectId } from "@/types";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { createTool } from "@inngest/agent-kit";
import z from "zod";

interface ListFileToolOption {
  internalKey: string;
  projectId: projectId;
}

export const createListFilesTool = ({
  internalKey,
  projectId,
}: ListFileToolOption) => {
  return createTool({
    name: "listFiles",
    description:
      "List all files and folders in the project.Returns names,Ids,types, and parentld parentId for each item.Items with parentId: null are at root level. Use the parentId to understand the folder seucture - items with the same parentId are in the same folder.",
    parameters: z.object({}),
    handler: async (_, { step: toolStep }) => {
      try {
        return await toolStep?.run("list-files", async () => {
          const files = await convex.query(api.system.getProjectFile, {
            internalKey,
            projectId: projectId as Id<"projects">,
          });
          // sort folder first ,then files, alphabetically
          const sorted = files.sort((a, b) => {
            if (a.type !== b.type) {
              return a.type === "folder" ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
          });

          const fileLsit = sorted.map((f) => ({
            id: f._id,
            name: f.name,
            type: f.type,
            parentId: f.parentId ?? null,
          }));
          return JSON.stringify(fileLsit);
        });
      } catch (error) {
        return `Error: listing files: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  });
};
