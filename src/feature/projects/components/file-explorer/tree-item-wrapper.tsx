import React from "react";
import { Doc } from "@convex/_generated/dataModel";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { getItemPadding } from "./constant";

export const TreeItemWrapper = ({
  item,
  children,
  level = 0,
  isActive,
  onClick,
  onDoubleClick,
  onRename,
  onDelete,
  onCreateFile,
  onCreateFolder,
}: {
  item: Doc<"files">;
  children: React.ReactNode;
  level: number;
  isActive?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onCreateFile?: () => void;
  onCreateFolder?: () => void;
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onRename?.();
            }
          }}
          className={cn(
            "group flex items-center gap-1 w-full h-5.5 hover:bg-accent/30 outline-none focus:ring-1 focus:ring-inset focus:ring-ring",
            isActive && "bg-accent/30",
          )}
          style={{ paddingLeft: getItemPadding(level, item.type === "file") }}>
          {children}
        </button>
      </ContextMenuTrigger>

      <ContextMenuContent
        className="w-64"
        onCloseAutoFocus={(e) => e.preventDefault()}>
        {item.type === "folder" && (
          <>
            <ContextMenuItem
              className="text-sm"
              onClick={(e) => {
                e.stopPropagation();
                onCreateFile?.();
              }}>
              New File...
            </ContextMenuItem>
            <ContextMenuItem
              className="text-sm"
              onClick={(e) => {
                e.stopPropagation();
                onCreateFolder?.();
              }}>
              New Folder...
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        <ContextMenuItem
          className="text-sm"
          onClick={(e) => {
            e.stopPropagation();
            onRename?.();
          }}>
          Rename...
          <ContextMenuShortcut>Enter</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          className="text-sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}>
          Delete...
          <ContextMenuShortcut>BackSpace</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
