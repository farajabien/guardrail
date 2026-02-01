// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      type: i.string().optional(),
    }),
    ideas: i.entity({
      title: i.string(),
      notes: i.string().optional(),
      createdAt: i.number(),
      lastScoredAt: i.number().optional(),
      guardrailScore: i.number().optional(), // 0-50
      decision: i.string().optional(), // GO, MODIFY, DROP
      executionStatus: i.string().optional(), // Planned, In Progress, Launched, Validated, Parked, Abandoned
      isActive: i.boolean(), // Weekly focus lock
      priority: i.number().optional(), // 1 = primary, 2 = secondary
      activatedAt: i.number().optional(),
      lockExpiresAt: i.number().optional(), // Sunday 11:59 PM
      expectedLinks: i.number().optional(), // Target for links expected (default 5)
    }),
    progressLogs: i.entity({
      message: i.string(),
      loggedAt: i.number(),
      resources: i.json(), // Array of { type: 'link'|'image'|'doc', title: string, url: string }
      linkCount: i.number().optional(),
    }),
    scoringResponses: i.entity({
      // Store individual criterion scores (1-5 each)
      existingParticipants: i.number().optional(),
      painIntensity: i.number().optional(),
      monetizationGap: i.number().optional(),
      manualPain: i.number().optional(),
      automationPotential: i.number().optional(),
      oneWayPayment: i.number().optional(),
      incentiveAlignment: i.number().optional(),
      operationalSimplicity: i.number().optional(),
      smallTeamFit: i.number().optional(),
      timeToValue: i.number().optional(),
      scoredAt: i.number(),
    }),
    weeklyExecutions: i.entity({
      weekStart: i.number(), // Timestamp for week start
      buildProgress: i.number().optional(), // 1-5
      exposure: i.number().optional(), // 1-5
      realUsage: i.number().optional(), // 1-5
      signal: i.number().optional(), // 1-5
      revenueAttempt: i.number().optional(), // 1-5
      executionHealth: i.string().optional(), // Healthy, Stalled, Avoidance
      updatedAt: i.number(),
    }),
  },
  links: {
    $usersLinkedPrimaryUser: {
      forward: {
        on: "$users",
        has: "one",
        label: "linkedPrimaryUser",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "linkedGuestUsers",
      },
    },
    userIdeas: {
      forward: {
        on: "$users",
        has: "many",
        label: "ideas",
      },
      reverse: {
        on: "ideas",
        has: "one",
        label: "user",
      },
    },
    ideaScoringResponse: {
      forward: {
        on: "ideas",
        has: "one",
        label: "scoringResponse",
        onDelete: "cascade",
      },
      reverse: {
        on: "scoringResponses",
        has: "one",
        label: "idea",
      },
    },
    ideaWeeklyExecutions: {
      forward: {
        on: "ideas",
        has: "many",
        label: "weeklyExecutions",
      },
      reverse: {
        on: "weeklyExecutions",
        has: "one",
        label: "idea",
      },
    },
    ideaProgressLogs: {
      forward: {
        on: "ideas",
        has: "many",
        label: "progressLogs",
      },
      reverse: {
        on: "progressLogs",
        has: "one",
        label: "idea",
      },
    },
  },
  rooms: {},
});

// This helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
