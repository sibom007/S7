import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { projectId } from "@/types";

import { Doc } from "../../../../../convex/_generated/dataModel";
import {
  useCreateFile,
  useCreateFolder,
  useDeleteFile,
  useFolderContents,
  useRenameFile,
} from "../../hooks/use-files";

import { TreeItemWrapper } from "./tree-item-wrapper";
import { LoadingRow } from "./loading-row";
import { CreateInput } from "./create-input";
import { RenameInput } from "./rename-input";

export const Tree = ({
  item,
  level,
  projectId,
}: {
  item: Doc<"files">;
  level: number;
  projectId: projectId;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [creating, setCreating] = useState<"file" | "folder" | null>(null);

  const createFile = useCreateFile();
  const createFolder = useCreateFolder();
  const renameFile = useRenameFile();
  const deleteFile = useDeleteFile();

  const folderContents = useFolderContents({
    projectId,
    parentId: item._id,
    enabled: item.type === "folder" && isOpen,
  });

  const handleCreate = (name: string) => {
    if (!name.trim()) {
      setCreating(null);
      return;
    }

    const type = creating;
    setCreating(null);

    if (type === "file") {
      createFile({
        projectId,
        name: name.trim(),
        content: "",
        parentId: item._id,
      });
    } else if (type === "folder") {
      createFolder({
        projectId,
        name: name.trim(),
        parentId: item._id,
      });
    }
  };

  const handleRename = (newName: string) => {
    setIsRenaming(false);
    if (newName == item.name) {
      return;
    }
    renameFile({ id: item._id, newName: newName });
  };

  const startCreating = (type: "file" | "folder") => {
    setIsOpen(true);
    setCreating(type);
  };

  /* ===================== FILE ===================== */

  if (item.type === "file") {
    const fileName = item.name;
    if (isRenaming) {
      return (
        <RenameInput
          defaultValue={fileName}
          isOpen={isOpen}
          level={level}
          onSubmit={handleRename}
          onCancel={() => setIsRenaming(false)}
          type={"file"}
        />
      );
    }

    return (
      <TreeItemWrapper
        item={item}
        level={level}
        isActive={false}
        onRename={() => setIsRenaming(true)}
        onDelete={() => deleteFile({ id: item._id })}>
        <FileIcon autoAssign fileName={item.name} className="size-4" />
        <span className="truncate text-sm">{item.name}</span>
      </TreeItemWrapper>
    );
  }

  /* ===================== FOLDER ===================== */

  if (item.type === "folder" && isRenaming) {
    return (
      <RenameInput
        type="folder"
        level={level}
        defaultValue={item.name}
        isOpen={isOpen}
        onSubmit={handleRename}
        onCancel={() => setIsRenaming(false)}
      />
    );
  }

  const folderContent = (
    <>
      <div className="flex items-center gap-0.5">
        <ChevronRightIcon
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            isOpen && "rotate-90",
          )}
        />
        <FolderIcon folderName={item.name} className="size-4" />
      </div>
      <span className="truncate text-sm">{item.name}</span>
    </>
  );

  return (
    <>
      <TreeItemWrapper
        item={item}
        level={level}
        isActive={false}
        onClick={() => setIsOpen((v) => !v)}
        onRename={() => setIsRenaming(true)}
        onDelete={() => deleteFile({ id: item._id })}
        onCreateFile={() => startCreating("file")}
        onCreateFolder={() => startCreating("folder")}>
        {folderContent}
      </TreeItemWrapper>

      {isOpen && (
        <>
          {folderContents === undefined && <LoadingRow level={level + 1} />}

          {creating && (
            <CreateInput
              type={creating}
              level={level + 1}
              onSubmit={handleCreate}
              onCancel={() => setCreating(null)}
            />
          )}

          {folderContents?.map((subItem) => (
            <Tree
              key={subItem._id}
              item={subItem}
              level={level + 1}
              projectId={projectId}
            />
          ))}
        </>
      )}
    </>
  );
};
