import { z } from "zod";

export const createFolderSchema = z.object({
  name: z
    .string()
    .min(1, "Folder name is required")
    .max(255, "Folder name must not exceed 255 characters"),
  parentId: z.string().optional(),
});

export const renameFolderSchema = z.object({
  name: z
    .string()
    .min(1, "Folder name is required")
    .max(255, "Folder name must not exceed 255 characters"),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>; 