import { UserPlus, UserRoundCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConnectionMutations, useConnections } from "@/hooks/use-connections";
import { useAuthStore } from "@/store/auth-store";
import { ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function ConnectionActions({ userId }: { userId: string }) {
  const { user, isAuthenticated } = useAuthStore(); const query = useConnections(); const mutations = useConnectionMutations(); const { toast } = useToast();
  if (!isAuthenticated || !user || user.id === userId) return null;
  const connection = [...(query.data?.incoming ?? []), ...(query.data?.outgoing ?? [])].find((item) => item.senderId === userId || item.receiverId === userId);
  const pendingIncoming = connection?.status === "PENDING" && connection.receiverId === user.id;
  const pendingOutgoing = connection?.status === "PENDING" && connection.senderId === user.id;
  const run = async (action: () => Promise<unknown>, message: string) => { try { await action(); toast({ title: message }); } catch (error) { toast({ title: error instanceof ApiError ? error.message : "Connection action failed", variant: "destructive" }); } };
  if (connection?.status === "ACCEPTED") return <Button variant="outline" className="gap-2" disabled={mutations.remove.isPending} onClick={() => void run(() => mutations.remove.mutateAsync(connection.id), "Connection removed")}><UserRoundCheck size={15} /> Connected</Button>;
  if (pendingIncoming) return <div className="flex flex-wrap gap-2"><Button className="gap-2" disabled={mutations.accept.isPending} onClick={() => void run(() => mutations.accept.mutateAsync(connection.id), "Connection accepted")}><UserRoundCheck size={15} /> Accept</Button><Button variant="outline" className="gap-2" disabled={mutations.reject.isPending} onClick={() => void run(() => mutations.reject.mutateAsync(connection.id), "Request declined")}><X size={15} /> Reject</Button></div>;
  if (pendingOutgoing) return <Button variant="outline" className="gap-2" disabled={mutations.remove.isPending} onClick={() => void run(() => mutations.remove.mutateAsync(connection.id), "Request withdrawn")}><X size={15} /> Pending</Button>;
  return <Button className="gap-2" disabled={mutations.create.isPending} onClick={() => void run(() => mutations.create.mutateAsync(userId), "Connection request sent")}><UserPlus size={15} /> Connect</Button>;
}