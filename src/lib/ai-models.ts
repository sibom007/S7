import { openai } from "@inngest/agent-kit";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const openrouter = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export const OpenAi = openai({
  model: "arcee-ai/trinity-large-preview:free",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  baseUrl: "https://openrouter.ai/api/v1",
});
