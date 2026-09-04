import {
  ArrowUpRight,
  AtSign,
  Check,
  FolderKanban,
  Globe2,
  Github,
  Linkedin,
  MapPin,
  Plus,
  Save,
  Terminal,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProfileUpdateRequest, SafeUser } from "@workspace/shared";
import type { CreateProjectRequest } from "@workspace/shared";
import { ProjectCard } from "@/components/project-card";
import { ProjectFormDialog } from "@/components/project-form-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ApiError, authApi } from "@/lib/api";
import { useProjectMutations, useProjects } from "@/hooks/use-projects";
import { useAuthStore } from "@/store/auth-store";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Use at least 2 characters.").max(80, "Keep your name under 80 characters."),
  headline: z.string().trim().max(120, "Keep your headline under 120 characters."),
  bio: z.string().trim().max(500, "Keep your bio under 500 characters."),
  location: z.string().trim().max(120, "Keep your location under 120 characters."),
  avatarUrl: z.string().trim().url("Use a valid image URL.").or(z.literal("")),
  githubUrl: z.string().trim().url("Use a valid URL.").or(z.literal("")),
  linkedinUrl: z.string().trim().url("Use a valid URL.").or(z.literal("")),
  portfolioUrl: z.string().trim().url("Use a valid URL.").or(z.literal("")),
});

type ProfileValues = z.infer<typeof profileSchema>;

const toFormValues = (user: SafeUser): ProfileValues => ({
  name: user.name,
  headline: user.headline ?? "",
  bio: user.bio ?? "",
  location: user.location ?? "",
  avatarUrl: user.avatarUrl ?? "",
  githubUrl: user.githubUrl ?? "",
  linkedinUrl: user.linkedinUrl ?? "",
  portfolioUrl: user.portfolioUrl ?? "",
});

const toProfileUpdate = (values: ProfileValues): ProfileUpdateRequest => ({
  name: values.name,
  headline: values.headline || null,
  bio: values.bio || null,
  location: values.location || null,
  avatarUrl: values.avatarUrl || null,
  githubUrl: values.githubUrl || null,
  linkedinUrl: values.linkedinUrl || null,
  portfolioUrl: values.portfolioUrl || null,
});

const initialsFor = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

