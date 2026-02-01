/**
 * Guardrail Progress Tracking Engine
 *
 * Tracks weekly execution health across 5 key metrics.
 * Health score: 0-100 (5 metrics × 1-5 points each = 25 max, scaled to 100)
 *
 * Health states:
 * - Healthy: 80-100 (Strong execution)
 * - Stalled: 40-79 (Momentum halted)
 * - Avoidance: 0-39 (Structural failure)
 */

export type ExecutionHealth = "Healthy" | "Stalled" | "Avoidance";

export interface ProgressMetric {
  id: string;
  label: string;
  icon: string;
  options: { value: number; label: string; description?: string }[];
}

export interface WeeklyProgress {
  buildProgress: number; // 1-5
  exposure: number; // 1-5
  realUsage: number; // 1-5
  signal: number; // 1-5
  revenueAttempt: number; // 1-5
}

export interface ExecutionHealthResult {
  health: ExecutionHealth;
  score: number; // 0-100
  message: string;
  strongMetrics: number; // Count of metrics >= 3
}

/**
 * All 5 progress tracking metrics with options
 */
export const PROGRESS_METRICS: ProgressMetric[] = [
  {
    id: "buildProgress",
    label: "Build Progress",
    icon: "construction",
    options: [
      { value: 1, label: "No Code Written", description: "Haven't started building" },
      { value: 2, label: "Wireframes Done (Stuck)", description: "Designed but not coding" },
      { value: 3, label: "Basic MVP Built", description: "Core functionality works" },
      { value: 4, label: "Prototype Complete", description: "Feature complete, needs polish" },
      { value: 5, label: "Feature Complete", description: "Ready for real users" },
    ],
  },
  {
    id: "exposure",
    label: "Exposure",
    icon: "visibility",
    options: [
      { value: 1, label: "No Public Mention", description: "Keeping it secret" },
      { value: 2, label: "Posted on LinkedIn", description: "Shared with network" },
      { value: 3, label: "Shared with Community", description: "Posted in relevant groups" },
      { value: 4, label: "Marketing Campaign", description: "Active promotion" },
      { value: 5, label: "Press Coverage", description: "External media attention" },
    ],
  },
  {
    id: "realUsage",
    label: "Real Usage",
    icon: "gesture",
    options: [
      { value: 1, label: "Zero Users", description: "No one using it" },
      { value: 2, label: "Self-Testing Only", description: "Just you testing" },
      { value: 3, label: "10 Daily Active Users", description: "Small group of early users" },
      { value: 4, label: "100+ Active Users", description: "Growing user base" },
      { value: 5, label: "1000+ Active Users", description: "Significant traction" },
    ],
  },
  {
    id: "signal",
    label: "Signal",
    icon: "trending_up",
    options: [
      { value: 1, label: "Crickets", description: "No response at all" },
      { value: 2, label: "Polite Interest", description: "People are nice but not engaged" },
      { value: 3, label: "Feature Requests", description: "Users asking for more" },
      { value: 4, label: "Positive Feedback Loop", description: "Users actively recommending" },
      { value: 5, label: "Organic Growth", description: "Users recruiting other users" },
    ],
  },
  {
    id: "revenueAttempt",
    label: "Revenue Attempt",
    icon: "payments",
    options: [
      { value: 1, label: "Waitlist Only", description: "Not accepting users yet" },
      { value: 2, label: "Free Beta", description: "Free for early users" },
      { value: 3, label: "Asked for Payment", description: "Attempted to charge" },
      { value: 4, label: "First Revenue", description: "Someone paid once" },
      { value: 5, label: "Recurring Revenue", description: "Multiple paying customers" },
    ],
  },
];

/**
 * Calculate health score from progress metrics
 * Score is 0-100 (max 25 points scaled to 100)
 */
