import { ArrowUpRight, FolderKanban, Plus, UserRound, Zap } from "lucide-react";
import { Link } from "wouter";
import { AppShell } from "@/components/app-shell";
import { ProjectCard } from "@/components/project-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/hooks/use-projects";
import { useAuthStore } from "@/store/auth-store";

const initialsFor = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");

export default function AppHome() {
  const { user } = useAuthStore();
  const projectsQuery = useProjects();
  const projects = projectsQuery.data ?? [];
  const firstName = user?.name.split(" ")[0] ?? "builder";
  const profileComplete = [user?.headline, user?.bio, user?.githubUrl, user?.portfolioUrl].filter(Boolean).length;

  return (
    <AppShell>
      <div className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[440px] opacity-50" />
        <header className="relative flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.2em] text-primary"><span className="pulse-signal h-2 w-2 rounded-full bg-primary" /> Workspace / morning readout</div>
            <h1 className="text-4xl font-semibold tracking-[-.065em] sm:text-6xl">Good work, <span className="text-primary">{firstName}.</span></h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">Your workshop is quiet and ready. Keep the signal current, then let the right people find the thinking behind it.</p>
          </div>
          <Link href="/projects" className="flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="link-overview-add-project"><Plus size={16} /> Add a project <ArrowUpRight size={14} /></Link>
        </header>

        <section className="relative grid gap-4 py-8 sm:grid-cols-3" aria-label="Workspace summary">
          <div className="soft-card rounded-2xl p-5" data-testid="stat-project-count">
            <div className="mb-10 flex items-center justify-between"><FolderKanban size={17} className="text-primary" /><span className="font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">Inventory</span></div>
            <p className="text-4xl font-semibold tracking-[-.06em]">{projects.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">projects in your workshop</p>
          </div>
          <div className="soft-card rounded-2xl p-5" data-testid="stat-profile-state">
            <div className="mb-10 flex items-center justify-between"><UserRound size={17} className="text-cyan-300" /><span className="font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">Profile signal</span></div>
            <p className="text-4xl font-semibold tracking-[-.06em]">{profileComplete}<span className="text-lg text-muted-foreground"> / 4</span></p>
            <p className="mt-2 text-sm text-muted-foreground">context markers filled in</p>
          </div>
          <div className="rounded-2xl border border-primary/25 bg-primary/10 p-5" data-testid="stat-discoverability">
            <div className="mb-10 flex items-center justify-between"><Zap size={17} className="text-primary" /><span className="font-mono text-[9px] uppercase tracking-[.16em] text-primary">Next useful move</span></div>
            <p className="text-xl font-medium tracking-[-.03em]">{projects.length ? "Add the why." : "Ship the first signal."}</p>
            <p className="mt-2 text-sm text-muted-foreground">{projects.length ? "A little context makes good work memorable." : "Start with a project people can ask you about."}</p>
          </div>
        </section>

        <section className="relative py-5" aria-labelledby="recent-projects-heading">
          <div className="mb-5 flex items-end justify-between">
            <div><div className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-primary">01 / Recent work</div><h2 id="recent-projects-heading" className="text-2xl font-medium tracking-[-.045em]">The latest from your bench.</h2></div>
            <Link href="/projects" className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground transition-colors hover:text-primary sm:flex" data-testid="link-overview-view-projects">View all <ArrowUpRight size={13} /></Link>
          </div>
          {projectsQuery.isLoading && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="soft-card rounded-2xl p-5" data-testid={`skeleton-overview-project-${item}`}><Skeleton className="h-5 w-24" /><Skeleton className="mt-20 h-7 w-3/4" /><Skeleton className="mt-4 h-14 w-full" /><div className="mt-8 flex gap-2"><Skeleton className="h-5 w-16" /><Skeleton className="h-5 w-20" /></div></div>)}</div>}
          {projectsQuery.isError && <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6" role="alert" data-testid="status-overview-projects-error"><p className="font-medium">The latest work is out of reach.</p><p className="mt-2 text-sm text-muted-foreground">Open Projects to try the connection again.</p><Link href="/projects" className="mt-4 inline-flex items-center gap-2 text-sm text-primary" data-testid="link-overview-projects-retry">Open projects <ArrowUpRight size={14} /></Link></div>}
          {!projectsQuery.isLoading && !projectsQuery.isError && projects.length === 0 && <div className="soft-card rounded-2xl border-dashed p-8 text-center" data-testid="empty-overview-projects"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary"><FolderKanban size={20} /></div><h3 className="mt-5 text-lg font-medium">Nothing on the bench yet.</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">Start with one shipped thing. It does not need to be finished to be worth explaining.</p><Link href="/projects" className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" data-testid="link-overview-empty-add">Add your first project <Plus size={15} /></Link></div>}
          {!projectsQuery.isLoading && !projectsQuery.isError && projects.length > 0 && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.slice(0, 3).map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>}
        </section>

        <section className="relative mt-10 grid gap-5 border-t border-border pt-8 md:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-2xl border border-border bg-secondary/30 p-6 sm:p-8">
            <div className="mb-6 font-mono text-[10px] uppercase tracking-[.18em] text-primary">02 / Profile readout</div>
            <div className="flex items-start gap-4">
              {user?.avatarUrl ? <img src={user.avatarUrl} alt={`${user.name}'s avatar`} className="h-14 w-14 rounded-2xl object-cover" data-testid="img-overview-avatar" /> : <div className="grid h-14 w-14 place-items-center rounded-2xl border border-primary/25 bg-primary/10 font-mono text-primary" data-testid="avatar-overview-placeholder">{initialsFor(user?.name ?? "")}</div>}
              <div><h2 className="text-2xl font-medium tracking-[-.04em]" data-testid="text-overview-user-name">{user?.name}</h2><p className="mt-1 font-mono text-[10px] text-primary">@{user?.username}</p><p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">{user?.headline || "Add a headline so people know where your curiosity lives."}</p></div>
            </div>
            <Link href="/profile" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-foreground" data-testid="link-overview-edit-profile">Tune your profile <ArrowUpRight size={15} /></Link>
          </div>
          <div className="soft-card rounded-2xl p-6 sm:p-8">
            <div className="mb-6 font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Quick actions</div>
            <div className="space-y-2">
              <Link href="/projects" className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5" data-testid="link-quick-projects"><span className="flex items-center gap-3"><FolderKanban size={15} className="text-primary" /> Review projects</span><ArrowUpRight size={14} /></Link>
              <Link href="/profile" className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5" data-testid="link-quick-profile"><span className="flex items-center gap-3"><UserRound size={15} className="text-primary" /> Edit profile</span><ArrowUpRight size={14} /></Link>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}