import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { projectId } from "@/types";
import {
  ChevronDownIcon,
  FileMinusIcon,
  FilePlusIcon,
  FolderPlusIcon,
} from "lucide-react";
import { useState } from "react";
import { useProject } from "../../hooks/use-projects";
import { Button } from "@/components/ui/button";
import {
  useCreateFile,
  useCreateFolder,
  useFolderContents,
} from "../../hooks/use-files";
import { CreateInput } from "./create-input";
import { LoadingRow } from "./loading-row";
import { Tree } from "./tree";

export const FileExplorer = ({ projectId }: { projectId: projectId }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [collapskey, setCollapskey] = useState(0);
  const [creating, setCreating] = useState<"file" | "folder" | null>(null);

  const project = useProject(projectId);
  const CreateFile = useCreateFile();
  const CreateFolder = useCreateFolder();
  const rootFiles = useFolderContents({ projectId, enabled: isOpen });

  const handleCreate = (name: string) => {
    setCreating(null);
    if (creating === "file") {
      CreateFile({
        projectId,
        name,
        content: "",
        parentId: undefined,
      });
    }
    if (creating === "folder") {
      CreateFolder({
        projectId,
        name,
        parentId: undefined,
      });
    }
  };

  return (
    <div className="h-full bg-sidebar/20">
      <ScrollArea>
        <div
          role="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex gap-x-2 bg-accent items-center group/project cursor-pointer">
          <ChevronDownIcon
            className={cn(
              isOpen === false && "-rotate-90",
              "size-5 duration-300",
            )}
          />
          <span className="text-xs line-clamp-1 uppercase font-semibold">
            {project?.name ?? "Loading..."}
          </span>

          <div className="flex items-center opacity-0 group-hover/project:opacity-100 transition-none duration-0 gap-0.5 ml-auto">
            <Button
              variant={"highlight"}
              size={"icon-xs"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsOpen(true);
                setCreating("file");
              }}>
              <FilePlusIcon />
            </Button>
            <Button
              variant={"highlight"}
              size={"icon-xs"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsOpen(true);
                setCreating("folder");
              }}>
              <FolderPlusIcon />
            </Button>
            <Button
              variant={"highlight"}
              size={"icon-xs"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setCollapskey((prev) => prev + 1);
              }}>
              <FileMinusIcon />
            </Button>
          </div>
        </div>

        {isOpen && (
          <>
            {rootFiles === undefined && <LoadingRow level={0} />}
            {creating && (
              <CreateInput
                type={creating}
                level={0}
                onSubmit={handleCreate}
                onCancel={() => setCreating(null)}
              />
            )}

            {rootFiles?.map((item) => (
              <Tree
                key={`${item._id}-${collapskey}`}
                item={item}
                level={0}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </ScrollArea>
    </div>
  );
};
