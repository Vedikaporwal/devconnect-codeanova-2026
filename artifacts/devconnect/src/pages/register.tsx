import { ArrowUpRight, Code2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";
import { AuthShell } from "@/pages/auth-shell";
import { useAuthStore } from "@/store/auth-store";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Add your name so people know who they are meeting.").max(80, "Keep your name under 80 characters."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters.").max(128, "Use a password under 128 characters."),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const register = useAuthStore((state) => state.register);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: RegisterValues) => {
    setServerError(null);
    try {
      await register(values);
      toast({
        title: "Profile created",
        description: "Your developer identity is ready for its first edit.",
      });
      setLocation("/profile");
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : "Unable to create your account right now.");
    }
  };

  return (
    <AuthShell
      eyebrow="Access / 02"
      title={<>Make your signal legible.</>}
      description="Start with the work you want people to ask you about. A focused profile is enough to begin."
      footer={
        <span>
          Independent <span className="mx-2 text-border">/</span> Intentional{" "}
          <span className="mx-2 text-border">/</span> Indexed
        </span>
      }
    >
      <div className="mb-8 border-b border-border pb-6">
        <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-primary">
          <Code2 size={13} />
          Create a profile
        </div>
        <h2 className="text-2xl font-medium tracking-[-.04em]">Put a pin in your work.</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your handle is generated from your name and can be refined later.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">
                  Name
                </FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="name" placeholder="Amira Chen" className="h-11 border-border bg-background/40" data-testid="input-register-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">
                  Email
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                    <Input {...field} type="email" autoComplete="email" placeholder="you@yourdomain.dev" className="h-11 border-border bg-background/40 pl-9" data-testid="input-register-email" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">
                  Password
                </FormLabel>
                <FormControl>
                  <Input {...field} type="password" autoComplete="new-password" placeholder="••••••••" className="h-11 border-border bg-background/40" data-testid="input-register-password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {serverError && (
            <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert" data-testid="status-register-error">
              {serverError}
            </p>
          )}
          <Button type="submit" className="mt-2 h-12 w-full rounded-xl text-sm font-semibold" disabled={form.formState.isSubmitting} data-testid="button-register-submit">
            {form.formState.isSubmitting ? "Creating profile…" : "Create profile"} {!form.formState.isSubmitting && <ArrowUpRight size={16} />}
          </Button>
        </form>
      </Form>
      <p className="mt-7 text-center text-sm text-muted-foreground">
        Already have a profile?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-foreground" data-testid="link-register-login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}