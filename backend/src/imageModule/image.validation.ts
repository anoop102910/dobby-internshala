import { z } from "zod";

export const uploadImageSchema = z.object({
  folderId: z.string().optional(),
  file: z.any()
    .refine((file) => file?.mimetype?.startsWith('image/'), {
      message: 'File must be an image',
    })
    .refine((file) => file?.size <= 5 * 1024 * 1024, {
      message: 'Image must be less than 5MB',
    }),
});

export type UploadImageInput = z.infer<typeof uploadImageSchema>; 