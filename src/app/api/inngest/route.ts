import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { processMessage } from "@/feature/conversations/inngest/prosscess-message";
import { importGithubRepo } from "@/feature/projects/inngest/import-github-repo";
import { exportToGithub } from "@/feature/projects/inngest/export-to-github";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processMessage, importGithubRepo, exportToGithub],
});
