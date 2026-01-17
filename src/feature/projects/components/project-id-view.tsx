"use client";

import { projectId } from "@/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Tab } from "@/components/project-id-tab";
import { FaGithub } from "react-icons/fa";

export const ProjectIdView = ({ projectId }: { projectId: projectId }) => {
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");

  return (
    <div>
      <nav className=" border-b h-11 flex items-center">
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
          <div className="flex items-center gap-2 h-full cursor-pointer px-3 text-muted-foreground border-r hover:bg-accent/30">
            <FaGithub className="size-3.5" />
            <span>Export</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 relative">
        <div
          className={cn(
            "absolute inset-0",
            activeView === "editor" ? "visible" : "invisible",
          )}>
          Editor
        </div>
        <div
          className={cn(
            "absolute inset-0",
            activeView === "preview" ? "visible" : "invisible",
          )}>
          Preview
        </div>
      </div>
    </div>
  );
};
