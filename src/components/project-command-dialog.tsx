import { useProjects } from "@/feature/projects/hooks/use-projects";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { CommandEmpty } from "cmdk";
import { getProjectIcon } from "@/feature/projects/components/project-list";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectCommandDialog = ({ onOpenChange, open }: Props) => {
  const router = useRouter();
  const projects = useProjects();
  const handleSelect = (projectId: string) => {
    router.push(`/project/${projectId}`);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="search projects..." />
      <CommandEmpty>No Project found.</CommandEmpty>
      <CommandGroup className="max-h-52 overflow-y-auto" heading={"projects"}>
        {projects?.map((project) => (
          <CommandItem
            key={project._id}
            value={`${project.name}-${project._id}`}
            onSelect={() => handleSelect(project._id)}>
            {getProjectIcon(project)}
            <span>{project.name}</span>
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandDialog>
  );
};
