import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import { projectId } from "@/types";
import { CopyIcon, HistoryIcon, LoaderIcon, PlusIcon } from "lucide-react";
import {
  useConversation,
  useConversations,
  useCreateConversation,
  useMessages,
} from "../hooks/use-conversations";
import { useState } from "react";
import { Id } from "@convex/_generated/dataModel";
import { toast } from "sonner";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import ky from "ky";

export const ConvercationSidebar = ({
  projectId,
}: {
  projectId: projectId;
}) => {
  const [input, setInput] = useState("");
  const [selectedconversationId, setSelectedconversationId] =
    useState<Id<"conversations"> | null>(null);
  const createConvercation = useCreateConversation();
  const convercations = useConversations(projectId);
  const activeConversationId =
    selectedconversationId ?? convercations?.[0]?._id ?? null;
  const activeConversation = useConversation(activeConversationId);
  const convercationMessages = useMessages(activeConversationId);

  const isProssing = convercationMessages?.some(
    (msg) => msg.status === "processing",
  );

  const handleCreateConvercation = async () => {
    try {
      const newConversationId = await createConvercation({
        projectId,
        title: "New convo",
      });
      setSelectedconversationId(newConversationId);
      return newConversationId;
    } catch {
      toast.error("Unable to create new Conversation");
      return null;
    }
  };

  const handleSubmit = async (message: PromptInputMessage) => {
    if (isProssing && !message.text) {
      setInput("");
      return;
    }
    let conversationId = activeConversationId;

    if (!conversationId) {
      conversationId = await handleCreateConvercation();
      if (!conversationId) {
        return;
      }
    }

    try {
      await ky.post("/api/messages", {
        json: {
          conversationId,
          message: message.text,
        },
      });
    } catch {
      toast.error("Message failed to send");
      setInput("");
    }
  };

  return (
    <div className=" flex flex-col h-full">
      <div className="h-10.75 flex items-center justify-between border-b-2">
        <div className="text-sm truncate pl-3">
          {activeConversation?.title ?? "New Conversation"}
        </div>
        <div className=" flex  items-center px-1 gap-3">
          <Button variant={"outline"} size={"icon-xs"}>
            <HistoryIcon className="size-3.5" />
          </Button>
          <Button
            onClick={handleCreateConvercation}
            variant={"outline"}
            size={"icon-xs"}>
            <PlusIcon className="size-3.5" />
          </Button>
        </div>
      </div>
      <Conversation className="flex">
        <ConversationContent>
          {convercationMessages?.map((message, messageIndex) => (
            <Message key={message._id} from={message.role}>
              <MessageContent>
                {message.status == "processing" ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <LoaderIcon className="size-4 animate-spin" />
                    Thinking...
                  </div>
                ) : (
                  <MessageResponse>{message.content}</MessageResponse>
                )}
              </MessageContent>
              {message.role === "assistant" &&
                message.status === "completed" &&
                messageIndex === (convercationMessages?.length ?? 0) - 1 && (
                  <MessageActions>
                    <MessageAction
                      label="Copy"
                      onClick={() => {
                        navigator.clipboard.writeText(message.content);
                      }}>
                      <CopyIcon className="size-3" />
                    </MessageAction>
                  </MessageActions>
                )}
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="p-3">
        <PromptInput onSubmit={handleSubmit} className="mt-2">
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              disabled={isProssing}
              placeholder="Ask S7 anythink..."
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit
              disabled={isProssing ? false : !input}
              status={isProssing ? "streaming" : undefined}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};