export function calculateHealthScore(progress: WeeklyProgress): number {
  const total =
    progress.buildProgress +
    progress.exposure +
    progress.realUsage +
    progress.signal +
    progress.revenueAttempt;

  // Scale 0-25 to 0-100
  return Math.round((total / 25) * 100);
}

/**
 * Determine execution health based on score
 */
export function getExecutionHealth(score: number): ExecutionHealth {
  if (score >= 80) return "Healthy";
  if (score >= 40) return "Stalled";
  return "Avoidance";
}

/**
 * Count strong metrics (3 or higher)
 */
export function countStrongMetrics(progress: WeeklyProgress): number {
  return Object.values(progress).filter((value) => value >= 3).length;
}

/**
 * Get health message
 */
export function getHealthMessage(
  health: ExecutionHealth,
  strongMetrics: number
): string {
  switch (health) {
    case "Healthy":
      return `Strong signal on ${strongMetrics}/5 metrics`;
    case "Stalled":
      return "Momentum halted. Check velocity.";
    case "Avoidance":
      return "AVOIDANCE DETECTED";
  }
}

/**
 * Get detailed warning for health state
 */
export function getHealthWarning(health: ExecutionHealth): string | null {
  switch (health) {
    case "Healthy":
      return null;
    case "Stalled":
      return "Warning: Execution velocity is low. Consider a pivot or abandoning during Sunday review.";
    case "Avoidance":
      return "STRUCTURAL FAILURE: You are avoiding this idea. Abandoning is a valid strategic choice. Re-evaluate on Sunday.";
  }
}

/**
 * Get health color classes
 */
export function getHealthColorClasses(health: ExecutionHealth): {
  border: string;
  background: string;
  text: string;
  badge: string;
  icon: string;
} {
  switch (health) {
    case "Healthy":
      return {
        border: "border-green-500",
        background: "bg-green-500/10 dark:bg-green-500/10",
        text: "text-green-900 dark:text-green-100",
        badge: "bg-green-500/20 text-green-900 dark:text-green-100",
        icon: "text-green-500",
      };
    case "Stalled":
      return {
        border: "border-amber-500",
        background: "bg-amber-500/10 dark:bg-amber-500/10",
        text: "text-amber-900 dark:text-amber-100",
        badge: "bg-amber-500/20 text-amber-900 dark:text-amber-100",
        icon: "text-amber-500",
      };
    case "Avoidance":
      return {
        border: "border-red-500",
        background: "bg-red-500/10 dark:bg-red-500/10",
        text: "text-red-900 dark:text-red-100",
        badge: "bg-red-500/20 text-red-900 dark:text-red-100",
        icon: "text-red-500",
      };
  }
}

/**
 * Get health icon
 */
export function getHealthIcon(health: ExecutionHealth): string {
  switch (health) {
    case "Healthy":
      return "health_and_safety";
    case "Stalled":
      return "warning";
    case "Avoidance":
      return "error";
  }
}

/**
 * Calculate execution health result
 */
export function calculateExecutionHealth(
  progress: WeeklyProgress
): ExecutionHealthResult {
  const score = calculateHealthScore(progress);
  const health = getExecutionHealth(score);
  const strongMetrics = countStrongMetrics(progress);
  const message = getHealthMessage(health, strongMetrics);

  return {
    health,
    score,
    message,
    strongMetrics,
  };
}

/**
 * Validate progress metrics
 */
export function validateProgressMetrics(
  progress: Partial<WeeklyProgress>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredFields = PROGRESS_METRICS.map((m) => m.id);

  for (const field of requiredFields) {
    const value = progress[field as keyof WeeklyProgress];

    if (value === undefined || value === null) {
      errors.push(`${field} is required`);
      continue;
    }

    if (!Number.isInteger(value) || value < 1 || value > 5) {
      errors.push(`${field} must be an integer between 1 and 5`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get start of current week (Monday 00:00)
 */
export function getCurrentWeekStart(): number {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday = 1
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday.getTime();
}
