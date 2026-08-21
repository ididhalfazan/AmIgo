import { redirect } from "next/navigation";
import { AppNav } from "@/components/layout/AppNav";
import { CommunitiesClient } from "@/components/communities/CommunitiesClient";
import { backendFetch } from "@/lib/serverApi";
import { Community } from "@/types/community";

export default async function CommunitiesPage() {
  const res = await backendFetch("/api/communities");
  if (res.status === 401) redirect("/login");
  const communities: Community[] = await res.json();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <CommunitiesClient initialCommunities={communities} />
    </div>
  );
}
