"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/instant-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { getDecisionColor, getDecisionEmoji, SCORING_CRITERIA, type Decision } from "@/lib/scoring";
import { validateCanActivate, getNextSundayExpiry } from "@/lib/focus-lock";
import { FocusLockModal } from "@/components/focus-lock-modal";

interface ResultContentProps {
  ideaId: string;
}

export function ResultContent({ ideaId }: ResultContentProps) {
  const router = useRouter();
  const [showFocusModal, setShowFocusModal] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [availablePriority, setAvailablePriority] = useState<number>(1);

  const { isLoading, error, data } = db.useQuery({
    ideas: {
      scoringResponse: {},
    },
  });

  const idea = data?.ideas?.find((i: any) => i.id === ideaId);
  const scoringResponse = idea?.scoringResponse;

  const handleActivate = async () => {
    if (!idea || idea.decision !== "GO") return;

    // Validate focus lock
    const validation = validateCanActivate(data?.ideas || []);

    if (!validation.canActivate) {
      alert(validation.reason);
      return;
    }

    // Store the available priority and show modal
    setAvailablePriority(validation.availablePriority || 1);
    setShowFocusModal(true);
  };

  const handleConfirmActivate = async () => {
    if (!idea) return;

    setIsActivating(true);

    try {
      const lockExpiresAt = getNextSundayExpiry();
      const now = Date.now();

      await db.transact([
        db.tx.ideas[ideaId].update({
          isActive: true,
          priority: availablePriority,
          activatedAt: now,
          lockExpiresAt,
          executionStatus: "In Progress",
        }),
      ]);

      setShowFocusModal(false);
      router.push("/dashboard");
    } catch (err) {
      console.error("Error activating idea:", err);
      alert("Failed to activate idea. Please try again.");
      setIsActivating(false);
    }
  };

  const handleArchive = async () => {
    if (!idea) return;

    try {
      await db.transact([
        db.tx.ideas[ideaId].update({
          executionStatus: "Parked",
        }),
      ]);

      router.push("/dashboard");
    } catch (err) {
      console.error("Error archiving idea:", err);
    }
  };

  const handleDrop = async () => {
    if (!confirm("Are you sure you want to drop this idea? This action cannot be undone.")) {
      return;
    }

    if (!idea) return;

    try {
      await db.transact([
        db.tx.ideas[ideaId].update({
          executionStatus: "Abandoned",
        }),
      ]);

      router.push("/dashboard");
    } catch (err) {
      console.error("Error dropping idea:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
      </div>
    );
  }

  if (error || !idea || !scoringResponse) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">
              {error?.message || "Idea or scoring data not found"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const decision = idea.decision as Decision;
  const totalScore = idea.guardrailScore || 0;

  // Map scoring response to criteria
  const criteriaWithScores = SCORING_CRITERIA.map((criterion) => ({
    ...criterion,
    score: scoringResponse[criterion.id as keyof typeof scoringResponse] as number,
  }));

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Idea Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-zinc-900">{idea.title}</h1>
          {idea.notes && (
            <p className="text-zinc-600">{idea.notes}</p>
          )}
        </div>

        {/* Verdict Card */}
        <Card className="border-2">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            {/* Score */}
            <div>
              <p className="text-sm font-medium text-zinc-600 mb-2">
                Total Score
              </p>
              <p className="text-6xl font-bold text-zinc-900">
                {totalScore}
                <span className="text-2xl text-zinc-400"> / 50</span>
              </p>
            </div>

            {/* Decision Badge */}
            <div className="flex justify-center">
              <Badge
                className={`${getDecisionColor(decision)} text-2xl py-3 px-8 text-lg font-bold`}
              >
                {getDecisionEmoji(decision)} {decision}
              </Badge>
            </div>

            {/* Decision Description */}
            <div className="max-w-md mx-auto">
              {decision === "GO" && (
                <p className="text-zinc-700">
                  This idea has strong fundamentals. It scored well on key
                  structural criteria. Consider setting it as your weekly focus.
                </p>
              )}
              {decision === "MODIFY" && (
                <p className="text-zinc-700">
                  This idea has potential but needs adjustments. Review the
                  criteria below to identify weak points and consider pivoting.
                </p>
              )}
              {decision === "DROP" && (
                <p className="text-zinc-700">
                  This idea has significant structural issues. Consider dropping
                  it or fundamentally rethinking the approach before investing time.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scorecard Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Scorecard Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criteriaWithScores.map((criterion) => (
                <div
                  key={criterion.id}
                  className="flex items-center justify-between p-3 rounded-md bg-zinc-50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-zinc-900">{criterion.name}</p>
                    <p className="text-sm text-zinc-600">{criterion.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        criterion.score >= 4
                          ? "bg-green-100 text-green-700"
                          : criterion.score === 3
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {criterion.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {decision === "GO" && (
              <>
                <Button
                  onClick={handleActivate}
                  className="w-full"
                  size="lg"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Set as Weekly Focus
                </Button>
                <p className="text-sm text-zinc-600 text-center">
                  Commit to working on this idea for one week. You won't be able
                  to activate another idea until Sunday 11:59 PM.
                </p>
              </>
            )}

            {decision === "MODIFY" && (
              <div className="space-y-3">
                <Button
                  onClick={handleArchive}
                  className="w-full"
                  variant="outline"
                >
                  Archive for Later
                </Button>
                <p className="text-sm text-zinc-600 text-center">
                  Save this idea and revisit it after making adjustments.
                  You can re-score it in 7 days.
                </p>
              </div>
            )}

            {decision === "DROP" && (
              <div className="space-y-3">
                <Button
                  onClick={handleDrop}
                  className="w-full"
                  variant="destructive"
                >
                  Confirm Drop
                </Button>
                <p className="text-sm text-zinc-600 text-center">
                  Mark this idea as abandoned. This helps you avoid wasting time
                  on structurally flawed concepts.
                </p>
              </div>
            )}

            <Link href="/dashboard" className="block">
              <Button variant="ghost" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Focus Lock Modal */}
      <FocusLockModal
        open={showFocusModal}
        onClose={() => setShowFocusModal(false)}
        onConfirm={handleConfirmActivate}
        ideaTitle={idea.title}
        priority={availablePriority}
        isLoading={isActivating}
      />
    </div>
  );
}
