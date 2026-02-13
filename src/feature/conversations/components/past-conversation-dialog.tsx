import { projectId } from "@/types";
import { Id } from "@convex/_generated/dataModel";
import { useConversations } from "../hooks/use-conversations";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { formatDistanceToNow } from "date-fns";

interface Props {
  projectId: projectId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (conversationId: Id<"conversations">) => void;
}

export const PastConversationDialog = ({
  onOpenChange,
  onSelect,
  open,
  projectId,
}: Props) => {
  const conversations = useConversations(projectId);
  const handleSelect = (conversationId: Id<"conversations">) => {
    onSelect(conversationId);
    onOpenChange(false);
  };
  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Past Conversation"
      description="Search and Select a past conversation">
      <CommandInput placeholder="Search conversation..." />
      <CommandList>
        <CommandEmpty>No Conversations Found.</CommandEmpty>
        <CommandGroup heading="conversations">
          {conversations?.map((convo) => (
            <CommandItem
              key={convo._id}
              value={`${convo.title}-${convo._id}`}
              onSelect={() => handleSelect(convo._id)}>
              <div className="flex flex-col gap-0.5">
                <span>{convo.title}</span>
                <span className="text-muted-foreground text-xs">
                  {formatDistanceToNow(convo._creationTime, {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
