/**
 * Guardrail Scoring Engine
 *
 * Deterministic scoring system for idea validation.
 * Total score: 0-50 (10 criteria × 1-5 points each)
 *
 * Decision thresholds:
 * - GO: 40-50 points
 * - MODIFY: 30-39 points
 * - DROP: 0-29 points
 */

export type Decision = "GO" | "MODIFY" | "DROP";

export interface ScoringCriterion {
  id: string;
  name: string;
  description: string;
  whyItMatters: string;
  icon: string; // lucide-react icon name
  rangeLabels: {
    low: string;
    high: string;
  };
  score: number; // 1-5
}

export interface ScoringResponse {
  existingParticipants: number;
  painIntensity: number;
  monetizationGap: number;
  manualPain: number;
  automationPotential: number;
  oneWayPayment: number;
  incentiveAlignment: number;
  operationalSimplicity: number;
  smallTeamFit: number;
  timeToValue: number;
}

export interface ScoringResult {
  totalScore: number;
  decision: Decision;
  criteriaScores: ScoringCriterion[];
}

/**
 * All 10 scoring criteria with descriptions, icons, and range labels
 */
export const SCORING_CRITERIA: Omit<ScoringCriterion, "score">[] = [
  {
    id: "existingParticipants",
    name: "Existing Participants",
    description: "Are people already doing this activity without your product?",
    icon: "Users",
    rangeLabels: { low: "None", high: "Very Active" },
    whyItMatters:
      "If the behavior doesn't exist yet, you're trying to create demand instead of capturing it. Creating demand is much harder and riskier.",
  },
  {
    id: "painIntensity",
    name: "Clear Pain",
    description: "Is there a genuine, felt pain or frustration with the current way?",
    icon: "AlertCircle",
    rangeLabels: { low: "Mild", high: "Severe" },
    whyItMatters:
      "People don't change behavior for marginal improvements. They need to feel real friction or dissatisfaction to adopt something new.",
  },
  {
    id: "monetizationGap",
    name: "Monetization Gap",
    description: "Are users currently paying for a solution, or would they clearly benefit from one?",
    icon: "DollarSign",
    rangeLabels: { low: "No Spend", high: "High Spend" },
    whyItMatters:
      "If users aren't spending money on this problem today, it may not be valuable enough to pay for, or they may expect it for free.",
  },
  {
    id: "manualPain",
    name: "Manual Pain",
    description: "Are users doing something repetitive, time-consuming, or annoying manually?",
    icon: "Repeat",
    rangeLabels: { low: "Automated", high: "Very Manual" },
    whyItMatters:
      "Repetitive tasks create clear before/after value. If the workflow is already smooth, your product may not feel necessary.",
  },
  {
    id: "automationPotential",
    name: "Automation Opportunity",
    description: "Can software meaningfully automate, simplify, or eliminate steps?",
    icon: "Zap",
    rangeLabels: { low: "Low", high: "High" },
    whyItMatters:
      "If the solution still requires significant manual work, users won't see it as a real improvement. True automation creates leverage.",
  },
  {
    id: "oneWayPayment",
    name: "One-Way Payment Flow",
    description: "Does money only flow from customer → product (not product → customer)?",
    icon: "ArrowRight",
    rangeLabels: { low: "Two-Way", high: "One-Way" },
    whyItMatters:
      "Two-way payments introduce escrow, compliance, and trust issues. One-way flows are simpler, safer, and easier to scale.",
  },
  {
    id: "incentiveAlignment",
    name: "Incentive Alignment",
    description: "Do both the user and the platform benefit when the user succeeds?",
    icon: "Target",
    rangeLabels: { low: "Misaligned", high: "Aligned" },
    whyItMatters:
      "If your revenue depends on user failure or creates misaligned incentives, trust breaks down and retention suffers.",
  },
  {
    id: "operationalSimplicity",
    name: "Operational Simplicity",
    description: "Can this run without human intervention, moderation, or manual review?",
    icon: "Settings",
    rangeLabels: { low: "Complex", high: "Simple" },
    whyItMatters:
      "High-touch operations don't scale. If you need humans in the loop for every transaction, costs grow linearly with users.",
  },
  {
    id: "smallTeamFit",
    name: "Small Team Fit",
    description: "Can 2-3 people realistically build and run this to profitability?",
    icon: "Users2",
    rangeLabels: { low: "Large Team", high: "Small Team" },
    whyItMatters:
      "Large teams introduce coordination overhead, burn rate, and funding dependency. Small-team products are more resilient.",
  },
  {
    id: "timeToValue",
    name: "Time to Value",
    description: "Can users experience meaningful value in their first session?",
    icon: "Clock",
    rangeLabels: { low: "Slow", high: "Immediate" },
    whyItMatters:
      "Long onboarding or delayed value creates drop-off. Users should feel the benefit immediately, or they'll abandon the product.",
  },
];

/**
 * Calculate total score from scoring responses
 */
export function calculateTotalScore(responses: ScoringResponse): number {
  return (
    responses.existingParticipants +
    responses.painIntensity +
    responses.monetizationGap +
    responses.manualPain +
    responses.automationPotential +
    responses.oneWayPayment +
    responses.incentiveAlignment +
    responses.operationalSimplicity +
    responses.smallTeamFit +
    responses.timeToValue
  );
}

/**
 * Determine decision based on total score
 */
export function getDecision(totalScore: number): Decision {
  if (totalScore >= 40) return "GO";
  if (totalScore >= 30) return "MODIFY";
  return "DROP";
}

/**
 * Score an idea based on responses
 */
export function scoreIdea(responses: ScoringResponse): ScoringResult {
  const totalScore = calculateTotalScore(responses);
  const decision = getDecision(totalScore);

  const criteriaScores: ScoringCriterion[] = SCORING_CRITERIA.map(
    (criterion) => ({
      ...criterion,
      score: responses[criterion.id as keyof ScoringResponse],
    })
  );

  return {
    totalScore,
    decision,
    criteriaScores,
  };
}

/**
 * Validate that all scoring responses are within valid range (1-5)
 */
export function validateScoringResponses(
  responses: Partial<ScoringResponse>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredFields = SCORING_CRITERIA.map((c) => c.id);

  for (const field of requiredFields) {
    const value = responses[field as keyof ScoringResponse];

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
 * Get color class for decision badge
 */
export function getDecisionColor(decision: Decision): string {
  switch (decision) {
    case "GO":
      return "bg-green-500 text-white";
    case "MODIFY":
      return "bg-amber-500 text-white";
    case "DROP":
      return "bg-red-500 text-white";
  }
}

/**
 * Get emoji for decision
 */
export function getDecisionEmoji(decision: Decision): string {
  switch (decision) {
    case "GO":
      return "🟢";
    case "MODIFY":
      return "🟡";
    case "DROP":
      return "🔴";
  }
}
