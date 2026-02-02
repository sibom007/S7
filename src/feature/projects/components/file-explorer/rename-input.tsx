import { ChevronRightIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import { getItemPadding } from "./constant";
import { cn } from "@/lib/utils";

export const RenameInput = ({
  level,
  onCancel,
  onSubmit,
  isOpen,
  defaultValue,
  type,
}: {
  type: "file" | "folder" | null;
  level: number;
  isOpen?: boolean;
  defaultValue: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const submittedRef = useRef(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    requestAnimationFrame(() => {
      input.focus();

      const value = input.value;
      const lastDotIndex = value.lastIndexOf(".");

      if (lastDotIndex > 0) {
        input.setSelectionRange(0, lastDotIndex);
      } else {
        input.select();
      }
    });
  }, []);

  const handleRename = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const trimmed = value.trim();
    if (trimmed) {
      onSubmit(trimmed);
    } else {
      onCancel();
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full flex items-center gap-1 h-5.5 bg-accent/30"
      style={{ paddingLeft: getItemPadding(level, type === "file") }}>
      <div className="flex items-center gap-0.5">
        {type === "folder" && (
          <ChevronRightIcon
            className={cn(
              "size-4 shrink-0 text-muted-foreground",
              isOpen && "rotate-90",
            )}
          />
        )}
        {type === "file" && (
          <FileIcon className="size-4" autoAssign fileName={value} />
        )}
        {type === "folder" && (
          <FolderIcon className="size-4" folderName={value} />
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 bg-transparent text-sm outline-none focus:ring-1 focus:ring-inset focus:ring-ring"
        defaultValue={defaultValue}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleRename();
          }
          if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
          }
        }}
        onBlur={handleRename}
        onFocus={(e) => {
          if (type === "folder") {
            e.currentTarget.select();
          } else {
            const value = e.currentTarget.value;
            const lastDotIndex = value.lastIndexOf(".");

            if (lastDotIndex > 0) {
              e.currentTarget.setSelectionRange(0, lastDotIndex);
            } else {
              e.currentTarget.select();
            }
          }
        }}
      />
    </div>
  );
};
