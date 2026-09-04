import { ArrowLeft, ExternalLink, Github, Globe2, Linkedin, MapPin } from "lucide-react";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { discoveryApi } from "@/lib/api";
import { ConnectionActions } from "@/components/connection-actions";
import { EndorsementList } from "@/components/endorsement-list";
import { useEndorsementMutations, useEndorsements } from "@/hooks/use-endorsements";
import { useSkills } from "@/hooks/use-skills";
import { useAuthStore } from "@/store/auth-store";
import { ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const initialsFor = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");

export default function PublicProfile() {
  const [, params] = useRoute("/profile/:id");
  const query = useQuery({ queryKey: ["public-profile", params?.id], queryFn: () => discoveryApi.get(params!.id), enabled: Boolean(params?.id), retry: false });

  if (query.isLoading) return <AppShell><div className="mx-auto max-w-4xl p-8 text-muted-foreground">Loading developer profile...</div></AppShell>;
  if (query.isError || !query.data) return <AppShell><div className="mx-auto max-w-4xl p-8"><p className="text-destructive">Developer profile unavailable.</p><Link href="/discover" className="mt-4 inline-flex items-center gap-2 text-primary"><ArrowLeft size={15} /> Back to discover</Link></div></AppShell>;

  const developer = query.data;
  const { isAuthenticated } = useAuthStore();
  const endorsementQuery = useEndorsements(developer.id);
  const skillsQuery = useSkills();
  const endorsementMutations = useEndorsementMutations(developer.id);
  const { toast } = useToast();
  const actOnEndorsement = async (skillId: string, endorsed: boolean) => { try { await (endorsed ? endorsementMutations.remove : endorsementMutations.add).mutateAsync(skillId); toast({ title: endorsed ? "Endorsement removed" : "Developer endorsed" }); } catch (error) { toast({ title: error instanceof ApiError ? error.message : "Endorsement action failed", variant: "destructive" }); } };
  return <AppShell><main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
    <Link href="/discover" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={15} /> Back to discover</Link>
    <section className="signal-border mt-10 rounded-2xl bg-[#15151e]/90 p-6 sm:p-10">
      <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-center"><div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border border-primary/30 bg-primary/10 font-mono text-2xl text-primary">{developer.avatarUrl ? <img src={developer.avatarUrl} alt={`${developer.name}'s avatar`} className="h-full w-full object-cover" /> : initialsFor(developer.name)}</div><div><p className="font-mono text-sm text-primary">@{developer.username}</p><h1 className="mt-1 text-4xl font-semibold tracking-[-.06em]">{developer.name}</h1><p className="mt-2 text-muted-foreground">{developer.headline || "Developer profile"}</p></div></div>
      <div className="flex flex-wrap gap-5 border-b border-border py-6 text-sm text-muted-foreground">{developer.location && <span className="flex items-center gap-2"><MapPin size={15} className="text-primary" /> {developer.location}</span>}{developer.githubUrl && <a href={developer.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary"><Github size={15} /> GitHub <ExternalLink size={12} /></a>}{developer.linkedinUrl && <a href={developer.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary"><Linkedin size={15} /> LinkedIn <ExternalLink size={12} /></a>}{developer.portfolioUrl && <a href={developer.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary"><Globe2 size={15} /> Portfolio <ExternalLink size={12} /></a>}</div>
      <p className="py-8 text-lg leading-relaxed">{developer.bio || "Sharing the work and context behind the build."}</p>
      <div className="flex flex-wrap gap-2">{developer.skills.length ? developer.skills.map((skill) => <span key={skill} className="rounded-md border border-border px-3 py-2 font-mono text-xs text-muted-foreground">{skill}</span>) : <span className="text-sm text-muted-foreground">No skills added yet.</span>}</div>
      <div className="mt-8 flex flex-wrap gap-3"><ConnectionActions userId={developer.id} />{isAuthenticated && developer.skills.map((skill) => { const match = skillsQuery.data?.find((item) => item.name.toLowerCase() === skill.toLowerCase()); const summary = endorsementQuery.data?.summaries.find((item) => item.skill.id === match?.id); if (!match) return null; return <button key={skill} type="button" disabled={endorsementMutations.add.isPending || endorsementMutations.remove.isPending} onClick={() => void actOnEndorsement(match.id, Boolean(summary?.endorsedByViewer))} className="rounded-md border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary">{summary?.endorsedByViewer ? "Remove endorsement" : "Endorse"} {skill}</button>; })}</div>
    </section>
    <section className="mt-8 rounded-2xl border border-border bg-secondary/20 p-6" aria-labelledby="endorsements-heading"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-primary">Community signal</p><h2 id="endorsements-heading" className="mt-2 text-2xl font-medium tracking-[-.04em]">Endorsements.</h2><div className="mt-5"><EndorsementList summaries={endorsementQuery.data?.summaries ?? []} /></div></section>
    <section className="mt-8" aria-labelledby="public-projects-heading"><div className="mb-5 border-b border-border pb-5"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-primary">Project signal</p><h2 id="public-projects-heading" className="mt-2 text-2xl font-medium tracking-[-.04em]">Selected work.</h2></div>{developer.projects.length ? <div className="grid gap-4 md:grid-cols-2">{developer.projects.map((project) => <article key={project.id} className="soft-card overflow-hidden rounded-2xl p-5 transition-transform hover:-translate-y-1">{project.imageUrl && <img src={project.imageUrl} alt="" className="mb-5 h-32 w-full rounded-xl object-cover opacity-80" />}<h3 className="text-xl font-medium tracking-[-.03em]">{project.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{project.description}</p><div className="mt-5 flex flex-wrap gap-1.5">{project.techStack.map((tech) => <span key={tech} className="rounded-md border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground">{tech}</span>)}</div><div className="mt-5 flex gap-4 border-t border-border pt-4">{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"><Github size={14} /> Source</a>}{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"><ExternalLink size={14} /> Live project</a>}</div></article>)}</div> : <div className="rounded-2xl border border-dashed border-border p-8 text-sm text-muted-foreground">No public projects added yet.</div>}</section>
  </main></AppShell>;
}
