"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, id } from "@/lib/instant-client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, MoreVertical } from "lucide-react";
import Link from "next/link";
import {
  PROGRESS_METRICS,
  calculateExecutionHealth,
  getHealthColorClasses,
  getHealthIcon,
  getHealthWarning,
  getCurrentWeekStart,
  type WeeklyProgress,
} from "@/lib/progress-tracking";

interface ProgressTrackerProps {
  ideaId: string;
}

export function ProgressTracker({ ideaId }: ProgressTrackerProps) {
  const router = useRouter();

  const { isLoading, error, data } = db.useQuery({
    ideas: {
      $: {
        where: {
          id: ideaId,
        },
      },
      weeklyExecutions: {},
    },
  });

  const [metrics, setMetrics] = useState<Partial<WeeklyProgress>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const idea = data?.ideas?.[0];
  const currentWeekStart = getCurrentWeekStart();

  // Get current week's execution or most recent
  const currentWeekExecution = idea?.weeklyExecutions?.find(
    (we: any) => we.weekStart === currentWeekStart
  );
  const latestExecution = idea?.weeklyExecutions?.[0];

  useEffect(() => {
    // Initialize metrics from existing data
    if (currentWeekExecution) {
      setMetrics({
        buildProgress: currentWeekExecution.buildProgress,
        exposure: currentWeekExecution.exposure,
        realUsage: currentWeekExecution.realUsage,
        signal: currentWeekExecution.signal,
        revenueAttempt: currentWeekExecution.revenueAttempt,
      });
    } else if (latestExecution) {
      // Pre-fill with last week's data
      setMetrics({
        buildProgress: latestExecution.buildProgress,
        exposure: latestExecution.exposure,
        realUsage: latestExecution.realUsage,
        signal: latestExecution.signal,
        revenueAttempt: latestExecution.revenueAttempt,
      });
    }
  }, [currentWeekExecution, latestExecution]);

  const handleMetricChange = (metricId: string, value: string) => {
    setMetrics({
      ...metrics,
      [metricId]: Number(value),
    });
  };

  const handleSubmit = async () => {
    if (!idea) return;

    // Check all metrics are filled
    const allFilled = PROGRESS_METRICS.every(
      (m) => metrics[m.id as keyof WeeklyProgress] !== undefined
    );

    if (!allFilled) {
      alert("Please fill in all metrics");
      return;
    }

    setIsSubmitting(true);

    try {
      const weeklyExecutionId = currentWeekExecution?.id || id();
      const now = Date.now();
      const progress = metrics as WeeklyProgress;
      const healthResult = calculateExecutionHealth(progress);

      if (currentWeekExecution) {
        // Update existing
        await db.transact([
          db.tx.weeklyExecutions[weeklyExecutionId].update({
            buildProgress: progress.buildProgress,
            exposure: progress.exposure,
            realUsage: progress.realUsage,
            signal: progress.signal,
            revenueAttempt: progress.revenueAttempt,
            executionHealth: healthResult.health,
            updatedAt: now,
          }),
        ]);
      } else {
        // Create new
        await db.transact([
          db.tx.weeklyExecutions[weeklyExecutionId]
            .update({
              weekStart: currentWeekStart,
              buildProgress: progress.buildProgress,
              exposure: progress.exposure,
              realUsage: progress.realUsage,
              signal: progress.signal,
              revenueAttempt: progress.revenueAttempt,
              executionHealth: healthResult.health,
              updatedAt: now,
            })
            .link({ idea: ideaId }),
        ]);
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Error saving progress:", err);
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

  // Calculate health for preview
  const allMetricsFilled = PROGRESS_METRICS.every(
    (m) => metrics[m.id as keyof WeeklyProgress] !== undefined
  );
  const healthResult = allMetricsFilled
    ? calculateExecutionHealth(metrics as WeeklyProgress)
    : null;
  const healthColors = healthResult
    ? getHealthColorClasses(healthResult.health)
    : null;
  const healthIcon = healthResult ? getHealthIcon(healthResult.health) : null;
  const healthWarning = healthResult
    ? getHealthWarning(healthResult.health)
    : null;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <header className="flex items-center justify-between p-4 shrink-0">
          <Link href="/dashboard">
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </button>
          </Link>
          <h1 className="text-lg font-bold">Execution Tracker</h1>
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
            <MoreVertical className="h-6 w-6" />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 pb-40 space-y-6">
          {/* Active Idea Section */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-blue-500 mb-1">
              Active Idea
            </p>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {idea.title}
            </h2>
          </div>

          {/* Current Status - Future Enhancement */}
          <div>
            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2 block">
              Current Status
            </label>
            <Select defaultValue="In Progress">
              <SelectTrigger className="w-full h-12 px-4 rounded-lg bg-zinc-800 dark:bg-zinc-800 text-white border-0 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Execution Health Card */}
          {healthResult && healthColors && healthIcon && (
            <div
              className={`rounded-lg border-l-4 ${healthColors.border} ${healthColors.background} p-4 flex items-start gap-3`}
            >
              <span className={`material-symbols-outlined text-2xl ${healthColors.icon}`}>
                {healthIcon}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-bold text-base ${healthColors.text}`}>
                    Execution Health: {healthResult.health}
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${healthColors.badge}`}
                  >
                    {healthResult.score}/100
                  </span>
                </div>
                <p className={`text-sm ${healthColors.text}`}>
                  {healthResult.message}
                </p>
              </div>
            </div>
          )}

          {/* Rubric Assessment */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Rubric Assessment
              </h3>
              <span className="text-xs font-medium px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                Weekly Focus
              </span>
            </div>

            <div className="space-y-4">
              {PROGRESS_METRICS.map((metric) => {
                const currentValue = metrics[metric.id as keyof WeeklyProgress];

                return (
                  <div key={metric.id}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-zinc-900 dark:text-white">
                        {metric.label}
                      </label>
                      {currentValue && (
                        <span className="text-xs font-bold text-blue-500">
                          Score: {currentValue}/5
                        </span>
                      )}
                    </div>
                    <Select
                      value={currentValue ? String(currentValue) : undefined}
                      onValueChange={(value) => handleMetricChange(metric.id, value)}
                    >
                      <SelectTrigger className="w-full h-12 px-4 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white border-0 focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder={`Select ${metric.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {metric.options.map((option) => (
                          <SelectItem key={option.value} value={String(option.value)}>
                            {option.value} - {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Warning Box */}
          {healthWarning && healthResult?.health === "Stalled" && (
            <div className="rounded-lg border border-amber-500 bg-amber-900/20 dark:bg-amber-900/20 p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-500 text-xl">
                  warning
                </span>
                <p className="text-sm text-amber-900 dark:text-amber-100">
                  {healthWarning}
                </p>
              </div>
            </div>
          )}

          {/* Error Box */}
          {healthWarning && healthResult?.health === "Avoidance" && (
            <div className="rounded-lg border-2 border-red-500 bg-red-900/20 dark:bg-red-900/20 p-4">
              <div className="flex items-start gap-3 mb-3">
                <span className="material-symbols-outlined text-red-500 text-xl">
                  error
                </span>
                <div>
                  <p className="font-bold text-red-900 dark:text-red-100 mb-1">
                    STRUCTURAL FAILURE
                  </p>
                  <p className="text-sm text-red-900 dark:text-red-100">
                    {healthWarning}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer Actions */}
        <footer className="fixed bottom-0 left-0 right-0 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-6 pb-8">
          <div className="mx-auto max-w-md space-y-3">
            {healthResult?.health === "Stalled" ? (
              <Button
                onClick={handleSubmit}
                disabled={!allMetricsFilled || isSubmitting}
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Acknowledge Status"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!allMetricsFilled || isSubmitting}
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-2 text-lg">
                      save
                    </span>
                    Update Snapshot
                  </>
                )}
              </Button>
            )}

            <button className="w-full h-10 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
              Archive Idea
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
