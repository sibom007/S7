"use client";

import { projectId } from "@/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Tab } from "@/components/project-id-tab";
import { Allotment } from "allotment";
import { FileExplorer } from "./file-explorer";
import { FileEditorView } from "../../editor/components/editor-view";
import { PreviewView } from "./preview-view";
import { ExportPopover } from "./export-popover";


const DEFAULT_SIDEBAR_WIDTH = 350;
const DEFAULT_MAIN_SIZE = 1000;

export const ProjectIdView = ({ projectId }: { projectId: projectId }) => {
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");

  return (
    <div className="h-full flex flex-col min-h-0">
      <nav className="shrink-0 border-b h-11 flex items-center">
        <Tab
          label="code"
          onClick={() => setActiveView("editor")}
          isActive={activeView === "editor"}
        />
        <Tab
          label="preview"
          onClick={() => setActiveView("preview")}
          isActive={activeView === "preview"}
        />
        <div className="flex-1 justify-end flex h-full">
          <ExportPopover projectId={projectId} />
        </div>
      </nav>

      <div className="flex-1 min-h-0 relative">
        <div
          className={cn(
            "absolute inset-0",
            activeView === "editor" ? "visible" : "invisible",
          )}>
          <Allotment defaultSizes={[DEFAULT_SIDEBAR_WIDTH]} className="h-full">
            <Allotment.Pane
              snap
              // maxSize={MAX_SIDEBAR_WIDTH}
              // minSize={MIN_SIDEBAR_WIDTH}
              minSize={200}
              maxSize={800}
              preferredSize={DEFAULT_MAIN_SIZE}>
              <FileExplorer projectId={projectId} />
            </Allotment.Pane>
            <Allotment.Pane
              snap
              // maxSize={MAX_SIDEBAR_WIDTH}
              // minSize={MIN_SIDEBAR_WIDTH}
              minSize={300}
              preferredSize={DEFAULT_MAIN_SIZE}>
              <FileEditorView projectId={projectId} />
            </Allotment.Pane>
          </Allotment>
        </div>
        <div
          className={cn(
            "absolute inset-0",
            activeView === "preview" ? "visible" : "invisible",
          )}>
          <PreviewView projectId={projectId} />
        </div>
      </div>
    </div>
  );
};
