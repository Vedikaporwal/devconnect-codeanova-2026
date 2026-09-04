import { type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowUpRight,
  AtSign,
  Check,
  CircleDashed,
  Code2,
  Copy,
  Github,
  Globe2,
  Menu,
  Network,
  Search,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';
import {
  Link,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import Login from '@/pages/login';
import Profile from '@/pages/profile';
import Register from '@/pages/register';
import AppHome from '@/pages/app';
import Projects from '@/pages/projects';
import { ProtectedRoute } from '@/components/protected-route';
import { AppShell } from '@/components/app-shell';
import { useAuthStore } from '@/store/auth-store';

const queryClient = new QueryClient();

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLens, setActiveLens] = useState('All signals');
  const [copied, setCopied] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const copyProfile = async () => {
    try {
      await navigator.clipboard.writeText('devconnect.dev/amira-chen');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  const lenses = ['All signals', 'Frontend', 'Systems', 'Design-minded'];
  const profiles = [
    { name: 'Amira Chen', handle: '@amiracodes', role: 'Staff Frontend Engineer', location: 'Brooklyn, NY', stack: ['TypeScript', 'React', 'WebGL'], availability: 'Open to conversations', color: 'from-lime-300/20 to-cyan-300/10', initials: 'AC' },
    { name: 'Noah Williams', handle: '@nwilliams', role: 'Infrastructure / DX', location: 'London, UK', stack: ['Rust', 'Kubernetes', 'Go'], availability: 'Building in public', color: 'from-cyan-300/20 to-indigo-300/10', initials: 'NW' },
    { name: 'Sofia Marin', handle: '@sofiamarin', role: 'Design Engineer', location: 'Lisbon, PT', stack: ['React', 'Motion', 'Figma'], availability: 'Open to conversations', color: 'from-orange-300/20 to-pink-300/10', initials: 'SM' },
  ];

  return (
    <main className="devconnect-shell grain min-h-[100dvh] overflow-hidden">
      <nav className="relative z-40 mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10" data-testid="nav-main">
        <button onClick={() => scrollTo('top')} className="group flex items-center gap-3" data-testid="button-logo">
          <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-primary text-primary-foreground transition-transform duration-300 group-hover:rotate-12">
            <Code2 size={17} strokeWidth={2.8} />
          </span>
          <span className="text-[15px] font-semibold tracking-[-.02em]">dev<span className="text-primary">connect</span></span>
        </button>
        <div className="hidden items-center gap-8 md:flex">
          {['Why DevConnect', 'Features', 'Explore', 'For teams'].map((item, index) => (
            <button key={item} onClick={() => scrollTo(['why', 'features', 'explore', 'teams'][index])} className="text-[13px] text-muted-foreground transition-colors hover:text-foreground" data-testid={`link-nav-${index}`}>{item}</button>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
           <Link href="/login" className="px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground" data-testid="link-sign-in">Sign in</Link>
           <Link href="/register" className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="link-create-profile">Create your profile <ArrowUpRight size={14} /></Link>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground md:hidden" aria-label="Toggle navigation" data-testid="button-mobile-menu">
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        {mobileOpen && (
          <div className="absolute left-5 right-5 top-[72px] rounded-2xl border border-border bg-card p-3 shadow-2xl md:hidden" data-testid="menu-mobile">
            {['Why DevConnect', 'Features', 'Explore', 'For teams'].map((item, index) => (
              <button key={item} onClick={() => scrollTo(['why', 'features', 'explore', 'teams'][index])} className="block w-full rounded-xl px-4 py-3 text-left text-sm text-muted-foreground hover:bg-secondary hover:text-foreground" data-testid={`link-mobile-${index}`}>{item}</button>
            ))}
             <Link href="/login" className="mt-2 block rounded-xl px-4 py-3 text-center text-sm text-muted-foreground hover:bg-secondary hover:text-foreground" data-testid="link-mobile-sign-in">Sign in</Link>
             <Link href="/register" className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground" data-testid="link-mobile-create">Create your profile <ArrowUpRight size={15} /></Link>
          </div>
        )}
      </nav>

      <section id="top" className="relative mx-auto max-w-[1240px] px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:px-10 lg:pb-36 lg:pt-32">
        <div className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[620px] opacity-70" />
        <div className="relative max-w-[920px]">
          <div className="reveal mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.22em] text-primary">
            <span className="pulse-signal h-2 w-2 rounded-full bg-primary" />
            <span>Signal over noise / v1.0</span>
          </div>
          <h1 className="reveal reveal-delay-1 max-w-5xl text-[clamp(3.5rem,9vw,8.7rem)] font-semibold leading-[.88] tracking-[-.075em] text-balance">
            The internet is full of code.<br /><span className="text-primary">Find the people behind it.</span>
          </h1>
          <div className="reveal reveal-delay-2 mt-10 flex max-w-2xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-[430px] text-[17px] leading-relaxed text-muted-foreground">DevConnect is where engineers make their work legible, their taste visible, and the right conversations easier to start.</p>
            <div className="flex shrink-0 flex-wrap gap-3">
              <button onClick={() => scrollTo('start')} className="group flex w-fit items-center gap-3 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(194,255,59,.15)]" data-testid="button-hero-start">Join DevConnect <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></button>
              <button onClick={() => scrollTo('explore')} className="group flex w-fit items-center gap-3 rounded-full border border-border px-5 py-3.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-1 hover:border-primary hover:text-primary" data-testid="button-hero-explore">Explore Developers <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></button>
            </div>
          </div>
        </div>
        <div className="reveal reveal-delay-3 mt-24 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">
          <span>For the builders between the lines</span>
          <span className="hidden h-px w-12 bg-border sm:block" />
          <span>Independent / Intentional / Indexed</span>
          <span className="ml-auto hidden items-center gap-2 text-primary sm:flex"><CircleDashed size={12} /> Scroll to explore</span>
        </div>
      </section>

      <section id="why" className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
          <div>
            <div className="mb-6 font-mono text-[10px] uppercase tracking-[.2em] text-primary">01 / The gap</div>
            <h2 className="max-w-sm text-4xl font-semibold leading-[.98] tracking-[-.055em] sm:text-5xl">A resume says what. <span className="text-muted-foreground">Your work says why.</span></h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="border-l border-primary/50 pl-5">
              <p className="mb-3 font-mono text-[11px] text-primary">01 — CONTEXT</p>
              <h3 className="mb-3 text-xl font-medium">Show the decisions.</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">The constraints, tradeoffs, and rabbit holes behind the shipped thing. That is the part people remember.</p>
            </div>
            <div className="border-l border-cyan-300/50 pl-5">
              <p className="mb-3 font-mono text-[11px] text-cyan-300">02 — SIGNAL</p>
              <h3 className="mb-3 text-xl font-medium">Find your people.</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">A living technical identity that helps thoughtful teams recognize the specific problems you love solving.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-border bg-[#0d1218] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-12 max-w-xl">
            <div className="mb-5 font-mono text-[10px] uppercase tracking-[.2em] text-primary">02 / The toolkit</div>
            <h2 className="text-4xl font-semibold tracking-[-.055em] sm:text-5xl">Everything that makes the work <span className="text-primary">worth finding.</span></h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { number: '01', title: 'Developer Profiles', description: 'A living technical identity built around what you notice and how you work.' },
              { number: '02', title: 'Project Showcase', description: 'Give the shipped thing a home, with the decisions and context behind it.' },
              { number: '03', title: 'Technical Blogs', description: 'Publish the rabbit holes, patterns, and ideas that make your perspective distinct.' },
              { number: '04', title: 'Developer Network', description: 'Meet thoughtful builders through shared curiosity, craft, and context.' },
            ].map((feature) => (
              <article key={feature.number} className="soft-card group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
                <div className="mb-16 flex items-start justify-between">
                  <span className="font-mono text-[10px] text-primary">{feature.number}</span>
                  <ArrowUpRight size={16} className="text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <h3 className="text-xl font-medium tracking-[-.03em]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
          <div>
            <div className="mb-6 font-mono text-[10px] uppercase tracking-[.2em] text-primary">03 / How it works</div>
            <h2 className="max-w-sm text-4xl font-semibold leading-[.98] tracking-[-.055em] sm:text-5xl">Make the right introduction <span className="text-muted-foreground">easier.</span></h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              ['01', 'Frame your work', 'Start with the projects, questions, and patterns you want people to ask you about.'],
              ['02', 'Share the signal', 'Add the context that a conventional profile leaves out: tradeoffs, taste, and intent.'],
              ['03', 'Find your people', 'Let thoughtful teams and fellow builders discover the way you think.'],
            ].map(([number, title, description]) => (
              <div key={number} className="border-l border-border pl-5">
                <p className="mb-4 font-mono text-[11px] text-primary">{number}</p>
                <h3 className="mb-3 text-xl font-medium">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="explore" className="relative border-y border-border bg-[#111119]/70 px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-12 flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <div>
              <div className="mb-5 font-mono text-[10px] uppercase tracking-[.2em] text-primary">04 / The index</div>
              <h2 className="text-4xl font-semibold tracking-[-.055em] sm:text-5xl">Browse by <span className="text-primary">signal.</span></h2>
            </div>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Profile lenses">
              {lenses.map((lens) => <button key={lens} onClick={() => setActiveLens(lens)} className={`rounded-full border px-3.5 py-2 text-xs transition-all ${activeLens === lens ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-muted-foreground'}`} data-testid={`button-lens-${lens.toLowerCase().replaceAll(' ', '-')}`}>{lens}</button>)}
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {profiles.map((profile, index) => (
              <article key={profile.handle} className={`soft-card group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 ${index === 1 ? 'lg:translate-y-8' : ''}`} data-testid={`card-profile-${index}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${profile.color} opacity-50`} />
                <div className="relative">
                  <div className="mb-12 flex items-start justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-full border border-primary/30 bg-primary/10 font-mono text-sm text-primary">{profile.initials}</div>
               <Link href="/profile" className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary" aria-label={`View ${profile.name}'s profile`} data-testid={`link-view-profile-${index}`}><ArrowUpRight size={16} /></Link>
                  </div>
                  <p className="font-mono text-[10px] text-primary">{profile.handle}</p>
                  <h3 className="mt-1 text-2xl font-medium tracking-[-.035em]">{profile.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{profile.role}</p>
                  <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><Globe2 size={13} /> {profile.location}</div>
                  <div className="mt-7 flex flex-wrap gap-1.5">{profile.stack.map((tag) => <span key={tag} className="rounded-md border border-border bg-background/40 px-2 py-1 font-mono text-[10px] text-muted-foreground">{tag}</span>)}</div>
                  <div className="mt-7 flex items-center gap-2 border-t border-border pt-4 text-xs"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> {profile.availability}</div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-16 flex items-center justify-between border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[.15em] text-muted-foreground">
            <span>Showing 03 of 12,480 indexed builders</span>
            <button onClick={() => setActiveLens('All signals')} className="flex items-center gap-2 text-primary transition-colors hover:text-foreground" data-testid="button-browse-all">View full index <ArrowUpRight size={13} /></button>
          </div>
        </div>
      </section>

      <section id="teams" className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:px-10 lg:py-36">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.12fr] lg:gap-24">
          <div>
            <div className="mb-6 font-mono text-[10px] uppercase tracking-[.2em] text-primary">05 / A better first hello</div>
            <h2 className="max-w-lg text-4xl font-semibold leading-[.98] tracking-[-.06em] sm:text-6xl">Less credential theater. <span className="text-muted-foreground">More useful context.</span></h2>
            <p className="mt-7 max-w-md text-[16px] leading-relaxed text-muted-foreground">For teams, DevConnect is a sharper starting point than a keyword search. See what someone notices, not just where they have worked.</p>
            <button onClick={() => scrollTo('start')} className="mt-8 flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-foreground" data-testid="button-team-explore">Explore for teams <ArrowUpRight size={16} /></button>
          </div>
          <div className="signal-border relative overflow-hidden rounded-2xl bg-[#15151e] p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground"><Search size={13} className="text-primary" /> DISCOVERY / QUERY</div>
              <span className="rounded-full bg-primary/10 px-2 py-1 font-mono text-[9px] text-primary">LIVE INDEX</span>
            </div>
            <div className="rounded-xl border border-border bg-background/70 p-4">
              <p className="mb-3 font-mono text-[10px] text-muted-foreground">LOOKING FOR</p>
              <p className="text-lg tracking-[-.02em]">A systems thinker who makes complex things feel obvious<span className="ml-1 inline-block h-5 w-px translate-y-1 bg-primary" /></p>
              <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-primary px-2.5 py-1 font-mono text-[10px] text-primary-foreground">systems</span><span className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] text-muted-foreground">design systems</span><span className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] text-muted-foreground">writing</span></div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {['Amira Chen', 'Noah Williams'].map((name, index) => <div key={name} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 font-mono text-[10px] text-primary">{index === 0 ? 'AC' : 'NW'}</div><div><p className="text-sm">{name}</p><p className="font-mono text-[9px] text-muted-foreground">{index === 0 ? '98% context match' : '91% context match'}</p></div><Check size={14} className="ml-auto text-primary" /></div>)}
            </div>
            <p className="mt-5 flex items-center gap-2 font-mono text-[10px] text-muted-foreground"><Sparkles size={12} className="text-primary" /> Ranked by curiosity, craft, and context.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-primary px-5 py-20 text-primary-foreground sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1240px] gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="mb-6 font-mono text-[10px] uppercase tracking-[.2em] opacity-70">06 / The thesis</div>
            <h2 className="max-w-4xl text-4xl font-semibold leading-[.95] tracking-[-.065em] sm:text-6xl lg:text-7xl">The internet is full of engineers. It is short on <span className="opacity-55">legible ones.</span></h2>
          </div>
          <Network size={64} strokeWidth={1} className="hidden opacity-50 md:block" />
        </div>
      </section>

      <section id="start" className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:px-10 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-24">
          <div>
            <div className="mb-6 font-mono text-[10px] uppercase tracking-[.2em] text-primary">07 / Put a pin in it</div>
            <h2 className="text-5xl font-semibold leading-[.9] tracking-[-.065em] sm:text-7xl">Make your<br /><span className="text-primary">signal.</span></h2>
            <p className="mt-7 max-w-sm text-muted-foreground">A good profile takes less than ten minutes. The thinking behind it is yours.</p>
          </div>
          <div className="soft-card rounded-2xl p-5 sm:p-8">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.15em] text-muted-foreground"><Terminal size={14} className="text-primary" /> Your public profile</div>
              <span className="font-mono text-[10px] text-primary">01 / 03</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="grid h-20 w-20 place-items-center rounded-2xl border border-primary/30 bg-primary/10 font-mono text-xl text-primary">YC</div>
              <div><div className="mb-2 flex items-center gap-2"><h3 className="text-2xl tracking-[-.04em]">Your name, on your terms.</h3><span className="rounded-full bg-primary/10 px-2 py-1 font-mono text-[9px] text-primary">AVAILABLE</span></div><p className="text-sm leading-relaxed text-muted-foreground">Start with the work you want people to ask you about.</p></div>
            </div>
             <div className="mt-8 grid gap-3 sm:grid-cols-2"><Link href="/register" className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="link-build-profile">Build my profile <ArrowUpRight size={15} /></Link><button onClick={copyProfile} className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground" data-testid="button-copy-profile-link">{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Link copied' : 'See a sample profile'}</button></div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <button onClick={() => scrollTo('top')} className="flex items-center gap-3 text-left" data-testid="button-footer-logo"><span className="grid h-7 w-7 place-items-center rounded-[7px] bg-primary text-primary-foreground"><Code2 size={14} /></span><span className="text-sm font-semibold">dev<span className="text-primary">connect</span></span></button>
          <div className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground"><button onClick={() => scrollTo('why')} className="transition-colors hover:text-foreground" data-testid="link-footer-about">About</button><button onClick={() => scrollTo('teams')} className="transition-colors hover:text-foreground" data-testid="link-footer-teams">Teams</button><button onClick={() => scrollTo('start')} className="transition-colors hover:text-foreground" data-testid="link-footer-start">Get started</button></div>
          <div className="flex items-center gap-3 text-muted-foreground"><a href="https://github.com" target="_blank" rel="noreferrer" aria-label="DevConnect on GitHub" data-testid="link-github"><Github size={16} /></a><AtSign size={16} /><span className="font-mono text-[10px]">© 2025 DC / Build in public</span></div>
        </div>
      </footer>
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/app" component={ProtectedAppHome} />
        <Route path="/projects" component={ProtectedProjects} />
        <Route path="/profile" component={ProtectedProfile} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function ProtectedProfile() {
  return (
    <ProtectedRoute>
      <AppShell>
        <Profile />
      </AppShell>
    </ProtectedRoute>
  );
}

function ProtectedAppHome() {
  return (
    <ProtectedRoute>
      <AppHome />
    </ProtectedRoute>
  );
}

function ProtectedProjects() {
  return (
    <ProtectedRoute>
      <Projects />
    </ProtectedRoute>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
