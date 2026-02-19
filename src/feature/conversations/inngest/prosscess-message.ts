import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { NonRetriableError } from "inngest";
import { createAgent, createNetwork, openai } from "@inngest/agent-kit";

import {
  CODING_AGENT_SYSTEM_PROMPT,
  TITLE_GENERATOR_SYSTEM_PROMPT,
} from "./constant";
import { DEFAULT_CONVERSATION_TITLE } from "../constant";
import { createReadFilesTool } from "./tools/read-file";
import { createListFilesTool } from "./tools/list-file";
import { createUpdateFileTool } from "./tools/update-file";
import { createCreateFilesTool } from "./tools/create-files";
import { createCreateFolderTool } from "./tools/create-folder";
import { createRenameFileTool } from "./tools/rename-file";
import { createDeleteFilesTool } from "./tools/delete-files";
import { createScrapeUrlsTool } from "./tools/scrape-urls";

interface MessageEvent {
  messageId: Id<"messages">;
  conversationId: Id<"conversations">;
  projectId: Id<"projects">;
  message: string;
}

export const processMessage = inngest.createFunction(
  {
    id: "process-message",
    cancelOn: [
      {
        event: "message/cancel",
        if: "event.data.messageId == async.data.messageId",
      },
    ],
    onFailure: async ({ event, step }) => {
      const { messageId } = event.data.event.data as MessageEvent;

      const internalKey = process.env.S7_CONVEX_INTERNAL_KEY;
      if (internalKey) {
        await step.run("update-message-on-failure", async () => {
          await convex.mutation(api.system.updateMessageContent, {
            internalKey,
            messageId,
            content:
              "My apologies, I encountered an error while processing your request. Let me know if you need anything else!",
          });
        });
      }
    },
  },
  {
    event: "message/sent",
  },
  async ({ event, step }) => {
    const { conversationId, message, messageId, projectId } =
      event.data as MessageEvent;

    const internalKey = process.env.S7_CONVEX_INTERNAL_KEY;
    if (!internalKey) {
      throw new NonRetriableError("Internal key not configured");
    }

    await step.sleep("wait-for-ai-processing", "1s");

    const conversation = await step.run("get-conversation", async () => {
      return await convex.query(api.system.getConversationById, {
        internalKey,
        conversationId,
      });
    });

    if (!conversation) {
      throw new NonRetriableError("conversation not Found");
    }

    const recentmessages = await step.run("get-resent-message", async () => {
      return await convex.query(api.system.getRecentMessages, {
        internalKey,
        conversationId,
        limit: 7,
      });
    });

    let systemPrompt = CODING_AGENT_SYSTEM_PROMPT;

    const contextMessage = recentmessages.filter(
      (msg) => msg._id !== messageId && msg.content.trim() !== "",
    );

    if (contextMessage.length > 0) {
      const historyText = contextMessage
        .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join("\n\n");

      systemPrompt += `\n\n## Previous Conversation (for context only — do
      NOT repeat these responses):\n${historyText}\n\n## Current
      Request:\nRespond ONLY to the user's new message below. Do not repeat
      or reference your previous responses.`;
    }

    const shouldGenerateTitle =
      conversation.title === DEFAULT_CONVERSATION_TITLE;

    if (shouldGenerateTitle) {
      const titleAgent = createAgent({
        name: "title-generator",
        system: TITLE_GENERATOR_SYSTEM_PROMPT,
        model: openai({
          model: "openrouter/aurora-alpha",
          apiKey: process.env.OPEN_ROUTER_API_KEY,
          baseUrl: "https://openrouter.ai/api/v1",
        }),
      });

      const { output } = await titleAgent.run(message, { step });

      const textMessage = output.find(
        (m) => m.type === "text" && m.role === "assistant",
      );

      if (textMessage?.type === "text") {
        const title =
          typeof textMessage.content === "string"
            ? textMessage.content.trim()
            : textMessage.content
                .map((c) => c.text)
                .join("")
                .trim();

        if (title) {
          await step.run("update-conversation-title", async () => {
            await convex.mutation(api.system.updateConversationTitle, {
              internalKey,
              conversationId,
              title,
            });
          });
        }
      }
    }

    // Create the coding agent with file tools

    const codingAgent = createAgent({
      name: "S7",
      description: "An expert Ai coding assistant",
      system: systemPrompt,
      model: openai({
        model: "openrouter/aurora-alpha",
        apiKey: process.env.OPEN_ROUTER_API_KEY,
        baseUrl: "https://openrouter.ai/api/v1",
      }),
      tools: [
        createListFilesTool({ internalKey, projectId }),
        createReadFilesTool({ internalKey }),
        createUpdateFileTool({ internalKey }),
        createCreateFilesTool({ projectId, internalKey }),
        createCreateFolderTool({ projectId, internalKey }),
        createRenameFileTool({ internalKey }),
        createDeleteFilesTool({ internalKey }),
        createScrapeUrlsTool(),
      ],
    });

    // Create network with single agent
    const network = createNetwork({
      name: "S7-network",
      agents: [codingAgent],
      maxIter: 10,
      // This is get eror need remove in producaton
      // router: ({ network }) => {
      //   const lastResult = network.state.results.at(-1);
      //   const hasTextResponse = lastResult?.output.some(
      //     (m) => m.type === "text" && m.role === "assistant",
      //   );
      //   const hasToolCalls = lastResult?.output.some(
      //     (m) => m.type === "tool_call",
      //   );

      //   if (hasTextResponse && !hasToolCalls) {
      //     return undefined;
      //   }
      // },

      router: ({ network }) => {
        const lastResult = network.state.results.at(-1);

        if (!lastResult) {
          return codingAgent; // return the agent object
        }

        const hasTextResponse = lastResult.output?.some(
          (m) => m.type === "text" && m.role === "assistant",
        );

        const hasToolCalls = lastResult.output?.some(
          (m) => m.type === "tool_call",
        );

        // If tools were called, continue so agent can produce final text
        if (hasToolCalls) {
          return codingAgent;
        }

        // If final assistant text exists, stop the network
        if (hasTextResponse) {
          return undefined;
        }

        // Otherwise continue iteration
        return codingAgent;
      },
    });
    const result = await network.run(message);
    const lastResult = result.state.results.at(-1);
    const textMessage = lastResult?.output.find(
      (m) => m.type === "text" && m.role === "assistant",
    );

    let assistantResponce =
      "I processed request. Let me know if you need anything else";

    if (textMessage?.type === "text") {
      assistantResponce =
        typeof textMessage.content === "string"
          ? textMessage.content
          : textMessage.content.map((c) => c.text).join("");
    }

    // Update the assistant message with the responce (his also sets status to complete)
    await step.run("update-assistant-message", async () => {
      await convex.mutation(api.system.updateMessageContent, {
        internalKey,
        messageId,
        content: assistantResponce,
      });
    });

    return { success: true, messageId, conversationId };
  },
);
