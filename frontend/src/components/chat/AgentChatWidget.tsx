"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/feed/Avatar";
import { useAgentChatWidgetStore } from "@/store/agentChatWidget";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { colorForId } from "@/lib/postMapper";
import { ChatMessage } from "@/types/chat";

const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "agent-greeting",
    fromMe: false,
    text: "Hi! I'm your Amigo agent. I can help you set reminders, summarize a community, or catch you up on your day.",
  },
];

function BotIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <rect x="4.5" y="8.5" width="15" height="10" rx="3" />
      <path strokeLinecap="round" d="M12 8.5V5M9 4.5h6" />
      <circle cx="9" cy="13.3" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13.3" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12 19.5 5 13 19.5l-2.2-6.3L4.5 12Z" />
    </svg>
  );
}

function AgentAvatar({ size }: { size: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-accent text-primary"
      style={{ width: size, height: size }}
    >
      <BotIcon />
    </div>
  );
}

export function AgentChatWidget() {
  const isOpen = useAgentChatWidgetStore((s) => s.isOpen);
  const close = useAgentChatWidgetStore((s) => s.close);
  const user = useCurrentUser();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function handleSend(e: FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), fromMe: true, text: trimmed }]);
    setDraft("");

    // Design-only placeholder reply until the real agent backend (plan.md's
    // Agent Layer) is wired up.
    setTyping(true);
    setTimeout(() => {
      const reply =
        "I can't act on that yet — my real capabilities are still being built. Hang tight!";
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), fromMe: false, text: reply }]);
      setTyping(false);
    }, 700);
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 z-30 flex w-full flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-in-out sm:w-[420px] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-5 py-4">
        <AgentAvatar size={40} />
        <p className="font-semibold leading-tight">AMIGO Agent</p>
        <button
          type="button"
          onClick={close}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          title="Close"
        >
          <CloseIcon />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.map((message) =>
          message.fromMe ? (
            <div key={message.id} className="flex items-end justify-end gap-2">
              <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm leading-6 text-primary-foreground">
                {message.text}
              </div>
              <Avatar
                name={user?.name ?? "?"}
                color={user ? colorForId(user.id) : "#c1703f"}
                size={28}
                src={user?.avatar_url ? `${BACKEND_ORIGIN}${user.avatar_url}` : null}
              />
            </div>
          ) : (
            <div key={message.id} className="flex items-end gap-2">
              <AgentAvatar size={28} />
              <div className="max-w-[75%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm leading-6">
                {message.text}
              </div>
            </div>
          ),
        )}
        {typing && (
          <div className="flex items-end gap-2">
            <AgentAvatar size={28} />
            <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border p-4">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message the Amigo agent…"
          className="w-full rounded-full border border-border bg-muted/30 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
}
