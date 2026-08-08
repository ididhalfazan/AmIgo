"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/feed/Avatar";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { AgentChatWidget } from "@/components/chat/AgentChatWidget";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { useChatWidgetStore } from "@/store/chatWidget";
import { useAgentChatWidgetStore } from "@/store/agentChatWidget";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { colorForId } from "@/lib/postMapper";

const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const links = [
  { href: "/feed", label: "Feed" },
  { href: "/communities", label: "Communities" },
  { href: "/notifications", label: "Notifications" },
];

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5h16v10H9l-4 4v-4H4v-10Z" />
    </svg>
  );
}

function AgentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="4.5" y="8.5" width="15" height="10" rx="3" />
      <path strokeLinecap="round" d="M12 8.5V5M9 4.5h6" />
      <circle cx="9" cy="13.3" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13.3" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function AppNav() {
  const pathname = usePathname();
  const user = useCurrentUser();
  const toggleChat = useChatWidgetStore((s) => s.toggle);
  const chatOpen = useChatWidgetStore((s) => s.isOpen);
  const closeChat = useChatWidgetStore((s) => s.close);
  const toggleAgentChat = useAgentChatWidgetStore((s) => s.toggle);
  const agentChatOpen = useAgentChatWidgetStore((s) => s.isOpen);
  const closeAgentChat = useAgentChatWidgetStore((s) => s.close);

  const avatarSrc = user?.avatar_url ? `${BACKEND_ORIGIN}${user.avatar_url}` : null;

  // Only one chat panel can be open at a time — opening one closes the other.
  function handleToggleChat() {
    if (!chatOpen) closeAgentChat();
    toggleChat();
  }

  function handleToggleAgentChat() {
    if (!agentChatOpen) closeChat();
    toggleAgentChat();
  }

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Link href="/feed">
            <Image src="/logo.png" alt="AmIgo" width={110} height={38} unoptimized className="h-8 w-auto" />
          </Link>
          <nav className="flex items-center gap-4">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={handleToggleChat}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                chatOpen
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
              }`}
            >
              <ChatIcon />
              Chats
            </button>
            <button
              type="button"
              onClick={handleToggleAgentChat}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                agentChatOpen
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
              }`}
            >
              <AgentIcon />
              AMIGO Agent
            </button>
            <Link href="/profile/me">
              <Avatar
                name={user?.name ?? "?"}
                color={user ? colorForId(user.id) : "#c1703f"}
                size={32}
                src={avatarSrc}
              />
            </Link>
          </nav>
        </div>
      </header>
      <LeftSidebar />
      <ChatWidget />
      <AgentChatWidget />
    </>
  );
}
