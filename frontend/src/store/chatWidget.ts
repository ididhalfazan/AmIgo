import { create } from "zustand";

type ChatWidgetState = {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
};

/**
 * UI-only open/closed state for the friends chat panel, separate from the
 * dedicated Amigo Agent panel (store/agentChatWidget.ts).
 */
export const useChatWidgetStore = create<ChatWidgetState>((set) => ({
  isOpen: false,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
