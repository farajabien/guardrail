"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, id } from "@/lib/instant-client";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const MAX_NOTE_LENGTH = 140;

export function NewIdeaForm() {
  const router = useRouter();
  const { user } = db.useAuth();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (shouldScore: boolean) => {
    if (!title.trim()) {
      setError("Idea title is required");
      return;
    }

    if (!user) {
      setError("You must be signed in to create ideas");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const ideaId = id();
      const now = Date.now();

      await db.transact([
        db.tx.ideas[ideaId].update({
          title: title.trim(),
          notes: notes.trim() || null,
          createdAt: now,
          isActive: false,
        }).link({ user: user.id }),
      ]);

      if (shouldScore) {
        router.push(`/ideas/${ideaId}/score`);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error creating idea:", err);
      setError("Failed to create idea. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black p-0 sm:p-4 font-sans antialiased">
      {/* Mobile Screen Container */}
      <div className="relative flex flex-col h-[100dvh] sm:h-[800px] w-full max-w-[400px] bg-[var(--background-light-main)] dark:bg-[var(--background-dark-main)] sm:rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-[var(--background-light-main)] dark:bg-[var(--background-dark-main)] z-10 shrink-0">
          <Link href="/dashboard">
            <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-base font-medium transition-colors">
              Cancel
            </button>
          </Link>
          <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">
            New Idea
          </h1>
          {/* Invisible spacer to balance the flex layout so title remains centered */}
          <div className="w-[52px]"></div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-5 py-2">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Title Field */}
          <div className="mb-6 group">
            <label
              className="block text-slate-700 dark:text-slate-200 text-sm font-bold mb-2"
              htmlFor="idea-title"
            >
              Title
            </label>
            <div className="relative">
              <input
                autoFocus
                className="w-full bg-white dark:bg-[var(--surface-dark)] border border-slate-200 dark:border-slate-700 rounded-lg h-14 px-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[var(--primary-blue)] focus:ring-1 focus:ring-[var(--primary-blue)] outline-none transition-all shadow-sm"
                id="idea-title"
                placeholder="e.g., AI-Powered CRM for Dentists"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                maxLength={255}
              />
            </div>
          </div>

          {/* Note Field */}
          <div className="mb-2">
            <label
              className="block text-slate-700 dark:text-slate-200 text-sm font-bold mb-2"
              htmlFor="idea-note"
            >
              Note
            </label>
            <div className="relative">
              <textarea
                className="w-full bg-white dark:bg-[var(--surface-dark)] border border-slate-200 dark:border-slate-700 rounded-lg min-h-[160px] p-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[var(--primary-blue)] focus:ring-1 focus:ring-[var(--primary-blue)] outline-none transition-all shadow-sm resize-none leading-relaxed"
                id="idea-note"
                placeholder="Briefly describe the problem and solution..."
                value={notes}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_NOTE_LENGTH) {
                    setNotes(e.target.value);
                  }
                }}
                disabled={isSubmitting}
                maxLength={MAX_NOTE_LENGTH}
              />
              {/* Character Counter */}
              <div className="flex justify-end mt-2">
                <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-[#252e38] px-2 py-1 rounded">
                  {notes.length} / {MAX_NOTE_LENGTH}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="bg-[var(--background-light-main)] dark:bg-[var(--background-dark-main)] p-4 pb-6 sm:pb-4 border-t border-slate-200 dark:border-slate-800 shrink-0 z-20">
          <div className="flex gap-3">
            {/* Secondary Button: Save */}
            <button
              onClick={() => handleSave(false)}
              disabled={isSubmitting}
              className="flex-1 h-12 flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-100 dark:hover:bg-[var(--surface-dark)] text-slate-700 dark:text-slate-200 font-bold text-sm transition-colors active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Save"
              )}
            </button>

            {/* Primary Button: Save & Score */}
            <button
              onClick={() => handleSave(true)}
              disabled={isSubmitting}
              className="flex-1 h-12 flex items-center justify-center rounded-lg bg-[var(--primary-blue)] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Save & Score"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
