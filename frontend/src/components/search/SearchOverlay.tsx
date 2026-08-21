"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/feed/Avatar";
import { api } from "@/lib/api";
import { MOCK_EVENTS, MOCK_FRIENDS } from "@/lib/mockDirectory";
import { Community } from "@/types/community";

type Tab = "all" | "communities" | "friends" | "events";

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "communities", label: "Communities" },
  { key: "friends", label: "Friends" },
  { key: "events", label: "Events" },
];

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <circle cx="11" cy="11" r="6.5" />
      <path strokeLinecap="round" d="m20 20-3.5-3.5" />
    </svg>
  );
}

type SearchOverlayProps = {
  onClose: () => void;
};

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    api
      .get<Community[]>("/communities")
      .then((res) => setCommunities(res.data))
      .catch(() => setCommunities([]));
  }, []);

  const q = query.trim().toLowerCase();
  const matchedCommunities =
    tab === "all" || tab === "communities"
      ? communities.filter((c) => !q || c.name.toLowerCase().includes(q))
      : [];
  const matchedFriends =
    tab === "all" || tab === "friends"
      ? MOCK_FRIENDS.filter((f) => !q || f.name.toLowerCase().includes(q))
      : [];
  const matchedEvents =
    tab === "all" || tab === "events"
      ? MOCK_EVENTS.filter((e) => !q || e.name.toLowerCase().includes(q))
      : [];

  const hasResults = matchedCommunities.length + matchedFriends.length + matchedEvents.length > 0;

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/40 px-4 pt-24">
      <div className="flex max-h-[70vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <SearchIcon />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search communities, friends, events…"
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex gap-2 border-b border-border px-4 py-2.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {!hasResults && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No results{q && ` for "${query}"`}.
            </p>
          )}

          {matchedCommunities.length > 0 && (
            <div className="mb-2">
              <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Communities
              </p>
              {matchedCommunities.map((c) => (
                <Link
                  key={c.id}
                  href={`/communities/${c.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-muted/40"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.member_count} member{c.member_count === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {matchedFriends.length > 0 && (
            <div className="mb-2">
              <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Friends
              </p>
              {matchedFriends.map((f) => (
                <div key={f.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                  <Avatar name={f.name} color={f.avatarColor} size={36} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{f.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{f.mutual}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {matchedEvents.length > 0 && (
            <div>
              <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Events
              </p>
              {matchedEvents.map((e) => (
                <div key={e.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                    📅
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{e.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {e.date} · {e.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
