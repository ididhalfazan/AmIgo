import { create } from "zustand";
import { api } from "@/lib/api";
import { User } from "@/types/user";

type CurrentUserState = {
  user: User | null;
  loading: boolean;
  loaded: boolean;
  fetch: () => Promise<void>;
  setUser: (user: User) => void;
};

/**
 * Single source of truth for "who am I" so the nav, composer, profile page,
 * etc. all reflect the same data (e.g. an avatar upload on the profile page
 * shows up in the nav immediately) instead of each fetching /auth/me
 * independently and drifting out of sync.
 */
export const useCurrentUserStore = create<CurrentUserState>((set, get) => ({
  user: null,
  loading: false,
  loaded: false,
  async fetch() {
    if (get().loading || get().loaded) return;
    set({ loading: true });
    try {
      const response = await api.get<User>("/auth/me");
      set({ user: response.data, loaded: true });
    } catch {
      set({ loaded: true });
    } finally {
      set({ loading: false });
    }
  },
  setUser(user) {
    set({ user, loaded: true });
  },
}));
