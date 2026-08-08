"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { VerificationModal } from "@/components/verification/VerificationModal";

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
      <circle cx="10" cy="7" r="3.2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 14.5A3.5 3.5 0 0 1 21 18v1M14.8 4.3a3.2 3.2 0 0 1 0 6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <circle cx="11" cy="11" r="6.5" />
      <path strokeLinecap="round" d="m20 20-3.5-3.5" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <circle cx="12" cy="12" r="3" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.4 13.5c.1-.5.1-1 0-1.5l1.4-1.6-1.5-2.6-2.1.5a5.5 5.5 0 0 0-1.3-.75L15.5 5h-3l-.4 2.15c-.47.18-.9.43-1.3.75l-2.1-.5-1.5 2.6L8.6 12c-.1.5-.1 1 0 1.5l-1.4 1.6 1.5 2.6 2.1-.5c.4.32.83.57 1.3.75L12.5 20h3l.4-2.15c.47-.18.9-.43 1.3-.75l2.1.5 1.5-2.6-1.4-1.6Z"
      />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5 5 6v5.5c0 4.4 2.9 7.2 7 9 4.1-1.8 7-4.6 7-9V6l-7-2.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.3 12 1.9 1.9 3.6-3.9" />
    </svg>
  );
}

function SidebarCard({
  icon,
  title,
  subtitle,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </>
  );

  const className =
    "flex w-full items-center gap-3 rounded-2xl border border-border bg-muted/30 p-4 text-left transition hover:bg-muted/50";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export function LeftSidebar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);

  return (
    <>
      <div className="fixed left-6 top-24 z-10 hidden w-64 flex-col gap-3 xl:flex">
        <SidebarCard
          icon={<UsersIcon />}
          title="Friends"
          subtitle="See who's around"
          href="/friends"
        />
        <SidebarCard
          icon={<SearchIcon />}
          title="Search"
          subtitle="Communities, friends, events"
          onClick={() => setSearchOpen(true)}
        />
        <SidebarCard
          icon={<SettingsIcon />}
          title="Settings"
          subtitle="Account & preferences"
          href="/settings"
        />
        <SidebarCard
          icon={<BadgeIcon />}
          title="Get verified"
          subtitle="Apply for a verification badge"
          onClick={() => setVerificationOpen(true)}
        />
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      {verificationOpen && <VerificationModal onClose={() => setVerificationOpen(false)} />}
    </>
  );
}
