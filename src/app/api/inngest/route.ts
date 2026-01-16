import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { GenerateText } from "@/inngest/function";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [GenerateText],
});
