import { redirect } from "next/navigation";
import { AppNav } from "@/components/layout/AppNav";
import { FeedClient } from "@/components/feed/FeedClient";
import { backendFetch } from "@/lib/serverApi";
import { mapApiPost } from "@/lib/postMapper";
import { ApiFeedPage } from "@/types/post";

export default async function FeedPage() {
  const res = await backendFetch("/api/feed?page=0");
  if (res.status === 401) redirect("/login");
  const data: ApiFeedPage = await res.json();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <FeedClient initialPosts={data.posts.map(mapApiPost)} initialHasMore={data.has_more} />
    </div>
  );
}
