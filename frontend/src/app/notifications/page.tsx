import { redirect } from "next/navigation";
import { AppNav } from "@/components/layout/AppNav";
import { NotificationsClient } from "@/components/notifications/NotificationsClient";
import { backendFetch } from "@/lib/serverApi";
import { Notification } from "@/types/notification";

export default async function NotificationsPage() {
  const res = await backendFetch("/api/notifications");
  if (res.status === 401) redirect("/login");
  const notifications: Notification[] = await res.json();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <NotificationsClient initialNotifications={notifications} />
    </div>
  );
}
