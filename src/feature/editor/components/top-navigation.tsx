import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { projectId } from "@/types";
import { useEditor } from "../hooks/use-editor";
import { Id } from "../../../../convex/_generated/dataModel";
import { useFile } from "@/feature/projects/hooks/use-files";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { FileIcon } from "@react-symbols/icons/utils";
import { XIcon } from "lucide-react";

export const TopNavigation = ({ projectId }: { projectId: projectId }) => {
  const { openTabs } = useEditor(projectId);
  return (
    <ScrollArea className="flex-1">
      <nav className="bg-sidebar flex items-center h-8.75 border-b">
        {openTabs.map((fileId, i) => (
          <Tab
            key={fileId}
            fileId={fileId}
            isFirst={i === 0}
            projectId={projectId}
          />
        ))}
      </nav>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

const Tab = ({
  fileId,
  isFirst,
  projectId,
}: {
  fileId: Id<"files">;
  isFirst: boolean;
  projectId: projectId;
}) => {
  const file = useFile(fileId);
  const {
    activeTabId,

    closeTab,
    openFile,

    previewTabId,
    setActiveTab,
  } = useEditor(projectId);

  const isActive = activeTabId === fileId;
  const isPreview = previewTabId === fileId;
  const fileName = file?.name ?? "loding...";

  return (
    <div
      onClick={() => setActiveTab(fileId)}
      onDoubleClick={() => openFile(fileId, { pinned: true })}
      className={cn(
        "flex items-center gap-2 h-8.75 pl-2 pr-1.5 cursor-pointer text-muted-foreground group border-y border-x border-transparent hover:bg-accent/30",
        isActive &&
          "bg-background text-foreground border-c-border border-background  -mb-px drop-shadow",
        isFirst && "border-l-transparent",
      )}>
      {file === undefined ? (
        <Spinner className="text-ring" />
      ) : (
        <FileIcon className="size-4" fileName={fileName} />
      )}

      <span className={cn("text-sm whitespace-nowrap", isPreview && "italic")}>
        {fileName}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          closeTab(fileId);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
            e.preventDefault();
            closeTab(fileId);
          }
        }}
        className={cn(
          "p-ø.5 rounded-sm hover:bg-white/10 opacity—0 group-hover:opacity-100 ",
          isActive && "opacity—100",
        )}>
        <XIcon className="size-3" />
      </button>
    </div>
  );
};
