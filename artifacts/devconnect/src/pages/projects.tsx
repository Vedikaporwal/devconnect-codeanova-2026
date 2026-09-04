import { useState } from "react";
import { AlertCircle, FolderKanban, Plus, RefreshCw } from "lucide-react";
import type { Project } from "@workspace/shared";
import { AppShell } from "@/components/app-shell";
import { ProjectCard } from "@/components/project-card";
import { ProjectFormDialog } from "@/components/project-form-dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";
import { useProjectMutations, useProjects } from "@/hooks/use-projects";

export default function Projects() {
  const { toast } = useToast();
  const projectsQuery = useProjects();
  const { createProject, updateProject, deleteProject } = useProjectMutations();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project>();
  const [deletingProject, setDeletingProject] = useState<Project>();
  const projects = projectsQuery.data ?? [];
  const formMutation = editingProject ? updateProject : createProject;

  const openCreate = () => { setEditingProject(undefined); setFormOpen(true); };
  const openEdit = (project: Project) => { setEditingProject(project); setFormOpen(true); };
  const submitProject = async (input: Parameters<typeof createProject.mutateAsync>[0]) => {
    if (editingProject) {
      await updateProject.mutateAsync({ id: editingProject.id, input });
      toast({ title: "Project updated", description: "The work reads a little clearer now." });
    } else {
      await createProject.mutateAsync(input);
      toast({ title: "Project added", description: "Your latest signal is in the workshop." });
    }
    setFormOpen(false);
    setEditingProject(undefined);
  };
  const confirmDelete = async () => {
    if (!deletingProject) return;
    await deleteProject.mutateAsync(deletingProject.id);
    toast({ title: "Project removed", description: "The project has left your workshop." });
    setDeletingProject(undefined);
  };
  const formError = formMutation.error instanceof ApiError ? formMutation.error.message : formMutation.error ? "The project could not be saved. Try again." : undefined;

  return (
    <AppShell>
      <div className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[430px] opacity-50" />
        <header className="relative flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-end">
          <div><div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.2em] text-primary"><span className="pulse-signal h-2 w-2 rounded-full bg-primary" /> Workshop / project index</div><h1 className="text-4xl font-semibold tracking-[-.065em] sm:text-6xl">Make the work <span className="text-primary">legible.</span></h1><p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">Projects are the useful middle between a résumé and a conversation. Put the shipped thing here, then add the decision someone should notice.</p></div>
          <Button onClick={openCreate} className="w-fit gap-2 rounded-full px-5 py-3 text-sm font-semibold" data-testid="button-create-project"><Plus size={17} /> New project</Button>
        </header>

        <div className="relative flex items-center justify-between py-6">
          <div className="flex items-center gap-3"><FolderKanban size={16} className="text-primary" /><span className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground" data-testid="text-project-count">{projects.length} {projects.length === 1 ? "project" : "projects"} indexed</span></div>
          {projectsQuery.isFetching && !projectsQuery.isLoading && <span className="font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground">Refreshing index</span>}
        </div>

        {projectsQuery.isLoading && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="soft-card min-h-[340px] rounded-2xl p-5" data-testid={`skeleton-project-${item}`}><Skeleton className="h-6 w-28" /><Skeleton className="mt-24 h-8 w-4/5" /><Skeleton className="mt-4 h-14 w-full" /><Skeleton className="mt-9 h-5 w-2/5" /><Skeleton className="mt-6 h-px w-full" /></div>)}</div>}
        {projectsQuery.isError && <div className="soft-card relative rounded-2xl border-destructive/35 p-8" role="alert" data-testid="status-projects-error"><div className="flex items-start gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive"><AlertCircle size={19} /></div><div><h2 className="font-medium">The project index is unavailable.</h2><p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{projectsQuery.error instanceof ApiError ? projectsQuery.error.message : "We could not load your work right now. The connection may be temporary."}</p><Button variant="outline" onClick={() => projectsQuery.refetch()} className="mt-5 gap-2" data-testid="button-retry-projects"><RefreshCw size={14} /> Try again</Button></div></div></div>}
        {!projectsQuery.isLoading && !projectsQuery.isError && projects.length === 0 && <div className="soft-card relative overflow-hidden rounded-2xl border-dashed p-10 sm:p-16" data-testid="empty-projects"><div className="grid-lines pointer-events-none absolute inset-0 opacity-40" /><div className="relative max-w-lg"><div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.18em] text-primary"><FolderKanban size={15} /> First entry / blank bench</div><h2 className="text-3xl font-medium tracking-[-.05em] sm:text-4xl">Nothing shipped here yet.</h2><p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">That is a clean starting point. Add one project with enough context for another engineer to understand why it exists.</p><Button onClick={openCreate} className="mt-7 gap-2 rounded-full" data-testid="button-empty-create-project"><Plus size={16} /> Add your first project</Button></div></div>}
        {!projectsQuery.isLoading && !projectsQuery.isError && projects.length > 0 && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onEdit={openEdit} onDelete={setDeletingProject} />)}</div>}

        <ProjectFormDialog open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingProject(undefined); }} project={editingProject} onSubmit={submitProject} isPending={formMutation.isPending} errorMessage={formError} />
        <AlertDialog open={Boolean(deletingProject)} onOpenChange={(open) => { if (!open && !deleteProject.isPending) setDeletingProject(undefined); }}>
          <AlertDialogContent className="signal-border bg-[#15151e]">
            <AlertDialogHeader><AlertDialogTitle className="text-xl tracking-[-.03em]">Remove this project?</AlertDialogTitle><AlertDialogDescription className="leading-relaxed">“{deletingProject?.title}” will be removed from your profile and workshop. This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
            {deleteProject.error && <p className="text-sm text-destructive" role="alert" data-testid="status-delete-project-error">{deleteProject.error instanceof ApiError ? deleteProject.error.message : "Unable to remove this project."}</p>}
            <AlertDialogFooter><AlertDialogCancel disabled={deleteProject.isPending} data-testid="button-cancel-delete-project">Keep it</AlertDialogCancel><AlertDialogAction onClick={(event) => { event.preventDefault(); void confirmDelete(); }} disabled={deleteProject.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" data-testid="button-confirm-delete-project">{deleteProject.isPending ? "Removing…" : "Remove project"}</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
}