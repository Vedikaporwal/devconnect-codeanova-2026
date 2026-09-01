import type { ReactNode } from "react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/store/auth-store";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <main className="devconnect-shell grain grid min-h-[100dvh] place-items-center px-5">
        <div className="text-center" data-testid="status-auth-loading">
          <span className="pulse-signal mx-auto mb-4 block h-2 w-2 rounded-full bg-primary" />
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">
            Checking your signal
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) return null;
  return children;
}