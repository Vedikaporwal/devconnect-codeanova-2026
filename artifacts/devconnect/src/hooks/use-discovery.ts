import { useQuery } from "@tanstack/react-query";
import { discoveryApi } from "@/lib/api";

export function useDiscovery(filters: { search: string; skill: string; location: string }) {
  return useQuery({ queryKey: ["developers", filters], queryFn: () => discoveryApi.list(filters), staleTime: 30_000, retry: 1 });
}