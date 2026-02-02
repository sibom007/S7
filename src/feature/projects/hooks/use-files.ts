import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { projectId } from "@/types";
import { Id } from "../../../../convex/_generated/dataModel";

export const useCreateFile = () => {
  return useMutation(api.files.createFile);
};
export const useCreateFolder = () => {
  return useMutation(api.files.createFolder);
};
export const useRenameFile = () => {
  return useMutation(api.files.renameFile);
};
export const useDeleteFile = () => {
  return useMutation(api.files.deleteFile);
};

export const useFolderContents = ({
  projectId,
  enabled,
  parentId,
}: {
  projectId: projectId;
  parentId?: Id<"files">;
  enabled?: boolean;
}) => {
  return useQuery(
    api.files.getFolderContants,
    enabled ? { projectId, parentId } : "skip",
  );
};
