"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/instant-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Copy, Check, Loader2 } from "lucide-react";

interface BrainstormPromptDialogProps {
  trigger?: React.ReactNode;
}

const BRAINSTORM_PROMPT = `I have a new idea I'd like to validate. Can you help me think through it carefully?

I'll answer 10 questions about my idea. After we discuss, please provide:
1. A clean, concise title (5-10 words max)
2. A focused summary (140 characters max, like a tweet)
3. Key insights from our discussion
4. Scoring hints for these 10 criteria (rate 1-5 for each):
   - Problem clarity
   - Solution clarity
   - Unfair advantage
   - Market timing
   - Resource availability
   - Execution clarity
   - Personal fit
   - Motivation alignment
   - Risk tolerance
   - Commitment readiness

Let's start with these questions:

**About the Problem:**
1. What specific problem are you solving? Who experiences this problem most acutely?
2. How do people currently solve this problem? What's inadequate about current solutions?

**About Your Solution:**
3. What's your proposed solution in one sentence?
4. What makes your approach different or better?

**About Feasibility:**
5. What unique skills, connections, or resources do you have that make you well-positioned for this?
6. What's the first concrete step you could take this week?

**About Market & Timing:**
7. Why is now the right time for this idea? What's changed recently?
8. Who would be your first 10 customers/users?

**About You:**
9. Why does this problem matter to you personally?
10. On a scale of 1-10, how excited are you to work on this for the next 6 months?

After our discussion, please format your response as:

---
**Title:** [Clean, focused title]

**Summary:** [140-char summary]

**Key Insights:**
- [Insight 1]
- [Insight 2]
- [Insight 3]

**Scoring Hints:**
- Problem clarity: [1-5] - [Brief reasoning]
- Solution clarity: [1-5] - [Brief reasoning]
- Unfair advantage: [1-5] - [Brief reasoning]
- Market timing: [1-5] - [Brief reasoning]
- Resource availability: [1-5] - [Brief reasoning]
- Execution clarity: [1-5] - [Brief reasoning]
- Personal fit: [1-5] - [Brief reasoning]
- Motivation alignment: [1-5] - [Brief reasoning]
- Risk tolerance: [1-5] - [Brief reasoning]
- Commitment readiness: [1-5] - [Brief reasoning]
---`;

export function BrainstormPromptDialog({ trigger }: BrainstormPromptDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaNotes, setIdeaNotes] = useState("");
  const [conversationLink, setConversationLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(BRAINSTORM_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSaveIdea = async () => {
    if (!ideaTitle.trim()) {
      alert("Please provide an idea title");
      return;
    }

    setIsSaving(true);

    try {
      const now = Date.now();
      const ideaId = db.id();

      const transactions: any[] = [
        db.tx.ideas[ideaId].update({
          title: ideaTitle,
          notes: ideaNotes || undefined,
          createdAt: now,
        }),
      ];

      // If conversation link provided, create a progress log with it
      if (conversationLink.trim()) {
        const progressLogId = db.id();
        transactions.push(
          db.tx.progressLogs[progressLogId].update({
            date: now,
            notes: "AI Brainstorm Session",
            resources: [
              {
                title: "Brainstorm Conversation",
                url: conversationLink,
                type: "doc",
              },
            ],
          }),
          db.tx.ideas[ideaId].link({
            progressLogs: progressLogId,
          })
        );
      }

      await db.transact(transactions);

      // Redirect to scoring page
      router.push(`/ideas/${ideaId}/score`);
    } catch (err) {
      console.error("Error saving idea:", err);
      alert("Failed to save idea. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Lightbulb className="mr-2 h-4 w-4" />
            AI Brainstorm
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            AI Brainstorm Assistant
          </DialogTitle>
          <DialogDescription>
            Copy this prompt to Claude or ChatGPT to validate your idea before scoring
          </DialogDescription>
        </DialogHeader>

        {!showResultForm ? (
          <>
            <div className="space-y-4 py-4">
              {/* Copyable Prompt */}
              <div className="rounded-md border bg-zinc-50 p-4 relative">
                <div className="absolute top-2 right-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyPrompt}
                    className="h-8"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <pre className="text-xs whitespace-pre-wrap font-mono text-zinc-700 pr-24">
                  {BRAINSTORM_PROMPT}
                </pre>
              </div>

              {/* Instructions */}
              <div className="rounded-md bg-blue-50 border border-blue-200 p-4 space-y-2">
                <p className="text-sm font-medium text-blue-900">
                  How to use this prompt:
                </p>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Copy the prompt above</li>
                  <li>Paste it into Claude.ai or ChatGPT</li>
                  <li>Have a thoughtful conversation about your idea</li>
                  <li>Get the structured output with title, summary, and scoring hints</li>
                  <li>Come back here and paste the results</li>
                </ol>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowResultForm(true)}>
                I've Finished Brainstorming
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="idea-title">
                  Idea Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="idea-title"
                  placeholder="From AI output: Title"
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idea-notes">
                  Summary (140 characters max)
                </Label>
                <Textarea
                  id="idea-notes"
                  placeholder="From AI output: Summary"
                  value={ideaNotes}
                  onChange={(e) => setIdeaNotes(e.target.value)}
                  maxLength={140}
                  rows={3}
                />
                <p className="text-xs text-zinc-500">
                  {ideaNotes.length}/140 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conversation-link">
                  Conversation Link (Optional)
                </Label>
                <Input
                  id="conversation-link"
                  placeholder="https://claude.ai/chat/... or ChatGPT share link"
                  value={conversationLink}
                  onChange={(e) => setConversationLink(e.target.value)}
                />
                <p className="text-xs text-zinc-500">
                  Save your brainstorm conversation as a resource
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowResultForm(false)}
                disabled={isSaving}
              >
                Back
              </Button>
              <Button onClick={handleSaveIdea} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save & Score Idea"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
