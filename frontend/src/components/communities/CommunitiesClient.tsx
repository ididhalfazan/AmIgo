"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api, getErrorMessage } from "@/lib/api";
import { Community } from "@/types/community";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type CommunitiesClientProps = {
  initialCommunities: Community[];
};

export function CommunitiesClient({ initialCommunities }: CommunitiesClientProps) {
  const [communities, setCommunities] = useState<Community[]>(initialCommunities);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  async function reload() {
    try {
      const response = await api.get<Community[]>("/communities");
      setCommunities(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    try {
      await api.post("/communities", {
        name: name.trim(),
        slug: slugify(name),
        description: description.trim() || null,
      });
      setName("");
      setDescription("");
      await reload();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  async function handleJoin(id: string) {
    try {
      await api.post(`/communities/${id}/join`);
      await reload();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-6">
      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/30 p-5"
      >
        <h2 className="font-semibold">Start a community</h2>
        <Input
          label="Name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Description (optional)"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit" loading={creating} disabled={!name.trim()}>
          Create community
        </Button>
      </form>

      {error && <p className="text-sm text-primary">{error}</p>}

      {communities.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No communities yet — be the first to start one.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {communities.map((community) => (
            <div
              key={community.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-muted/30 p-5"
            >
              <div>
                <Link
                  href={`/communities/${community.id}`}
                  className="font-semibold hover:text-primary"
                >
                  {community.name}
                </Link>
                {community.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{community.description}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {community.member_count} member{community.member_count === 1 ? "" : "s"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleJoin(community.id)}
                disabled={community.is_member}
                className="shrink-0 rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                {community.is_member ? "Joined" : "Join"}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
