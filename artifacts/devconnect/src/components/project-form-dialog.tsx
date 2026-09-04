import { useEffect } from "react";
import { ExternalLink, Image, Link2, Plus, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateProjectRequest, Project, UpdateProjectRequest } from "@workspace/shared";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const optionalUrl = z.string().trim().url("Use a complete URL.").or(z.literal(""));
const projectSchema = z.object({
  title: z.string().trim().min(2, "Give the project a name.").max(100, "Keep the title under 100 characters."),
  description: z.string().trim().min(12, "Add a little context about the work.").max(800, "Keep the description under 800 characters."),
  techStack: z.string().trim().min(1, "Add at least one technology."),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  imageUrl: optionalUrl,
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const valuesFromProject = (project?: Project): ProjectFormValues => ({
  title: project?.title ?? "",
  description: project?.description ?? "",
  techStack: project?.techStack.join(", ") ?? "",
  githubUrl: project?.githubUrl ?? "",
  liveUrl: project?.liveUrl ?? "",
  imageUrl: project?.imageUrl ?? "",
});

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
  onSubmit,
  isPending,
  errorMessage,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
  onSubmit: (input: CreateProjectRequest | UpdateProjectRequest) => Promise<void>;
  isPending: boolean;
  errorMessage?: string;
}) {
  const isEditing = Boolean(project);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: valuesFromProject(project),
  });

  useEffect(() => {
    if (open) form.reset(valuesFromProject(project));
  }, [form, open, project]);

  const submit = async (values: ProjectFormValues) => {
    await onSubmit({
      title: values.title,
      description: values.description,
      techStack: values.techStack.split(",").map((tag) => tag.trim()).filter(Boolean),
      githubUrl: values.githubUrl || null,
      liveUrl: values.liveUrl || null,
      imageUrl: values.imageUrl || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="signal-border max-w-2xl bg-[#15151e] p-0">
        <div className="p-6 sm:p-8">
          <DialogHeader className="border-b border-border pb-6">
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> {isEditing ? "Edit / project signal" : "New / project signal"}</div>
            <DialogTitle className="text-2xl font-medium tracking-[-.04em]">{isEditing ? "Sharpen the project context." : "Give the work a home."}</DialogTitle>
            <DialogDescription className="mt-2">A useful project page starts with what it is, why it exists, and what you learned making it.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="mt-6 space-y-5" noValidate>
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Project title</FormLabel><FormControl><Input {...field} autoFocus placeholder="A small, opinionated toolkit" className="h-11 border-border bg-background/50" data-testid="input-project-title" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Description</FormLabel><FormControl><Textarea {...field} placeholder="What did you build, and what decision is worth noticing?" className="min-h-32 resize-y border-border bg-background/50" data-testid="textarea-project-description" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="techStack" render={({ field }) => (
                <FormItem><FormLabel className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Tech stack <span className="normal-case tracking-normal text-muted-foreground/70">(comma separated)</span></FormLabel><FormControl><Input {...field} placeholder="TypeScript, React, Postgres" className="h-11 border-border bg-background/50" data-testid="input-project-tech-stack" /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField control={form.control} name="githubUrl" render={({ field }) => (
                  <FormItem><FormLabel className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground"><Link2 size={12} className="text-primary" /> GitHub URL</FormLabel><FormControl><Input {...field} type="url" placeholder="https://github.com/…" className="h-11 border-border bg-background/50" data-testid="input-project-github-url" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="liveUrl" render={({ field }) => (
                  <FormItem><FormLabel className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground"><ExternalLink size={12} className="text-primary" /> Live URL</FormLabel><FormControl><Input {...field} type="url" placeholder="https://project.dev" className="h-11 border-border bg-background/50" data-testid="input-project-live-url" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem><FormLabel className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground"><Image size={12} className="text-primary" /> Cover image URL <span className="normal-case tracking-normal text-muted-foreground/70">(optional)</span></FormLabel><FormControl><Input {...field} type="url" placeholder="https://…" className="h-11 border-border bg-background/50" data-testid="input-project-image-url" /></FormControl><FormMessage /></FormItem>
              )} />
              {errorMessage && <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert" data-testid="status-project-form-error">{errorMessage}</p>}
              <DialogFooter className="gap-3 border-t border-border pt-6 sm:space-x-0">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-project">{isEditing ? "Cancel" : "Not yet"}</Button>
                <Button type="submit" disabled={isPending} className="gap-2" data-testid="button-submit-project">{isPending ? "Saving…" : isEditing ? "Save changes" : "Add project"} {!isPending && (isEditing ? <Save size={15} /> : <Plus size={15} />)}</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}