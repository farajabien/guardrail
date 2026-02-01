// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
  ideas: {
    allow: {
      view: "isOwner || isLinkedGuest",
      create: "auth.id != null",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: {
      isOwner: "auth.id != null && auth.id in data.ref('user.id')",
      isLinkedGuest: "auth.id in data.ref('user.linkedGuestUsers.id')",
    },
  },
  scoringResponses: {
    allow: {
      view: "isIdeaOwner || isLinkedGuest",
      create: "isIdeaOwner",
      update: "isIdeaOwner",
      delete: "isIdeaOwner",
    },
    bind: {
      isIdeaOwner: "auth.id != null && auth.id in data.ref('idea.user.id')",
      isLinkedGuest: "auth.id in data.ref('idea.user.linkedGuestUsers.id')",
    },
  },
  weeklyExecutions: {
    allow: {
      view: "isIdeaOwner || isLinkedGuest",
      create: "isIdeaOwner",
      update: "isIdeaOwner",
      delete: "isIdeaOwner",
    },
    bind: {
      isIdeaOwner: "auth.id != null && auth.id in data.ref('idea.user.id')",
      isLinkedGuest: "auth.id in data.ref('idea.user.linkedGuestUsers.id')",
    },
  },
  $users: {
    allow: {
      view: "isMe || isPrimaryUser",
      update: "isMe",
    },
    bind: {
      isMe: "auth.id != null && auth.id == data.id",
      isPrimaryUser: "auth.id != null && auth.id in data.ref('linkedPrimaryUser.id')",
    },
  },
} satisfies InstantRules;

export default rules;
