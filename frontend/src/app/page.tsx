import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

function IconWrap({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary">
      {children}
    </div>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
      <circle cx="10" cy="7" r="3.2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 14.5A3.5 3.5 0 0 1 21 18v1M14.8 4.3a3.2 3.2 0 0 1 0 6" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <circle cx="12" cy="12" r="8.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.8 9.2 13 13l-3.8 1.8L11 11l3.8-1.8Z" />
    </svg>
  );
}

function BotIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <rect x="4.5" y="8.5" width="15" height="10" rx="3" />
      <path strokeLinecap="round" d="M12 8.5V5M9 4.5h6" />
      <circle cx="9" cy="13.3" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13.3" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5 5 6v5.5c0 4.4 2.9 7.2 7 9 4.1-1.8 7-4.6 7-9V6l-7-2.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.3 12 1.9 1.9 3.6-3.9" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5h16v10H9l-4 4v-4H4v-10Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <rect x="4" y="5.5" width="16" height="14" rx="2" />
      <path strokeLinecap="round" d="M4 9.5h16M8 3.5v3M16 3.5v3" />
    </svg>
  );
}

function BulbIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6M10 21h4M8.5 13.5A4.5 4.5 0 1 1 15.5 13.5c-.7.9-1.5 1.6-1.5 2.9v.1h-4v-.1c0-1.3-.8-2-1.5-2.9Z" />
    </svg>
  );
}

const platformFeatures = [
  {
    icon: <UsersIcon />,
    title: "Meaningful Connections",
    body: "Follow the people you care about and see their posts in a feed built around your own network, not an algorithm.",
  },
  {
    icon: <CompassIcon />,
    title: "Intent-Based Discovery",
    body: "Join communities around what you're actually into — activity, discussion, and updates scoped to that group.",
  },
  {
    icon: <BotIcon />,
    title: "AI Agents That Assist",
    body: "Reminders, summaries, and a chat agent that can act on the platform for you — not just answer questions.",
  },
  {
    icon: <ShieldIcon />,
    title: "Privacy by Design",
    body: "Agents only ever summarize what's public. Your private activity is never used without your say-so.",
  },
];

const agentCapabilities = [
  {
    icon: <ChatIcon />,
    title: "Smart Conversations",
    body: "Ask your Amigo agent to set reminders, summarize a community, or catch you up — in plain language.",
  },
  {
    icon: <UsersIcon />,
    title: "Connect Meaningfully",
    body: "Get a public-activity summary of someone's interests before you reach out.",
  },
  {
    icon: <CalendarIcon />,
    title: "Plan & Coordinate",
    body: "Reminders sync straight to Google Calendar, set right from the chat.",
  },
  {
    icon: <BulbIcon />,
    title: "Discover What Matters",
    body: "A nightly digest of your day and your communities, waiting in your notifications.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Image src="/logo.png" alt="AmIgo" width={120} height={41} priority unoptimized className="h-9 w-auto" />
          <nav className="flex items-center gap-3 text-sm font-medium">
            <Link href="/login" className="text-foreground/80 hover:text-foreground">
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-primary px-4 py-2 text-primary-foreground transition hover:opacity-90"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 pb-16 pt-20 text-center sm:pt-28">
        <Image src="/logo.png" alt="AmIgo" width={220} height={75} priority unoptimized className="h-auto w-48 sm:w-56" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          Agentic Social Media
        </p>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
          Social networking, powered by intelligent agents.
        </h1>
        <p className="max-w-xl text-base leading-7 text-muted-foreground">
          Posts, feeds, and communities — backed by AI agents that summarize
          your day, manage reminders, and let you act on the platform through
          a conversation instead of a dozen taps.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Log in
          </Link>
        </div>
      </section>

      {/* Platform features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {platformFeatures.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/40 p-6"
            >
              <IconWrap>{f.icon}</IconWrap>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Agent capabilities */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-semibold">Meet your Amigo agent</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              One chat, four jobs — connecting, planning, discovering, and
              keeping you in the loop.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {agentCapabilities.map((f) => (
              <div key={f.title} className="flex flex-col items-center gap-3 text-center">
                <IconWrap>{f.icon}</IconWrap>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold">Ready to join?</h2>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          Create an account and let your agent handle the busywork while you
          keep up with the people and communities that matter.
        </p>
        <Link
          href="/register"
          className="rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Create your account
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 px-6 py-8 text-center text-xs text-muted-foreground">
        AmIgo — Agentic Social Media
      </footer>
    </div>
  );
}
