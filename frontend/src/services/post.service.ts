import { useQueryClient } from '@tanstack/react-query';
import { apiService } from './api.service';
import { useCustomQuery, useCustomMutation } from '@/hooks/use-query-hooks';

export const usePosts = () => {
  const { data, ...rest } = useCustomQuery({
    queryKey: ['posts'],
    queryFn: apiService.posts.getAll,
  });
  console.log(data);
  return { postsData: data, ...rest };
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  const { mutate: createPost, ...rest } = useCustomMutation({
    mutationFn: apiService.posts.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  }); 
  return { createPost, ...rest };
}; 