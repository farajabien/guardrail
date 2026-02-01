/**
 * Focus Lock Utilities
 *
 * Enforces weekly focus commitment:
 * - Up to TWO ACTIVE ideas at a time (primary + secondary)
 * - Lock expires Sunday at 11:59 PM
 * - Cannot activate new ideas during lock period when at capacity
 */

/**
 * Calculate next Sunday at 11:59 PM
 */
export function getNextSundayExpiry(): number {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday

  // If today is Sunday, get next Sunday (7 days)
  // Otherwise, calculate days until Sunday
  const daysUntilSunday = currentDay === 0 ? 7 : 7 - currentDay;

  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(23, 59, 59, 999);

  return nextSunday.getTime();
}

/**
 * Check if focus lock is still active
 */
export function isLockActive(lockExpiresAt: number): boolean {
  return Date.now() < lockExpiresAt;
}

/**
 * Get time remaining until lock expires
 */
export function getLockTimeRemaining(lockExpiresAt: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const now = Date.now();
  const remaining = lockExpiresAt - now;

  if (remaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

/**
 * Format lock expiry for display
 */
export function formatLockExpiry(lockExpiresAt: number): string {
  const date = new Date(lockExpiresAt);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
}

/**
 * Format countdown for display (e.g., "3 days, 4 hours")
 */
export function formatCountdown(lockExpiresAt: number): string {
  const { days, hours, minutes, isExpired } = getLockTimeRemaining(lockExpiresAt);

  if (isExpired) return "Expired";

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  }

  if (hours > 0 || days > 0) {
    parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  }

  if (days === 0) {
    parts.push(`${minutes} min${minutes !== 1 ? "s" : ""}`);
  }

  return parts.join(", ");
}

/**
 * Validate that an idea can be activated
 */
export interface FocusLockValidation {
  canActivate: boolean;
  availablePriority?: number; // 1 = primary, 2 = secondary
  reason?: string;
  activeIdeas?: Array<{
    id: string;
    title: string;
    priority: number;
    lockExpiresAt: number;
  }>;
}

export function validateCanActivate(
  allIdeas: Array<{
    id: string;
    title: string;
    isActive: boolean;
    priority?: number;
    lockExpiresAt?: number;
  }>
): FocusLockValidation {
  // Find all currently active ideas with active locks
  const activeIdeas = allIdeas.filter(
    (idea) =>
      idea.isActive &&
      idea.lockExpiresAt &&
      isLockActive(idea.lockExpiresAt)
  );

  // No active ideas - can activate as primary
  if (activeIdeas.length === 0) {
    return { canActivate: true, availablePriority: 1 };
  }

  // 1 active idea - can activate as secondary
  if (activeIdeas.length === 1) {
    return { canActivate: true, availablePriority: 2 };
  }

  // 2 active ideas - at capacity
  if (activeIdeas.length >= 2) {
    const sortedIdeas = activeIdeas.sort((a, b) => (a.priority || 99) - (b.priority || 99));
    const primaryIdea = sortedIdeas[0];
    const secondaryIdea = sortedIdeas[1];

    return {
      canActivate: false,
      reason: `You have 2 active ideas this week: "${primaryIdea.title}" (primary) and "${secondaryIdea.title}" (secondary). Wait until ${formatLockExpiry(
        primaryIdea.lockExpiresAt!
      )} to activate a new one.`,
      activeIdeas: sortedIdeas.map((idea) => ({
        id: idea.id,
        title: idea.title,
        priority: idea.priority || 1,
        lockExpiresAt: idea.lockExpiresAt!,
      })),
    };
  }

  // Default fallback - can activate as primary
  return { canActivate: true, availablePriority: 1 };
}

/**
 * Get current week start timestamp (Monday at 00:00)
 */
export function getCurrentWeekStart(): number {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday

  // Calculate days since Monday
  const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;

  const monday = new Date(now);
  monday.setDate(now.getDate() - daysSinceMonday);
  monday.setHours(0, 0, 0, 0);

  return monday.getTime();
}
