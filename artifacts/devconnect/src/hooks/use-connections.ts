import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { connectionsApi } from "@/lib/api";

export const connectionsQueryKey = ["connections"] as const;
export const useConnections = () => useQuery({ queryKey: connectionsQueryKey, queryFn: connectionsApi.list, staleTime: 15_000, retry: 1 });
export function useConnectionMutations() { const client = useQueryClient(); const refresh = () => client.invalidateQueries({ queryKey: connectionsQueryKey }); return { create: useMutation({ mutationFn: connectionsApi.create, onSuccess: refresh }), accept: useMutation({ mutationFn: connectionsApi.accept, onSuccess: refresh }), reject: useMutation({ mutationFn: connectionsApi.reject, onSuccess: refresh }), remove: useMutation({ mutationFn: connectionsApi.remove, onSuccess: refresh }) }; }