import { projectId } from "@/types";
import { TopNavigation } from "./top-navigation";
import { useEditor } from "../hooks/use-editor";
import { FileBreadcrumbs } from "./file-breadcrumbs";
import { useFile, useUpdateFile } from "@/feature/projects/hooks/use-files";
import Image from "next/image";
import { FileIcon } from "lucide-react";
import { CodeEditor } from "./code-editor";
import { useRef } from "react";

export const FileEditorView = ({ projectId }: { projectId: projectId }) => {
  const { activeTabId } = useEditor(projectId);
  const activeFile = useFile(activeTabId);
  const updateFile = useUpdateFile();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-center">
        <TopNavigation projectId={projectId} />
      </div>
      {activeFile && <FileBreadcrumbs projectId={projectId} />}

      <div className="min-h-0 bg-background flex-1 flex">
        {!activeFile && (
          <div className="size-full flex items-center flex-col justify-center">
            <Image
              src="/logo-alt.svg"
              alt="logo"
              width={70}
              height={70}
              className="opacity-50"
            />
            <p className="mt-3 text-muted-foreground flex items-center gap-1.5">
              <FileIcon className="size-4" />
              Open a File
            </p>
          </div>
        )}
        {activeFile && (
          <div className="flex-1 min-h-0">
            <CodeEditor
              key={activeFile._id}
              initialValue={activeFile.content ?? ""}
              fileName={activeFile.name}
              onChange={(content: string) => {
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = setTimeout(() => {
                  updateFile({ id: activeFile._id, content });
                }, 1500);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
