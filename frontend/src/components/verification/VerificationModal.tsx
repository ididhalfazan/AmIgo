"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5 5 6v5.5c0 4.4 2.9 7.2 7 9 4.1-1.8 7-4.6 7-9V6l-7-2.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.3 12 1.9 1.9 3.6-3.9" />
    </svg>
  );
}

const CATEGORIES = ["Creator", "Business", "Public figure", "Community organizer"];

type VerificationModalProps = {
  onClose: () => void;
};

export function VerificationModal({ onClose }: VerificationModalProps) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Design-only placeholder — there's no verification review workflow on
    // the backend yet. See plan.md's roadmap.
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
            <BadgeIcon />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <CloseIcon />
          </button>
        </div>

        {submitted ? (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Application submitted</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              We&apos;ll review your request and get back to you. (This is a design
              placeholder — there&apos;s no review process wired up yet.)
            </p>
            <Button type="button" onClick={onClose} className="mt-5">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold">Apply for a verification badge</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Let the community know your account is authentic.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Why should you be verified?
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                required
                placeholder="Tell us about yourself and why you'd like a verification badge…"
                className="resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <Button type="submit" disabled={!reason.trim()}>
              Submit application
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
