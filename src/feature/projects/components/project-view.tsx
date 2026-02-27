"use client";

import Image from "next/image";
import { Sparkle, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { getProjectIcon, ProjectsList } from "./project-list";
import { useLastProjects } from "../hooks/use-projects";
import { Kbd } from "@/components/ui/kbd";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProjectCommandDialog } from "@/components/project-command-dialog";
import { useShortcut } from "@/hooks/use-shortcut";
import { ImportGithubDialog } from "./import-github-dialog";
import { NewProjectDialog } from "./new-project-dialog";
import { Allotment } from "allotment";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

const DEFAULT_SIDEBAR_WIDTH = 350;
const DEFAULT_MAIN_SIZE = 200;

export const ProjectView = () => {
  const [isOpen, setIsopen] = useState(false);
  const [isOpenImportGitHub, setIsOpenImportGithub] = useState(false);
  const [isOpenNewProject, setIsOpenNewProject] = useState(false);
  const router = useRouter();
  const lastProject = useLastProjects();

  useShortcut({ key: "k", ctrl: true }, () => {
    setIsopen(!isOpen);
  });

  useShortcut({ key: "b", ctrl: true }, () => {
    setIsOpenImportGithub(!isOpenImportGitHub);
  });

  useShortcut({ key: "f", ctrl: true }, () => {
    setIsOpenNewProject(!isOpenNewProject);
  });

  if (lastProject === undefined) {
    return (
      <main className="h-screen w-full bg-sidebar flex items-center justify-center">
        <Spinner />
      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-sidebar">
      <ProjectCommandDialog open={isOpen} onOpenChange={setIsopen} />
      <ImportGithubDialog
        open={isOpenImportGitHub}
        onOpenChange={setIsOpenImportGithub}
      />
      <NewProjectDialog
        open={isOpenNewProject}
        onOpenChange={setIsOpenNewProject}
      />

      <Allotment
        defaultSizes={[DEFAULT_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE]}
        className="h-screen">
        <Allotment.Pane snap minSize={200} maxSize={400} preferredSize={400}>
          <div className="h-full w-full border-r border-white/5 p-4">
            <ProjectsList onViewAll={() => setIsopen(!isOpen)} />
          </div>
        </Allotment.Pane>

        {/* RIGHT PANE — Existing create project UI */}
        <Allotment.Pane minSize={300}>
          <div className="min-h-full flex flex-col items-center justify-center p-6 md:p-16">
            <div className="w-full max-w-sm mx-auto flex flex-col gap-4 items-center">
              <div className="flex items-center justify-between w-full">
                <Link href={"/"}>
                  <div className="flex items-center gap-2 w-full">
                    <Image
                      src={"/logo.svg"}
                      alt="logo"
                      width={20}
                      height={20}
                      className="size-8 md:size-11.5"
                    />
                    <h1 className="text-3xl md:text-5xl font-semibold">S7</h1>
                  </div>
                </Link>
              </div>

              <div className="flex flex-col gap-4 w-full">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => setIsOpenNewProject(true)}
                    variant="outline"
                    className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none border-white/5!">
                    <div className="flex items-center justify-between w-full p-1">
                      <Sparkle className="size-4" />
                      <Kbd className="bg-muted-foreground/10">Ctrl + F</Kbd>
                    </div>
                    <span className="text-sm">New</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none border-white/5!"
                    onClick={() => setIsOpenImportGithub(true)}>
                    <div className="flex items-center justify-between w-full p-1">
                      <FaGithub className="size-4" />
                      <Kbd className="bg-muted-foreground/10">Ctrl + B</Kbd>
                    </div>
                    <span className="text-sm">Import</span>
                  </Button>
                </div>
              </div>

              {lastProject.length !== 0 && (
                <div className="flex flex-col gap-4 w-full">
                  <h1 className="text-sm text-muted-foreground">Last update</h1>

                  {lastProject?.map((project) => (
                    <Button
                      key={project._id}
                      onClick={() => router.push(`/projects/${project._id}`)}
                      variant="outline"
                      className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none border-white/5! ">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4 w-full">
                          {getProjectIcon(project)}
                          <span className="text-sm truncate max-w-40">
                            {project.name}
                          </span>
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground " />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(project.updateAt)}
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Allotment.Pane>
      </Allotment>
    </main>
  );
};
