"use client";

import { AppNav } from "@/components/layout/AppNav";
import { Avatar } from "@/components/feed/Avatar";
import { useChatWidgetStore } from "@/store/chatWidget";
import { useAgentChatWidgetStore } from "@/store/agentChatWidget";
import { MOCK_FRIENDS } from "@/lib/mockDirectory";

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5h16v10H9l-4 4v-4H4v-10Z" />
    </svg>
  );
}

export default function FriendsPage() {
  const openChat = useChatWidgetStore((s) => s.open);
  const closeAgentChat = useAgentChatWidgetStore((s) => s.close);

  function handleMessage() {
    closeAgentChat();
    openChat();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-6">
        <div>
          <h1 className="text-xl font-semibold">Friends</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This list is a design placeholder — friend requests and follows
            aren&apos;t wired up to the backend yet.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {MOCK_FRIENDS.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-muted/30 p-5"
            >
              <div className="flex items-center gap-3">
                <Avatar name={friend.name} color={friend.avatarColor} size={48} />
                <div>
                  <p className="font-semibold">{friend.name}</p>
                  <p className="text-sm text-muted-foreground">{friend.mutual}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleMessage}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                <MessageIcon />
                Message
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
