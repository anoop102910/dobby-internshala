import { useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import { useCustomQuery, useCustomMutation } from '@/hooks/use-query-hooks';

interface Image {
  _id: string;
  imageUrl: string;
  name: string;
  size: number;
  type: string;
  folderId?: string;
  createdAt: string;
  updatedAt: string;
}

interface ImageCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useImages = (folderId?: string) => {
  const { data: images, ...rest } = useCustomQuery({
    queryKey: ['images', folderId],
    queryFn: () => apiService.images.getImages(folderId || 'root'),
  });

  return { images, ...rest };
};

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  const { mutate: uploadImageMutation, ...rest } = useCustomMutation({
    mutationFn: ({ file, folderId }: { file: File; folderId?: string }) => {
      const formData = new FormData();
      formData.append("image", file);
      if (folderId) {
        formData.append("folderId", folderId);
      }
      return apiService.images.uploadImage(formData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['images', variables.folderId] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  const uploadImage = (data: { file: File; folderId?: string }, callbacks?: ImageCallbacks) => {
    return uploadImageMutation(data, {
      onSuccess: () => {
        callbacks?.onSuccess?.();
      },
      onError: (error) => {
        callbacks?.onError?.(error);
      },
    });
  };

  return { uploadImage, ...rest };
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteImageMutation, ...rest } = useCustomMutation({
    mutationFn: apiService.images.deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  const deleteImage = (imageId: string, callbacks?: ImageCallbacks) => {
    return deleteImageMutation(imageId, {
      onSuccess: () => {
        callbacks?.onSuccess?.();
      },
      onError: (error) => {
        callbacks?.onError?.(error);
      },
    });
  };

  return { deleteImage, ...rest };
}; 
