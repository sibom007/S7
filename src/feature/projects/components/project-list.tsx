import { AlertCircleIcon, Globe2Icon, Loader2Icon } from "lucide-react";
import { useProjectsPartial } from "../hooks/use-projects";
import { FaGithub } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { useRouter } from "next/navigation";
import { Doc } from "@convex/_generated/dataModel";
import { Kbd } from "@/components/ui/kbd";
import { useShortcut } from "@/hooks/use-shortcut";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  onViewAll: () => void;
}

export const getProjectIcon = (project: Doc<"projects">) => {
  if (project.importStatus === "importing") {
    return (
      <Loader2Icon className="size-4 sm:size-5 animate-spin text-muted-foreground shrink-0" />
    );
  }

  if (project.importStatus === "failed") {
    return (
      <AlertCircleIcon className="size-4 sm:size-5 text-muted-foreground shrink-0" />
    );
  }

  if (project.exportRepoUrl || project.importStatus === "completed") {
    return (
      <FaGithub className="size-4 sm:size-5 text-muted-foreground shrink-0" />
    );
  }

  return (
    <Globe2Icon className="size-4 sm:size-5 text-muted-foreground shrink-0" />
  );
};

export const ProjectsList = ({ onViewAll }: Props) => {
  const router = useRouter();
  const projects = useProjectsPartial(5);

  useShortcut({ key: "i", ctrl: true }, () => {
    onViewAll();
  });

  // Loading skeleton (responsive)
  if (projects === undefined) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b py-2 border-muted-foreground/40">
          <h1 className="text-lg sm:text-xl font-medium text-muted-foreground">
            Recent projects
          </h1>
          <Button onClick={onViewAll} variant="outline" size="sm">
            View all <Kbd className="bg-muted-foreground/10">Ctrl + I</Kbd>
          </Button>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-28 sm:w-40" />
              </div>
              <Skeleton className="h-3 w-12 sm:w-16 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header (responsive) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b py-2 border-muted-foreground/40">
        <h1 className="text-lg sm:text-xl font-medium text-muted-foreground">
          Recent projects
        </h1>

        <Button onClick={onViewAll} variant="outline" size="sm">
          View all <Kbd className="bg-muted-foreground/10">Ctrl + I</Kbd>
        </Button>
      </div>

      {/* Empty state */}
      {projects.length === 0 && (
        <Empty className="bg-muted/10 mt-4">
          <EmptyHeader>
            <EmptyTitle>No Projects Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any projects yet. Get started by creating
              your first project.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {/* Scrollable responsive list */}
      {projects.length > 0 && (
        <ScrollArea className="flex-1 mt-3 pr-2">
          <div className="flex flex-col gap-1">
            {projects.map((project) => (
              <button
                key={project._id}
                onClick={() => router.push(`/projects/${project._id}`)}
                className="w-full flex items-center justify-between gap-3 rounded-md px-2 py-2 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/30 transition-colors">
                {/* Left side */}
                <div className="flex items-center gap-3 min-w-0">
                  {getProjectIcon(project)}

                  <h4 className="text-sm sm:text-base font-medium truncate">
                    {project.name}
                  </h4>
                </div>

                {/* Right side (date) */}
                <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap shrink-0">
                  {formatDistanceToNow(project.updateAt)}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
