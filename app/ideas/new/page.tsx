"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, id } from "@/lib/instant-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const MAX_NOTE_LENGTH = 140;

export default function NewIdeaPage() {
  const router = useRouter();
  const { user } = db.useAuth();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const remainingChars = MAX_NOTE_LENGTH - notes.length;

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

      // Redirect to score page or dashboard
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
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Back Button */}
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Main Card */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Idea</CardTitle>
            <CardDescription>
              Capture your idea quickly. You can score it now or later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Idea Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Tailor Your CV, Skika, BAO!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                maxLength={255}
                required
              />
              <p className="text-xs text-zinc-500">
                Give your idea a clear, memorable name
              </p>
            </div>

            {/* Notes Textarea */}
            <div className="space-y-2">
              <Label htmlFor="notes">
                Notes <span className="text-zinc-400">(optional)</span>
              </Label>
              <Textarea
                id="notes"
                placeholder="Quick notes about your idea (max 140 characters)"
                value={notes}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_NOTE_LENGTH) {
                    setNotes(e.target.value);
                  }
                }}
                disabled={isSubmitting}
                maxLength={MAX_NOTE_LENGTH}
                rows={3}
              />
              <div className="flex justify-between text-xs">
                <p className="text-zinc-500">Keep it brief and actionable</p>
                <p
                  className={
                    remainingChars < 20
                      ? "text-amber-600 font-medium"
                      : "text-zinc-400"
                  }
                >
                  {remainingChars} characters remaining
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button
                onClick={() => handleSave(false)}
                disabled={isSubmitting}
                variant="outline"
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                onClick={() => handleSave(true)}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save & Score"
                )}
              </Button>
            </div>

            <div className="rounded-md bg-zinc-100 p-4 text-sm text-zinc-700">
              <p className="font-medium mb-1">What happens next?</p>
              <ul className="space-y-1 text-zinc-600">
                <li>
                  <strong>Save:</strong> Returns to dashboard. You can score it
                  later.
                </li>
                <li>
                  <strong>Save & Score:</strong> Takes you straight to the
                  Guardrail scoring wizard.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
