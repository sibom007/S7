"use client";

import Image from "next/image";
import { Sparkle, ArrowRight, Globe2Icon } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ProjectsList } from "./project-list";
import { useCreateProject, useLastProjects } from "../hooks/use-projects";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProjectCommandDialog } from "@/components/project-command-dialog";
import { useShortcut } from "@/hooks/use-shortcut";

export const ProjectView = () => {
  const [isOpen, setIsopen] = useState(false);
  const router = useRouter();
  const createProject = useCreateProject();
  const lastProject = useLastProjects();

  const handleCreateProjects = () => {
    createProject({ name: "sibdfsdfom" });
  };

  useShortcut({ key: "k", ctrl: true }, () => {
    setIsopen(!isOpen);
  });
  return (
    <>
      <ProjectCommandDialog open={isOpen} onOpenChange={setIsopen} />
      <div className="min-h-screen bg-sidebar flex flex-col items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-sm mx-auto flex flex-col gap-4 items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 w-full group/logo">
              <Image
                src={"/logo.svg"}
                alt="logo"
                width={20}
                height={20}
                className="size-8 md:size-11.5"
              />
              <h1 className="text-4xl md:text-5xl font-semibold">S7</h1>
            </div>
          </div>

          {/* create and Import projects */}
          <div className="flex flex-col gap-4 w-full">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleCreateProjects}
                variant={"outline"}
                className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none border-white/5!">
                <div className="flex items-center justify-between w-full p-1">
                  <Sparkle className="size-4" />
                  <kbd className="bg-accent p-0.5 rounded">Ctrl+J</kbd>
                </div>
                <div>
                  <span className="text-sm">New</span>
                </div>
              </Button>
              <Button
                variant={"outline"}
                className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none border-white/5!">
                <div className="flex items-center justify-between w-full p-1">
                  <FaGithub className="size-4" />
                  <kbd className="bg-accent p-0.5 rounded">Ctrl+I</kbd>
                </div>
                <div>
                  <span className="text-sm">Import</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Last view project */}
          <div className="flex flex-col gap-4 w-full">
            <h1 className="text-sm text-muted-foreground">Last update</h1>

            {lastProject?.length === 0 && (
              <Empty className="bg-background/10">
                <EmptyHeader>
                  <EmptyTitle>No Projects Yet</EmptyTitle>
                  <EmptyDescription>
                    You haven&apos;t created any projects yet. Get started by
                    creating your first project.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
            {lastProject?.map((lastProject) => {
              return (
                <Button
                  onClick={() => router.push(`/project/${lastProject._id}`)}
                  key={lastProject._id}
                  variant={"outline"}
                  className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none border-white/5!">
                  <div className="flex items-center justify-between w-full p-1">
                    <h1 className="gap-1 flex items-center">
                      {lastProject.exportRepoUrl ? (
                        <FaGithub className="size-4" />
                      ) : (
                        <Globe2Icon className="size-4" />
                      )}
                      <span className="text-sm">{lastProject.name}</span>
                    </h1>
                    <span>
                      <ArrowRight className="size-4 text-muted-foreground" />
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(lastProject.updateAt)}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Recent Projects */}
          <ProjectsList onViewAll={() => setIsopen(true)} />
        </div>
      </div>
    </>
  );
};
