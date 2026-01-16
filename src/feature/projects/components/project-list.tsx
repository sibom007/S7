import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { useProjectsPartial } from "../hooks/use-projects";
import { Spinner } from "@/components/ui/spinner";
import { FaGithub } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { useRouter } from "next/navigation";
import { Doc } from "../../../../convex/_generated/dataModel";

interface Props {
  onViewAll: () => void;
}

export const getProjectIcon = (project: Doc<"projects">) => {
  if (project.importStatus === "completed") {
    return <FaGithub className="size-3.5 text-muted-foreground" />;
  }
  if (project.importStatus === "failed") {
    return <AlertCircleIcon className="size-3.5 text-muted-foreground" />;
  }
  if (project.importStatus === "importing") {
    return <Loader2Icon className="size-3.5 text-muted-foreground" />;
  }
};

export const ProjectsList = ({ onViewAll }: Props) => {
  const router = useRouter();
  const projects = useProjectsPartial(5);

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between">
          <h1 className="text-muted-foreground">Recent projects</h1>
          <div className="flex gap-2">
            <button onClick={onViewAll}>
              View all <kbd className="bg-accent p-0.5 rounded">Ctrl+I</kbd>
            </button>
          </div>
        </div>

        {projects?.length === 0 && (
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
        {projects === undefined && <Spinner />}

        {projects?.map((project) => {
          return (
            <button
              onClick={() => router.push(`/project/${project._id}`)}
              key={project._id}
              className="flex justify-between text-muted-foreground hover:text-foreground duration-500">
              <div className="flex gap-4 items-center">
                {getProjectIcon(project)}

                <h2>{project.name}</h2>
              </div>
              <span>{formatDistanceToNow(project.updateAt)}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
