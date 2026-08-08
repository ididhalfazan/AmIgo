"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/feed/Avatar";
import { useChatWidgetStore } from "@/store/chatWidget";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { colorForId } from "@/lib/postMapper";
import { MOCK_CONVERSATIONS } from "@/lib/mockConversations";
import { ChatMessage, Conversation } from "@/types/chat";

const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5 8 12l7 7" />
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

export function ChatWidget() {
  const isOpen = useChatWidgetStore((s) => s.isOpen);
  const close = useChatWidgetStore((s) => s.close);
  const user = useCurrentUser();

  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages]);

  function openConversation(id: string) {
    setActiveId(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: false } : c)));
  }

  function appendMessage(conversationId: string, message: ChatMessage, preview: string) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, message], lastMessage: preview }
          : c,
      ),
    );
  }

  function handleSend(e: FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || !active) return;

    appendMessage(active.id, { id: crypto.randomUUID(), fromMe: true, text: trimmed }, `You: ${trimmed}`);
    setDraft("");
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 z-30 flex w-full flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-in-out sm:w-[420px] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      aria-hidden={!isOpen}
    >
      {!active ? (
        <>
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-4">
            <p className="text-lg font-semibold">Chats</p>
            <button
              type="button"
              onClick={close}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
              title="Close"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => openConversation(conversation.id)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-muted/40"
              >
                <Avatar name={conversation.name} color={conversation.avatarColor} size={48} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{conversation.name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread && (
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-4">
            <button
              type="button"
              onClick={() => setActiveId(null)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
              title="Back to chats"
            >
              <BackIcon />
            </button>
            <Avatar name={active.name} color={active.avatarColor} size={40} />
            <p className="font-semibold leading-tight">{active.name}</p>
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
            {active.messages.map((message) =>
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
                  <Avatar name={active.name} color={active.avatarColor} size={28} />
                  <div className="max-w-[75%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm leading-6">
                    {message.text}
                  </div>
                </div>
              ),
            )}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border p-4">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Message ${active.name}…`}
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
        </>
      )}
    </div>
  );
}
