import { create } from "zustand";

type AgentChatWidgetState = {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
};

/**
 * UI-only open/closed state for the dedicated Amigo Agent chat panel,
 * separate from the friends chat panel (store/chatWidget.ts) so the two
 * can be toggled independently from the nav bar.
 */
export const useAgentChatWidgetStore = create<AgentChatWidgetState>((set) => ({
  isOpen: false,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
