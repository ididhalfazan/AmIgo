"use client";

import { useCallback, useRef, useState } from "react";
import { PostComposer } from "@/components/feed/PostComposer";
import { PostCard } from "@/components/feed/PostCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { api } from "@/lib/api";
import { mapApiPost } from "@/lib/postMapper";
import { ApiFeedPage, Post } from "@/types/post";

type FeedClientProps = {
  initialPosts: Post[];
  initialHasMore: boolean;
};

export function FeedClient({ initialPosts, initialHasMore }: FeedClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  // Page 0 was already fetched server-side (see app/feed/page.tsx) — client
  // pagination starts from page 1.
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const response = await api.get<ApiFeedPage>("/feed", { params: { page } });
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = response.data.posts.map(mapApiPost).filter((p) => !existingIds.has(p.id));
        return [...prev, ...newPosts];
      });
      setHasMore(response.data.has_more);
      setPage((p) => p + 1);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasMore, page]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loading);

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
      <PostComposer onPost={handleNewPost} />

      {posts.map((post) => (
        <PostCard key={post.id} post={post} onToggleLike={handleToggleLike} />
      ))}

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-6 text-sm text-muted-foreground">
          {loading ? "Loading more posts…" : ""}
        </div>
      )}

      {!hasMore && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          You&apos;re all caught up.
        </p>
      )}
    </main>
  );
}
