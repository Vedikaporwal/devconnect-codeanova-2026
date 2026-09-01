import { ArrowLeft, Code2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'wouter';

type AuthShellProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="devconnect-shell grain min-h-[100dvh] overflow-hidden">
      <div className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-70" />
      <nav className="relative z-10 mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="group flex items-center gap-3"
          data-testid="link-auth-logo"
        >
          <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-primary text-primary-foreground transition-transform duration-300 group-hover:rotate-12">
            <Code2 size={17} strokeWidth={2.8} />
          </span>
          <span className="text-[15px] font-semibold tracking-[-.02em]">
            dev<span className="text-primary">connect</span>
          </span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          data-testid="link-auth-back"
        >
          <ArrowLeft size={14} />
          Back to DevConnect
        </Link>
      </nav>

      <section className="relative mx-auto flex min-h-[calc(100dvh-76px)] max-w-[1240px] items-center px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-24">
          <div className="max-w-md">
            <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.22em] text-primary">
              <span className="pulse-signal h-2 w-2 rounded-full bg-primary" />
              <span>{eyebrow}</span>
            </div>
            <h1 className="max-w-lg text-5xl font-semibold leading-[.92] tracking-[-.07em] sm:text-7xl">
              {title}
            </h1>
            <p className="mt-7 max-w-sm text-[16px] leading-relaxed text-muted-foreground">
              {description}
            </p>
            <div className="mt-12 hidden border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[.15em] text-muted-foreground lg:block">
              <span className="text-primary">DC / ACCESS</span>
              <span className="mx-3 text-border">/</span>
              Your work, in context.
            </div>
          </div>
          <div className="soft-card relative rounded-2xl p-5 sm:p-8">
            <div className="absolute right-5 top-5 h-2 w-2 rounded-full bg-primary sm:right-8 sm:top-8" />
            {children}
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-[1240px] px-5 pb-7 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground sm:px-8 lg:px-10">
        {footer}
      </div>
    </main>
  );
}