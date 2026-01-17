import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { projectId } from "@/types";

export const useCreateProject = () => {
  return useMutation(api.projects.create);
};
export const useProjects = () => {
  return useQuery(api.projects.get);
};
export const useLastProjects = () => {
  return useQuery(api.projects.lastUpdateProject);
};
export const useProjectsPartial = (limit: number) => {
  return useQuery(api.projects.getPartial, {
    limit,
  });
};

export const useProject = (projectId: projectId) => {
  return useQuery(api.projects.getOne, {
    id: projectId,
  });
};

export const useRename = () => {
  return useMutation(api.projects.rename);
};
