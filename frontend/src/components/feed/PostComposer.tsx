"use client";

import { useState, FormEvent } from "react";
import { Avatar } from "./Avatar";
import { api, getErrorMessage } from "@/lib/api";
import { mapApiPost, colorForId } from "@/lib/postMapper";
import { ApiPost, Post } from "@/types/post";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 17 4.5-4.5 3 3L18 10l1.5 1.5" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      <rect x="3.5" y="6.5" width="12" height="11" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m20.5 9-5 3 5 3V9Z" />
    </svg>
  );
}

type PostComposerProps = {
  onPost: (post: Post) => void;
  communityId?: string;
};

export function PostComposer({ onPost, communityId }: PostComposerProps) {
  const [caption, setCaption] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useCurrentUser();
  const avatarSrc = user?.avatar_url ? `${BACKEND_ORIGIN}${user.avatar_url}` : null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = caption.trim();
    if (!trimmed) return;

    setPosting(true);
    setError(null);
    try {
      const response = await api.post<ApiPost>("/posts", {
        caption: trimmed,
        type: "status",
        community_id: communityId ?? null,
      });
      onPost(mapApiPost(response.data));
      setCaption("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPosting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-muted/30 p-5"
    >
      <div className="flex gap-3">
        <Avatar
          name={user?.name ?? "?"}
          color={user ? colorForId(user.id) : "#c1703f"}
          src={avatarSrc}
        />
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What's on your mind?"
          rows={2}
          className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      {error && <p className="mt-2 text-sm text-primary">{error}</p>}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-2 text-muted-foreground">
          <button
            type="button"
            title="Add image (coming soon)"
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-muted hover:text-foreground"
          >
            <ImageIcon />
          </button>
          <button
            type="button"
            title="Add video (coming soon)"
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-muted hover:text-foreground"
          >
            <VideoIcon />
          </button>
        </div>
        <button
          type="submit"
          disabled={!caption.trim() || posting}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Post
        </button>
      </div>
    </form>
  );
}
