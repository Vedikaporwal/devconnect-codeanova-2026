import { useState } from "react";
import { Code2, FolderKanban, Home, LogOut, Menu, UserRound, X, PenLine, UsersRound } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";

const navigation = [
  { href: "/app", label: "Overview", icon: Home },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/blogs", label: "Blogs", icon: PenLine },
  { href: "/discover", label: "Discover", icon: UsersRound },
];

const initialsFor = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    toast({ title: "Session closed", description: "Your signal is safely signed out." });
    setLocation("/");
  };

  return (
    <div className="devconnect-shell grain min-h-[100dvh]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-border bg-background/80 px-5 py-6 backdrop-blur-xl lg:flex">
        <Link href="/app" className="group flex items-center gap-3 px-2" data-testid="link-shell-logo">
          <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-primary text-primary-foreground transition-transform duration-300 group-hover:rotate-12">
            <Code2 size={17} strokeWidth={2.8} />
          </span>
          <span className="text-[15px] font-semibold tracking-[-.02em]">dev<span className="text-primary">connect</span></span>
        </Link>

        <div className="mt-14 px-2 font-mono text-[9px] uppercase tracking-[.2em] text-muted-foreground">Workspace</div>
        <nav className="mt-3 space-y-1" aria-label="Workspace navigation">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                data-testid={`link-shell-${label.toLowerCase()}`}
              >
                <Icon size={16} strokeWidth={active ? 2.4 : 1.8} />
                <span>{label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="mb-4 rounded-2xl border border-border bg-secondary/40 p-3">
            <div className="flex items-center gap-3">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={`${user.name}'s avatar`} className="h-9 w-9 rounded-xl object-cover" data-testid="img-shell-avatar" />
              ) : (
                <div className="grid h-9 w-9 place-items-center rounded-xl border border-primary/30 bg-primary/10 font-mono text-[11px] text-primary" data-testid="avatar-shell-placeholder">
                  {initialsFor(user?.name ?? "") || "DC"}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium" data-testid="text-shell-user">{user?.name}</p>
                <p className="truncate font-mono text-[9px] text-muted-foreground">@{user?.username}</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 px-3 text-xs text-muted-foreground hover:text-foreground" data-testid="button-logout">
            <LogOut size={15} /> Log out
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/75 px-5 py-4 backdrop-blur-xl lg:hidden">
        <Link href="/app" className="flex items-center gap-3" data-testid="link-mobile-shell-logo">
          <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-primary text-primary-foreground"><Code2 size={17} /></span>
          <span className="text-[15px] font-semibold">dev<span className="text-primary">connect</span></span>
        </Link>
        <button onClick={() => setMobileOpen((open) => !open)} className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground" aria-label="Toggle workspace navigation" data-testid="button-shell-menu">
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[65px] z-20 border-b border-border bg-background px-5 py-4 shadow-2xl lg:hidden" data-testid="menu-shell-mobile">
          <nav className="space-y-1" aria-label="Mobile workspace navigation">
            {navigation.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${location === href ? "bg-primary/10 text-primary" : "text-muted-foreground"}`} data-testid={`link-mobile-shell-${label.toLowerCase()}`}>
                <Icon size={16} /> {label}
              </Link>
            ))}
          </nav>
          <Button variant="ghost" onClick={handleLogout} className="mt-2 w-full justify-start gap-3 px-3 text-xs text-muted-foreground" data-testid="button-mobile-shell-logout"><LogOut size={15} /> Log out</Button>
        </div>
      )}
      <div className="min-w-0 lg:pl-[248px]">{children}</div>
    </div>
  );
}