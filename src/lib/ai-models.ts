import { openai } from "@inngest/agent-kit";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const AI_MODEL = "arcee-ai/trinity-large-preview:free";

export const openrouter = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export const OpenAi = openai({
  model: AI_MODEL,
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  baseUrl: "https://openrouter.ai/api/v1",
});
