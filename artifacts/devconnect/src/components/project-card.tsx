import { ArrowUpRight, ExternalLink, Github, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Project } from "@workspace/shared";
import { Button } from "@/components/ui/button";

const palette = [
  "from-lime-300/20 via-lime-300/5 to-transparent",
  "from-cyan-300/20 via-cyan-300/5 to-transparent",
  "from-orange-300/20 via-orange-300/5 to-transparent",
];

export function ProjectCard({
  project,
  index,
  onEdit,
  onDelete,
}: {
  project: Project;
  index: number;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}) {
  const updated = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(project.updatedAt));
  return (
    <article className="soft-card group relative flex min-h-[340px] flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1 hover:border-primary/35" data-testid={`card-project-${project.id}`}>
      <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${palette[index % palette.length]}`} />
      {project.imageUrl ? <img src={project.imageUrl} alt="" className="absolute inset-x-0 top-0 h-32 w-full object-cover opacity-55 mix-blend-screen" data-testid={`img-project-cover-${project.id}`} /> : <div className="absolute right-5 top-5 font-mono text-[42px] font-medium leading-none text-foreground/5">{String(index + 1).padStart(2, "0")}</div>}
      <div className="relative flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between">
          <span className="rounded-md border border-primary/25 bg-background/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[.14em] text-primary">Project / {String(index + 1).padStart(2, "0")}</span>
          {onEdit || onDelete ? <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            {onEdit && <Button variant="ghost" size="icon" onClick={() => onEdit(project)} aria-label={`Edit ${project.title}`} className="h-8 w-8 text-muted-foreground hover:text-primary" data-testid={`button-edit-project-${project.id}`}><Pencil size={14} /></Button>}
            {onDelete && <Button variant="ghost" size="icon" onClick={() => onDelete(project)} aria-label={`Delete ${project.title}`} className="h-8 w-8 text-muted-foreground hover:text-destructive" data-testid={`button-delete-project-${project.id}`}><Trash2 size={14} /></Button>}
          </div> : <MoreHorizontal size={16} className="text-muted-foreground/40" aria-hidden="true" />}
        </div>
        <div className="mt-20">
          <h3 className="text-2xl font-medium tracking-[-.045em]" data-testid={`text-project-title-${project.id}`}>{project.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground" data-testid={`text-project-description-${project.id}`}>{project.description}</p>
        </div>
        <div className="mt-auto pt-7">
          <div className="flex flex-wrap gap-1.5" data-testid={`list-project-tech-${project.id}`}>
            {project.techStack.map((tech) => <span key={tech} className="rounded-md border border-border bg-background/45 px-2 py-1 font-mono text-[10px] text-muted-foreground">{tech}</span>)}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="font-mono text-[9px] uppercase tracking-[.13em] text-muted-foreground">Updated {updated}</span>
            <div className="flex items-center gap-3">
              {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} source code`} className="text-muted-foreground transition-colors hover:text-primary" data-testid={`link-project-github-${project.id}`}><Github size={15} /></a>}
              {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} live site`} className="text-muted-foreground transition-colors hover:text-primary" data-testid={`link-project-live-${project.id}`}><ExternalLink size={15} /></a>}
              {(project.githubUrl || project.liveUrl) && <ArrowUpRight size={13} className="text-primary" aria-hidden="true" />}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}