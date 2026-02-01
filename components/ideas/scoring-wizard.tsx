"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, id } from "@/lib/instant-client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  X,
  Loader2,
  Users,
  AlertCircle,
  DollarSign,
  Repeat,
  Zap,
  ArrowRight,
  Target,
  Settings,
  Users2,
  Clock,
  LucideIcon
} from "lucide-react";
import Link from "next/link";
import { SCORING_CRITERIA, scoreIdea, type ScoringResponse } from "@/lib/scoring";

// Icon mapping
const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  AlertCircle,
  DollarSign,
  Repeat,
  Zap,
  ArrowRight,
  Target,
  Settings,
  Users2,
  Clock,
};

interface ScoringWizardProps {
  ideaId: string;
}

export function ScoringWizard({ ideaId }: ScoringWizardProps) {
  const router = useRouter();

  const { isLoading, error, data } = db.useQuery({
    ideas: {
      $: {
        where: {
          id: ideaId,
        },
      },
    },
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Partial<ScoringResponse>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const idea = data?.ideas?.[0];
  const currentCriterion = SCORING_CRITERIA[currentStep];
  const progress = ((currentStep + 1) / SCORING_CRITERIA.length) * 100;
  const currentScore = scores[currentCriterion?.id as keyof ScoringResponse];
  const IconComponent = currentCriterion ? ICON_MAP[currentCriterion.icon] : null;

  const canGoNext = currentScore !== undefined;
  const canGoBack = currentStep > 0;
  const isLastStep = currentStep === SCORING_CRITERIA.length - 1;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const handleScoreChange = (value: number) => {
    setScores({
      ...scores,
      [currentCriterion.id]: value,
    });
  };

  const handleNext = () => {
    if (canGoNext && !isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (canGoBack) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!idea) return;

    setIsSubmitting(true);

    try {
      const scoringResponseId = id();
      const now = Date.now();
      const result = scoreIdea(scores as ScoringResponse);

      await db.transact([
        db.tx.scoringResponses[scoringResponseId].update({
          existingParticipants: scores.existingParticipants,
          painIntensity: scores.painIntensity,
          monetizationGap: scores.monetizationGap,
          manualPain: scores.manualPain,
          automationPotential: scores.automationPotential,
          oneWayPayment: scores.oneWayPayment,
          incentiveAlignment: scores.incentiveAlignment,
          operationalSimplicity: scores.operationalSimplicity,
          smallTeamFit: scores.smallTeamFit,
          timeToValue: scores.timeToValue,
          scoredAt: now,
        }).link({ idea: ideaId }),
        db.tx.ideas[ideaId].update({
          guardrailScore: result.totalScore,
          decision: result.decision,
          lastScoredAt: now,
        }),
      ]);

      router.push(`/ideas/${ideaId}/result`);
    } catch (err) {
      console.error("Error saving score:", err);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
        <div className="max-w-md text-center">
          <p className="text-red-600 dark:text-red-400">
            {error?.message || "Idea not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <header className="flex items-center justify-between p-4 shrink-0">
          <Link href="/dashboard">
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </Link>
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Validating Idea
            </span>
            <h2 className="text-sm font-bold leading-tight text-zinc-900 dark:text-white">
              {idea.title}
            </h2>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </header>

        {/* Progress Section */}
        <div className="px-6 py-2 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Progress</span>
            <span className="text-xs font-bold text-blue-500">
              Criterion {currentStep + 1} of {SCORING_CRITERIA.length}
            </span>
          </div>
          <Progress value={progress} className="h-1.5 bg-zinc-200 dark:bg-zinc-800" />
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 min-h-[500px]">
          <div className="w-full max-w-sm flex flex-col gap-6 text-center">
            {/* Icon */}
            {IconComponent && (
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 dark:bg-blue-500/10 text-blue-500 mb-2">
                <IconComponent className="h-8 w-8" />
              </div>
            )}

            {/* Text Content */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {currentCriterion.name}
              </h1>
              <p className="text-lg font-normal leading-relaxed text-zinc-600 dark:text-zinc-300">
                {currentCriterion.description}
              </p>

              {/* Why It Matters Info Box */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 mt-4">
                <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                  💡 {currentCriterion.whyItMatters}
                </p>
              </div>
            </div>

            {/* Range Labels */}
            <div className="mt-4 flex w-full justify-between px-2 text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
              <span>{currentCriterion.rangeLabels.low}</span>
              <span>{currentCriterion.rangeLabels.high}</span>
            </div>

            {/* Radio Button Tiles */}
            <div className="grid grid-cols-5 gap-2 w-full mt-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <label key={score} className="group relative cursor-pointer">
                  <input
                    type="radio"
                    name="score"
                    value={score}
                    checked={currentScore === score}
                    onChange={() => handleScoreChange(score)}
                    className="peer sr-only"
                  />
                  <div className="flex h-14 w-full items-center justify-center rounded bg-zinc-200 dark:bg-zinc-800 text-lg font-semibold text-zinc-500 dark:text-zinc-400 transition-all duration-200 peer-checked:bg-blue-500 peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-blue-500/30 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700">
                    {score}
                  </div>
                </label>
              ))}
            </div>

            {/* Helper Text */}
            <div className="h-12 flex items-start justify-center text-center">
              {currentScore ? (
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 animate-in fade-in slide-in-from-top-1 duration-200">
                  {currentCriterion.helperText[currentScore]}
                </p>
              ) : (
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  Select a score to see details
                </p>
              )}
            </div>
          </div>
        </main>

        {/* Footer Actions */}
        <footer className="p-6 pb-8 shrink-0 flex flex-col gap-3 bg-gradient-to-t from-zinc-50 via-zinc-50 dark:from-zinc-900 dark:via-zinc-900 to-transparent">
          {!isLastStep ? (
            <Button
              onClick={handleNext}
              disabled={!canGoNext}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Question
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canGoNext || isSubmitting}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                "See Results"
              )}
            </Button>
          )}

          {canGoBack && (
            <button
              onClick={handleBack}
              className="w-full h-10 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              Back to previous
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
