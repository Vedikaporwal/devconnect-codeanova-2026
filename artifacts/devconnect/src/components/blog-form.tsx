import { useEffect } from "react";
import { Eye, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BlogPost, CreateBlogRequest } from "@workspace/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({ title: z.string().trim().min(2, "Add a title.").max(160), excerpt: z.string().trim().max(400), content: z.string().trim().min(1, "Write something first.").max(100000), published: z.boolean() });
type Values = z.infer<typeof schema>;

export function BlogForm({ blog, isPending, errorMessage, onSubmit }: { blog?: BlogPost; isPending: boolean; errorMessage?: string; onSubmit: (input: CreateBlogRequest) => Promise<void> }) {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { title: blog?.title ?? "", excerpt: blog?.excerpt ?? "", content: blog?.content ?? "", published: blog?.published ?? false } });
  useEffect(() => { form.reset({ title: blog?.title ?? "", excerpt: blog?.excerpt ?? "", content: blog?.content ?? "", published: blog?.published ?? false }); }, [blog, form]);
  return <form onSubmit={form.handleSubmit((values) => onSubmit({ ...values, excerpt: values.excerpt || null }))} className="space-y-5" noValidate>
    <label className="block"><span className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Title</span><Input {...form.register("title")} className="mt-2 h-11 border-border bg-background/50" placeholder="The useful edge of a constraint" />{form.formState.errors.title && <span className="mt-1 block text-xs text-destructive">{form.formState.errors.title.message}</span>}</label>
    <label className="block"><span className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Excerpt</span><Textarea {...form.register("excerpt")} className="mt-2 min-h-20 border-border bg-background/50" placeholder="A short signal for the index" />{form.formState.errors.excerpt && <span className="mt-1 block text-xs text-destructive">{form.formState.errors.excerpt.message}</span>}</label>
    <label className="block"><span className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Markdown content</span><Textarea {...form.register("content")} className="mt-2 min-h-[360px] resize-y border-border bg-background/50 font-mono text-sm leading-relaxed" placeholder="# What I learned\n\nWrite the thinking behind the work..." />{form.formState.errors.content && <span className="mt-1 block text-xs text-destructive">{form.formState.errors.content.message}</span>}</label>
    <label className="flex items-center gap-3 border-t border-border pt-5 text-sm"><input type="checkbox" {...form.register("published")} className="h-4 w-4 accent-[hsl(var(--primary))]" /> Publish this post</label>
    {errorMessage && <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{errorMessage}</p>}
    <div className="flex flex-wrap justify-end gap-3"><Button type="button" variant="outline" className="gap-2" onClick={() => form.setFocus("content")}><Eye size={15} /> Preview in reader</Button><Button type="submit" disabled={isPending} className="gap-2">{isPending ? "Saving..." : "Save post"} {!isPending && <Save size={15} />}</Button></div>
  </form>;
}