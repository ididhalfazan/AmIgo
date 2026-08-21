"use client";

import { useEffect } from "react";
import { useCurrentUserStore } from "@/store/currentUser";

export function useCurrentUser() {
  const user = useCurrentUserStore((s) => s.user);
  const fetch = useCurrentUserStore((s) => s.fetch);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return user;
}
