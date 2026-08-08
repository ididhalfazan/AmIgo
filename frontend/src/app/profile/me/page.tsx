import { redirect } from "next/navigation";
import { AppNav } from "@/components/layout/AppNav";
import { ProfileClient } from "@/components/profile/ProfileClient";
import { backendFetch } from "@/lib/serverApi";
import { mapApiPost } from "@/lib/postMapper";
import { ApiFeedPage } from "@/types/post";
import { User } from "@/types/user";

export default async function MyProfilePage() {
  const [userRes, postsRes] = await Promise.all([
    backendFetch("/api/auth/me"),
    backendFetch("/api/users/me/posts"),
  ]);

  if (userRes.status === 401 || postsRes.status === 401) redirect("/login");

  const user: User = await userRes.json();
  const posts: ApiFeedPage = await postsRes.json();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <ProfileClient initialUser={user} initialPosts={posts.posts.map(mapApiPost)} />
    </div>
  );
}
