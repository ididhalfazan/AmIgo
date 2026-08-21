"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Notification } from "@/types/notification";

const TYPE_LABELS: Record<Notification["type"], string> = {
  reminder: "Reminder",
  community_summary: "Community summary",
  daily_summary: "Daily summary",
};

function notificationMessage(notification: Notification): string {
  const payload = notification.payload;
  if (typeof payload.message === "string") return payload.message;
  if (typeof payload.summary === "string") return payload.summary;
  return JSON.stringify(payload);
}

type NotificationsClientProps = {
  initialNotifications: Notification[];
};

export function NotificationsClient({ initialNotifications }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  async function handleMarkRead(id: string) {
    const response = await api.post<Notification>(`/notifications/${id}/read`);
    setNotifications((prev) => prev.map((n) => (n.id === id ? response.data : n)));
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-6">
      <h1 className="text-xl font-semibold">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No notifications yet — this is where your Reminder and Community
          Agent summaries will show up once they&apos;re running.
        </p>
      ) : (
        notifications.map((notification) => (
          <button
            key={notification.id}
            type="button"
            onClick={() => handleMarkRead(notification.id)}
            className={`flex flex-col gap-1 rounded-2xl border border-border p-5 text-left transition hover:bg-muted/40 ${
              notification.read_at ? "bg-transparent" : "bg-muted/30"
            }`}
          >
            <div className="flex items-center gap-2">
              {!notification.read_at && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
              )}
              <span className="text-xs font-medium uppercase tracking-wide text-secondary">
                {TYPE_LABELS[notification.type]}
              </span>
            </div>
            <p className="text-sm leading-6">{notificationMessage(notification)}</p>
          </button>
        ))
      )}
    </main>
  );
}
