import { ArrowUpRight, KeyRound, Mail } from "lucide-react";
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
import { AuthShell } from "@/pages/auth-shell";
import { ApiError } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setServerError(null);
    try {
      await login(values);
      toast({
        title: "Welcome back",
        description: "Your profile is ready.",
      });
      setLocation("/profile");
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : "Unable to sign in right now.");
    }
  };

  return (
    <AuthShell
      eyebrow="Access / 01"
      title={<>Welcome back to the signal.</>}
      description="Sign in to pick up where your work left off. No feed to catch up on, just your profile and the conversations around it."
      footer={
        <span>
          Private by default <span className="mx-2 text-border">/</span> Built for
          thoughtful builders
        </span>
      }
    >
      <div className="mb-8 border-b border-border pb-6">
        <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-primary">
          <KeyRound size={13} />
          Sign in
        </div>
        <h2 className="text-2xl font-medium tracking-[-.04em]">Enter your details.</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Continue to your public developer identity.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder="you@yourdomain.dev"
                      className="h-12 border-border bg-background/40 pl-10"
                      data-testid="input-login-email"
                    />
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
                <div className="flex items-center justify-between">
                  <FormLabel className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">
                    Password
                  </FormLabel>
                  <span className="font-mono text-[10px] text-muted-foreground">8+ chars</span>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="h-12 border-border bg-background/40"
                    data-testid="input-login-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {serverError && (
            <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert" data-testid="status-login-error">
              {serverError}
            </p>
          )}
          <Button type="submit" className="h-12 w-full rounded-xl text-sm font-semibold" disabled={form.formState.isSubmitting} data-testid="button-login-submit">
            {form.formState.isSubmitting ? "Signing in…" : "Sign in"} {!form.formState.isSubmitting && <ArrowUpRight size={16} />}
          </Button>
        </form>
      </Form>
      <p className="mt-7 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/register" className="font-medium text-primary hover:text-foreground" data-testid="link-login-register">
          Create your profile
        </Link>
      </p>
    </AuthShell>
  );
}