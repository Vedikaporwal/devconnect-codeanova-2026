import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
export const useDashboard = () => useQuery({ queryKey: ["dashboard"], queryFn: dashboardApi.get, staleTime: 15_000, retry: 1 });