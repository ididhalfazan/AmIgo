"use client";

import { useState } from "react";
import { AppNav } from "@/components/layout/AppNav";
import { Avatar } from "@/components/feed/Avatar";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { api, getErrorMessage } from "@/lib/api";
import { colorForId } from "@/lib/postMapper";

const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function SettingsPage() {
  const user = useCurrentUser();
  const [bio, setBio] = useState(user?.bio ?? "");
  const [bioIsPublic, setBioIsPublic] = useState(user?.bio_is_public ?? true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const avatarSrc = user?.avatar_url ? `${BACKEND_ORIGIN}${user.avatar_url}` : null;

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      await api.patch("/users/me", { bio, bio_is_public: bioIsPublic });
      setMessage("Saved.");
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNav />
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-6">
        <h1 className="text-xl font-semibold">Settings</h1>

        {!user ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            <section className="rounded-2xl border border-border bg-muted/30 p-6">
              <h2 className="font-semibold">Account</h2>
              <div className="mt-4 flex items-center gap-4">
                <Avatar name={user.name} color={colorForId(user.id)} size={56} src={avatarSrc} />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                To change your name or email, that&apos;s a separate flow we haven&apos;t built
                yet. Your photo can be updated from your{" "}
                <a href="/profile/me" className="text-primary underline">
                  profile page
                </a>
                .
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-muted/30 p-6">
              <h2 className="font-semibold">Bio &amp; privacy</h2>
              <div className="mt-4 flex flex-col gap-1.5">
                <label className="text-sm font-medium">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Tell people a bit about yourself…"
                  className="resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <label className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium">Make bio public</p>
                  <p className="text-xs text-muted-foreground">
                    Only public info is ever used by the Profile Summary Agent.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={bioIsPublic}
                  onChange={(e) => setBioIsPublic(e.target.checked)}
                  className="h-5 w-5 accent-[#c1703f]"
                />
              </label>

              <div className="mt-4 flex items-center gap-3">
                <Button type="button" onClick={handleSave} loading={saving} className="w-auto">
                  Save changes
                </Button>
                {message && <p className="text-sm text-muted-foreground">{message}</p>}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
