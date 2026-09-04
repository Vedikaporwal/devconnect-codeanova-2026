import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateBlogRequest, UpdateBlogRequest } from "@workspace/shared";
import { blogsApi } from "@/lib/api";

export const blogsQueryKey = ["blogs"] as const;
export const useBlogs = () => useQuery({ queryKey: blogsQueryKey, queryFn: blogsApi.list, staleTime: 30_000 });
export const useBlog = (id: string) => useQuery({ queryKey: [...blogsQueryKey, id], queryFn: () => blogsApi.get(id), retry: false });
export function useBlogMutations() {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: blogsQueryKey });
  return {
    createBlog: useMutation({ mutationFn: (input: CreateBlogRequest) => blogsApi.create(input), onSuccess: refresh }),
    updateBlog: useMutation({ mutationFn: ({ id, input }: { id: string; input: UpdateBlogRequest }) => blogsApi.update(id, input), onSuccess: refresh }),
    deleteBlog: useMutation({ mutationFn: (id: string) => blogsApi.remove(id), onSuccess: refresh }),
  };
}