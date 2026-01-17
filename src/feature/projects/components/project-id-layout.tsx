"use client";

import React, { useState } from "react";
import { Navbar } from "./project-navbar";
import { projectId } from "@/types";
import { Allotment } from "allotment";

import "allotment/dist/style.css";

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_CONVERSATION_SIDEBAR_WIDTH = 400;
const DEFAULT_MAIN_SIZE = 1000;

export const ProjectIdLayout = ({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: projectId;
}) => {
  return (
    <div className="flex h-screen flex-col">
      <Navbar projectId={projectId} />
      <div className="flex-1 flex overflow-hidden">
        <Allotment
          className="flex-1"
          defaultSizes={[
            DEFAULT_CONVERSATION_SIDEBAR_WIDTH,
            DEFAULT_MAIN_SIZE,
          ]}>
          <Allotment.Pane
            minSize={MIN_SIDEBAR_WIDTH}
            maxSize={MAX_SIDEBAR_WIDTH}
            preferredSize={DEFAULT_CONVERSATION_SIDEBAR_WIDTH}
            snap>
            Convercation side bar
          </Allotment.Pane>
          <Allotment.Pane>{children}</Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};
