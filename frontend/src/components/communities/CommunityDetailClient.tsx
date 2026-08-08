"use client";

import { useCallback, useRef, useState } from "react";
import { PostComposer } from "@/components/feed/PostComposer";
import { PostCard } from "@/components/feed/PostCard";
import { Button } from "@/components/ui/Button";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { api, getErrorMessage } from "@/lib/api";
import { mapApiPost } from "@/lib/postMapper";
import { ApiFeedPage, Post } from "@/types/post";
import { Community } from "@/types/community";

type CommunityDetailClientProps = {
  communityId: string;
  initialCommunity: Community | null;
  initialPosts: Post[];
  initialHasMore: boolean;
};

export function CommunityDetailClient({
  communityId,
  initialCommunity,
  initialPosts,
  initialHasMore,
}: CommunityDetailClientProps) {
  const [community, setCommunity] = useState<Community | null>(initialCommunity);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  // Page 0 was already fetched server-side — client pagination starts at 1.
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const response = await api.get<ApiFeedPage>(`/communities/${communityId}/feed`, {
        params: { page },
      });
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = response.data.posts.map(mapApiPost).filter((p) => !existingIds.has(p.id));
        return [...prev, ...newPosts];
      });
      setHasMore(response.data.has_more);
      setPage((p) => p + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasMore, page, communityId]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loading);

  async function handleJoin() {
    if (!community) return;
    try {
      const response = await api.post<Community>(`/communities/${community.id}/join`);
      setCommunity(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleToggleLike(postId: string) {
    const response = await api.post(`/posts/${postId}/like`);
    const updated = mapApiPost(response.data);
    setPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
  }

  function handleNewPost(post: Post) {
    setPosts((prev) => [post, ...prev]);
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-6">
      {community && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-muted/30 p-5">
          <div>
            <h1 className="text-xl font-semibold">{community.name}</h1>
            {community.description && (
              <p className="mt-1 text-sm text-muted-foreground">{community.description}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {community.member_count} member{community.member_count === 1 ? "" : "s"}
            </p>
          </div>
          <Button onClick={handleJoin} disabled={community.is_member} className="w-auto shrink-0">
            {community.is_member ? "Joined" : "Join"}
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-primary">{error}</p>}

      {community?.is_member && <PostComposer onPost={handleNewPost} communityId={communityId} />}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} onToggleLike={handleToggleLike} />
      ))}

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-6 text-sm text-muted-foreground">
          {loading ? "Loading more posts…" : ""}
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          You&apos;re all caught up.
        </p>
      )}

      {!hasMore && posts.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No posts in this community yet.
        </p>
      )}
    </main>
  );
}