function ExternalLink({
  href,
  label,
  icon,
}: {
  href: string | null;
  label: string;
  icon: React.ReactNode;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
      data-testid={`link-profile-${label.toLowerCase()}`}
    >
      {icon}
      <span className="truncate">{href.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
      <ArrowUpRight size={13} className="ml-auto shrink-0" />
    </a>
  );
}

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setUser, clearUser, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const projectsQuery = useProjects();
  const { createProject } = useProjectMutations();
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      headline: "",
      bio: "",
      location: "",
      avatarUrl: "",
      githubUrl: "",
      linkedinUrl: "",
      portfolioUrl: "",
    },
  });

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (profileQuery.data) setUser(profileQuery.data);
    if (profileQuery.error instanceof ApiError && profileQuery.error.status === 401) {
      clearUser();
      setLocation("/login");
    }
  }, [clearUser, profileQuery.data, profileQuery.error, setLocation, setUser]);

  const updateMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(["profile"], updatedUser);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your public signal now reflects the latest context.",
      });
    },
  });

  const onSubmit = async (values: ProfileValues) => {
    await updateMutation.mutateAsync(toProfileUpdate(values));
  };

  const handleEdit = () => {
    if (profileQuery.data) form.reset(toFormValues(profileQuery.data));
    setIsEditing(true);
  };

  const handleLogout = async () => {
    setLogoutPending(true);
    try {
      await logout();
      toast({ title: "Logged out", description: "Your session has been closed." });
      setLocation("/");
    } finally {
      setLogoutPending(false);
    }
  };

  const handleCreateProject = async (input: CreateProjectRequest) => {
    await createProject.mutateAsync(input);
    setProjectDialogOpen(false);
    toast({ title: "Project added", description: "Your profile now has another useful signal." });
  };

  if (profileQuery.isLoading || !user) {
    return (
      <main className="devconnect-shell grain grid min-h-[100dvh] place-items-center px-5">
        <div className="text-center" data-testid="status-profile-loading">
          <span className="pulse-signal mx-auto mb-4 block h-2 w-2 rounded-full bg-primary" />
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">
            Loading your profile
          </p>
        </div>
      </main>
    );
  }

  const profile = profileQuery.data ?? user;
  const initials = initialsFor(profile.name) || "DC";

  return (
    <main className="devconnect-shell grain min-h-[100dvh] overflow-hidden">
      <section className="relative mx-auto max-w-[1000px] px-5 pb-20 pt-14 sm:px-8 sm:pt-24 lg:px-10 lg:pb-32">
        <div className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[500px] opacity-60" />
        <div className="relative">
          <div className="mb-8 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[.2em] text-primary">
            <span className="pulse-signal h-2 w-2 rounded-full bg-primary" />
            <span>Private profile / your signal</span>
            <span className="text-border">/</span>
            <span className="text-muted-foreground">Ready to share</span>
          </div>

          <div className="signal-border rounded-2xl bg-[#15151e]/90 p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-8 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-5">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={`${profile.name}'s avatar`}
                    className="h-20 w-20 shrink-0 rounded-2xl border border-primary/30 object-cover sm:h-24 sm:w-24"
                    data-testid="img-profile-avatar"
                  />
                ) : (
                  <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border border-primary/30 bg-primary/10 font-mono text-xl text-primary sm:h-24 sm:w-24" data-testid="avatar-profile-placeholder">
                    {initials}
                  </div>
                )}
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h1 className="text-4xl font-semibold tracking-[-.06em]" data-testid="text-profile-name">{profile.name}</h1>
                    <Check size={16} className="text-primary" aria-label="Profile ready" />
                  </div>
                  <p className="font-mono text-sm text-primary">@{profile.username}</p>
                  <p className="mt-3 text-base text-muted-foreground" data-testid="text-profile-headline">
                    {profile.headline || "Add a headline that makes your work easier to place."}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleEdit}
                className="w-fit gap-2 rounded-full text-xs font-semibold"
                data-testid="button-edit-profile"
              >
                Edit profile <ArrowUpRight size={14} />
              </Button>
            </div>

            <div className="grid gap-5 border-b border-border py-8 sm:grid-cols-2 lg:grid-cols-3">
              {profile.location && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground" data-testid="text-profile-location">
                  <MapPin size={16} className="text-primary" />
                  {profile.location}
                </div>
              )}
              <ExternalLink href={profile.githubUrl} label="github" icon={<Github size={16} className="text-primary" />} />
              <ExternalLink href={profile.linkedinUrl} label="linkedin" icon={<Linkedin size={16} className="text-primary" />} />
              <ExternalLink href={profile.portfolioUrl} label="portfolio" icon={<Globe2 size={16} className="text-primary" />} />
              {!profile.location && !profile.githubUrl && !profile.linkedinUrl && !profile.portfolioUrl && (
                <p className="text-sm text-muted-foreground" data-testid="text-profile-links-empty">
                  Add a location or link so people know where to continue the conversation.
                </p>
              )}
            </div>

            <div className="grid gap-10 py-8 lg:grid-cols-[1.15fr_.85fr]">
              <div>
                <div className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-primary">
                  <Terminal size={13} />
                  The short version
                </div>
                <p className="max-w-xl text-xl leading-relaxed tracking-[-.025em] text-foreground sm:text-2xl" data-testid="text-profile-bio">
                  {profile.bio || "Tell people what you build, what you notice, and why the work matters."}
                </p>
                <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Your profile is the starting point for a useful conversation — not a complete dashboard.
                </p>
              </div>
              <div>
                <div className="mb-5 font-mono text-[10px] uppercase tracking-[.16em] text-primary">Profile / current state</div>
                <div className="flex flex-wrap gap-2">
                  {["Developer profile", "Open context", "Personal signal"].map((tag) => (
                    <span key={tag} className="rounded-md border border-border bg-background/50 px-3 py-2 font-mono text-[10px] text-muted-foreground" data-testid={`tag-profile-${tag.toLowerCase().replaceAll(" ", "-")}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">
            <span className="flex items-center gap-2"><AtSign size={13} className="text-primary" /> A considered starting point for a useful conversation.</span>
            <span className="hidden text-primary sm:block">Private until you share it</span>
          </div>

          {isEditing && (
            <div className="soft-card mt-8 rounded-2xl p-5 sm:p-8" data-testid="panel-edit-profile">
              <div className="mb-8 flex items-start justify-between border-b border-border pb-6">
                <div>
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[.16em] text-primary">Edit / profile signal</div>
                  <h2 className="text-2xl font-medium tracking-[-.04em]">Make the context clearer.</h2>
                  <p className="mt-2 text-sm text-muted-foreground">These details appear on your developer profile.</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} aria-label="Close edit profile" data-testid="button-close-edit-profile">
                  <X size={16} />
                </Button>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Name</FormLabel>
                        <FormControl><Input {...field} autoComplete="name" className="h-11 border-border bg-background/40" data-testid="input-profile-name" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="headline" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Headline</FormLabel>
                        <FormControl><Input {...field} placeholder="Staff Frontend Engineer" className="h-11 border-border bg-background/40" data-testid="input-profile-headline" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="bio" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Bio</FormLabel>
                      <FormControl><Textarea {...field} placeholder="What do you build, notice, or make easier?" className="min-h-28 resize-y border-border bg-background/40" data-testid="textarea-profile-bio" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField control={form.control} name="location" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Location</FormLabel>
                        <FormControl><Input {...field} placeholder="Bengaluru, IN" className="h-11 border-border bg-background/40" data-testid="input-profile-location" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="avatarUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Avatar URL</FormLabel>
                        <FormControl><Input {...field} type="url" placeholder="https://…" className="h-11 border-border bg-background/40" data-testid="input-profile-avatar-url" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-3">
                    <FormField control={form.control} name="githubUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">GitHub URL</FormLabel>
                        <FormControl><Input {...field} type="url" placeholder="https://github.com/…" className="h-11 border-border bg-background/40" data-testid="input-profile-github-url" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">LinkedIn URL</FormLabel>
                        <FormControl><Input {...field} type="url" placeholder="https://linkedin.com/in/…" className="h-11 border-border bg-background/40" data-testid="input-profile-linkedin-url" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="portfolioUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Portfolio URL</FormLabel>
                        <FormControl><Input {...field} type="url" placeholder="https://yourdomain.dev" className="h-11 border-border bg-background/40" data-testid="input-profile-portfolio-url" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  {updateMutation.error && (
                    <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert" data-testid="status-profile-error">
                      {updateMutation.error instanceof ApiError ? updateMutation.error.message : "Unable to update your profile right now."}
                    </p>
                  )}
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)} data-testid="button-cancel-profile-edit">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting || updateMutation.isPending} className="gap-2" data-testid="button-save-profile">
                      {updateMutation.isPending ? "Saving…" : "Save profile"} {!updateMutation.isPending && <Save size={15} />}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}

          <section className="soft-card mt-8 rounded-2xl p-5 sm:p-8" aria-labelledby="profile-projects-heading" data-testid="section-profile-projects">
            <div className="flex flex-col justify-between gap-5 border-b border-border pb-6 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-primary"><FolderKanban size={13} /> Project signal</div>
                <h2 id="profile-projects-heading" className="text-2xl font-medium tracking-[-.04em]">The work behind the profile.</h2>
                <p className="mt-2 text-sm text-muted-foreground">Give people something specific to ask you about.</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/projects" className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground transition-colors hover:text-primary" data-testid="link-profile-manage-projects">Manage all</Link>
                <Button onClick={() => setProjectDialogOpen(true)} className="gap-2 rounded-full text-xs" data-testid="button-profile-add-project"><Plus size={14} /> Add project</Button>
              </div>
            </div>
            {projectsQuery.isLoading && <div className="grid gap-3 pt-6 sm:grid-cols-2"><div className="h-28 animate-pulse rounded-xl bg-primary/5" data-testid="skeleton-profile-project-0" /><div className="h-28 animate-pulse rounded-xl bg-primary/5" data-testid="skeleton-profile-project-1" /></div>}
            {projectsQuery.isError && <p className="pt-6 text-sm text-muted-foreground" role="alert" data-testid="status-profile-projects-error">Projects could not be loaded yet. Visit the Projects page to try again.</p>}
            {!projectsQuery.isLoading && !projectsQuery.isError && (projectsQuery.data ?? []).length === 0 && <div className="border-dashed pt-6" data-testid="empty-profile-projects"><p className="text-sm text-muted-foreground">No projects are connected to this profile yet.</p><Button variant="outline" onClick={() => setProjectDialogOpen(true)} className="mt-4 gap-2" data-testid="button-profile-empty-add-project"><Plus size={14} /> Add the first one</Button></div>}
            {!projectsQuery.isLoading && !projectsQuery.isError && (projectsQuery.data ?? []).length > 0 && <div className="grid gap-4 pt-6 sm:grid-cols-2">{(projectsQuery.data ?? []).slice(0, 2).map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>}
          </section>
          <ProjectFormDialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen} onSubmit={handleCreateProject} isPending={createProject.isPending} errorMessage={createProject.error instanceof ApiError ? createProject.error.message : createProject.error ? "Unable to add this project right now." : undefined} />
        </div>
      </section>
    </main>
  );
}