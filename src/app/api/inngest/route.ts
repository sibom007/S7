import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { processMessage } from "@/feature/conversations/inngest/prosscess-message";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processMessage],
});
