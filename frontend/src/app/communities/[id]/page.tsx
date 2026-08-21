import { redirect } from "next/navigation";
import { AppNav } from "@/components/layout/AppNav";
import { CommunityDetailClient } from "@/components/communities/CommunityDetailClient";
import { backendFetch } from "@/lib/serverApi";
import { mapApiPost } from "@/lib/postMapper";
import { ApiFeedPage } from "@/types/post";
import { Community } from "@/types/community";

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [communitiesRes, feedRes] = await Promise.all([
    backendFetch("/api/communities"),
    backendFetch(`/api/communities/${id}/feed?page=0`),
  ]);

  if (communitiesRes.status === 401 || feedRes.status === 401) redirect("/login");

  const communities: Community[] = await communitiesRes.json();
  const feed: ApiFeedPage = await feedRes.json();
  const community = communities.find((c) => c.id === id) ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <CommunityDetailClient
        communityId={id}
        initialCommunity={community}
        initialPosts={feed.posts.map(mapApiPost)}
        initialHasMore={feed.has_more}
      />
    </div>
  );
}
