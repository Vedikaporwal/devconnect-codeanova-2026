import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateProjectRequest, UpdateProjectRequest } from "@workspace/shared";
import { projectsApi } from "@/lib/api";

export const projectsQueryKey = ["projects"] as const;

export function useProjects() {
  return useQuery({
    queryKey: projectsQueryKey,
    queryFn: projectsApi.list,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useProjectMutations() {
  const queryClient = useQueryClient();
  const createProject = useMutation({
    mutationFn: (input: CreateProjectRequest) => projectsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectsQueryKey }),
  });
  const updateProject = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProjectRequest }) =>
      projectsApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectsQueryKey }),
  });
  const deleteProject = useMutation({
    mutationFn: (id: string) => projectsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectsQueryKey }),
  });

  return { createProject, updateProject, deleteProject };
}