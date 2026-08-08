"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/feed/Avatar";
import { PostCard } from "@/components/feed/PostCard";
import { api, getErrorMessage } from "@/lib/api";
import { mapApiPost, colorForId } from "@/lib/postMapper";
import { Post } from "@/types/post";
import { User } from "@/types/user";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentUserStore } from "@/store/currentUser";

const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z" />
      <circle cx="12" cy="13.5" r="3.2" />
    </svg>
  );
}

type ProfileClientProps = {
  initialUser: User;
  initialPosts: Post[];
};

export function ProfileClient({ initialUser, initialPosts }: ProfileClientProps) {
  // Hydrate the shared store from the server-fetched user. This must run in
  // an effect, not during render — mutating a Zustand store mid-render can
  // synchronously update other mounted components (e.g. ChatWidget, via
  // useCurrentUser) while React is still rendering this one, which React
  // flags as an invalid cross-component setState.
  useEffect(() => {
    useCurrentUserStore.getState().setUser(initialUser);
  }, [initialUser]);

  const user = useCurrentUser();
  const setUser = useCurrentUserStore((s) => s.setUser);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleToggleLike(postId: string) {
    const response = await api.post(`/posts/${postId}/like`);
    const updated = mapApiPost(response.data);
    setPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post<User>("/users/me/avatar", formData, {
        headers: { "Content-Type": undefined },
      });
      setUser(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const avatarSrc = user?.avatar_url ? `${BACKEND_ORIGIN}${user.avatar_url}` : null;

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-6">
      {error && <p className="text-sm text-primary">{error}</p>}

      {user && (
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-muted/30 p-5">
          <div className="relative shrink-0">
            <Avatar name={user.name} color={colorForId(user.id)} size={64} src={avatarSrc} />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Change profile photo"
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition hover:bg-muted disabled:opacity-50"
            >
              <CameraIcon />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="mt-1 text-sm">
              {user.bio ?? <span className="text-muted-foreground">No bio yet.</span>}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Bio is {user.bio_is_public ? "public" : "private"}
              {uploading && " · Uploading photo…"}
            </p>
          </div>
        </div>
      )}

      <h2 className="mt-2 text-sm font-semibold text-muted-foreground">Your posts</h2>

      {posts.length === 0 && (
        <p className="text-sm text-muted-foreground">You haven&apos;t posted anything yet.</p>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} onToggleLike={handleToggleLike} />
      ))}
    </main>
  );
}
