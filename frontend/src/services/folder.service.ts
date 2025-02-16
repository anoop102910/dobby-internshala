import { useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import { useCustomQuery, useCustomMutation } from '@/hooks/use-query-hooks';

interface Folder {
  _id: string;
  name: string;
  size: number;
  itemsCount: number;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateFolderInput {
  name: string;
  parentId?: string;
}

interface FolderCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useFolders = (parentId?: string) => {
  const { data: foldersData, ...rest } = useCustomQuery({
    queryKey: ['folders', parentId],
    queryFn: () => apiService.folders.getFolders(parentId),
  });

  return { foldersData, ...rest };
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  const { mutate: createFolderMutation, ...rest } = useCustomMutation({
    mutationFn: apiService.folders.createFolder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  const createFolder = (data: CreateFolderInput, callbacks?: FolderCallbacks) => {
    return createFolderMutation(data, {
      onSuccess: () => {
        callbacks?.onSuccess?.();
      },
      onError: (error) => {
        callbacks?.onError?.(error);
      },
    });
  };

  return { createFolder, ...rest };
};

export const useRenameFolder = () => {
  const queryClient = useQueryClient();

  const { mutate: renameFolderMutation, ...rest } = useCustomMutation({
    mutationFn: ({ folderId, name }: { folderId: string; name: string }) => 
      apiService.folders.updateFolder(folderId, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  const renameFolder = (data: { folderId: string; name: string }, callbacks?: FolderCallbacks) => {
    return renameFolderMutation(data, {
      onSuccess: () => {
        callbacks?.onSuccess?.();

      },
      onError: (error) => {
        callbacks?.onError?.(error);
      },
    });
  };

  return { renameFolder, ...rest };
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteFolderMutation, ...rest } = useCustomMutation({
    mutationFn: apiService.folders.deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  const deleteFolder = (folderId: string, callbacks?: FolderCallbacks) => {
    return deleteFolderMutation(folderId, {
      onSuccess: () => {
        callbacks?.onSuccess?.();
      },
      onError: (error) => {
        callbacks?.onError?.(error);
      },
    });
  };

  return { deleteFolder, ...rest };
}; 