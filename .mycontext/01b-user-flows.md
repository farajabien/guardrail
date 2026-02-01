# User Flows

Okay, here's a detailed user flow documentation for Guardrail, based on the provided PRD and design specifications.  I'll cover the requested areas with clear steps and flow diagrams (using text-based representations).

# Guardrail User Flow Documentation

## 1. Primary User Journeys

### 1.1. New User - Create and Score First Idea

**Flow Name:** New User Onboarding & Idea Scoring

**Description:** A new user lands on the application, creates an idea, scores it using the Guardrail scoring system, and receives a decision.

**Steps:**

1.  **User Action:** Lands on the application (Ideas Dashboard).
2.  **System Response:** Displays empty state with "Add Idea" CTA.
3.  **User Action:** Clicks "Add Idea".
4.  **System Response:** Displays "Add Idea Screen".
5.  **User Action:** Enters "Idea Title" and optional "Note".
6.  **User Action:** Clicks "Save & Score".
7.  **System Response:** Displays first Guardrail Scoring Screen (e.g., "Existing Participants").
8.  **User Action:** Selects a score (1-5).
9.  **System Response:** Displays next Guardrail Scoring Screen (e.g., "Clear Pain").  Repeats steps 8 and 9 until all 10 criteria are scored.
10. **System Response:** Calculates total score and displays "Decision Result Screen" (GO, MODIFY, or DROP).
11. **User Action (If GO):** Clicks "Set as Weekly Focus".
12. **System Response:** Displays "Focus Lock Screen" with commitment rules.
13. **User Action:** Clicks "I Understand".
14. **System Response:** Returns to "Ideas Dashboard" with the idea marked as "ACTIVE" and a countdown timer.
15. **User Action (If MODIFY):** Clicks "Archive".
16. **System Response:** Archives the idea, returns to "Ideas Dashboard"
17. **User Action (If DROP):** Clicks "Confirm Drop".
18. **System Response:** Drops the idea, returns to "Ideas Dashboard"

**Decision Points:** The decision (GO, MODIFY, DROP) is based on the total score.  User choices on the Decision Result Screen determine the next action.

**Error States:**

*   Missing "Idea Title": Displays an error message on the "Add Idea Screen" requiring the title.
*   Invalid Score: The dropdown only allows valid scores (1-5) so no invalid score error is possible.

**Success Criteria:** User successfully creates, scores, and decides on an idea, setting it as the weekly focus if "GO".

**Flow Diagram:**

```
[Landing Page] --> [Add Idea Screen] --> [Guardrail Scoring (10 steps)] --> [Decision Result Screen]
[Decision Result Screen] --(GO)--> [Focus Lock Screen] --> [Ideas Dashboard (ACTIVE)]
[Decision Result Screen] --(MODIFY)--> [Ideas Dashboard (ARCHIVED)]
[Decision Result Screen] --(DROP)--> [Ideas Dashboard (DROPPED)]
```

### 1.2. Returning User - Track Execution Progress

**Flow Name:** Execution Tracking

**Description:** A returning user with an active "GO" idea tracks their execution progress using the weekly rubric.

**Steps:**

1.  **User Action:** Lands on the application (Ideas Dashboard).
2.  **System Response:** Displays "Ideas Dashboard" with active idea and countdown timer.
3.  **User Action:** Clicks "View Execution" on the active idea card.
4.  **System Response:** Displays "Execution Tracker Screen".
5.  **User Action:** Selects "Execution Status" from dropdown (e.g., "In Progress").
6.  **User Action:** Selects options for each metric in the "Weekly Execution Rubric" (Build Progress, Exposure, Real Usage, Signal, Revenue Attempt).
7.  **System Response:** Calculates "Execution Health" based on the rubric selections (🟢 Healthy, 🟡 Stalled, 🔴 Avoidance Detected).
8.  **System Response:** Returns to "Execution Tracker Screen" with updated "Execution Health".
9.  **User Action:** Returns to the "Ideas Dashboard".

**Decision Points:** The "Execution Health" is determined by the selections in the rubric.

**Error States:** No error states as the fields use dropdowns.

**Success Criteria:** User successfully updates the execution status and rubric, receiving an "Execution Health" assessment.

**Flow Diagram:**

```
[Ideas Dashboard (ACTIVE)] --> [Execution Tracker Screen] --> [Execution Tracker Screen (Updated)] --> [Ideas Dashboard (ACTIVE)]
```

### 1.3. Weekly Review Flow

**Flow Name:** Weekly Review

**Description:** The user interacts with the app on Sunday to review the past week's progress and make a decision on the current active idea.

**Steps:**

1. It is Sunday, and the Focus Lock expires.
2.  **User Action:** Lands on the application (Ideas Dashboard).
3.  **System Response:** Displays "Weekly Review Screen".
4.  **System Response:** Presents options: Keep this active next week? Park it? Mark as Launched? Abandon intentionally?
5.  **User Action (Keep Active):** Clicks "Keep this active next week?".
6.  **System Response:** The active idea remains active and the Focus Lock resets. Return to "Ideas Dashboard".
7.  **User Action (Park it):** Clicks "Park it?".
8.  **System Response:** The active idea is parked. Return to "Ideas Dashboard".
9.  **User Action (Mark as Launched):** Clicks "Mark as Launched?".
10.  **System Response:** The active idea is marked as launched. Return to "Ideas Dashboard".
11.  **User Action (Abandon intentionally):** Clicks "Abandon intentionally?".
12.  **System Response:** The active idea is abandoned. Return to "Ideas Dashboard".

**Decision Points:** The user is prompted to make a single decision on the active idea.

**Error States:** No error states as the fields use dropdowns.

**Success Criteria:** User successfully completes the weekly review and makes a decision on the active idea.

**Flow Diagram:**

```
[Ideas Dashboard (ACTIVE)] --> [Weekly Review Screen]
[Weekly Review Screen] --(Keep Active)--> [Ideas Dashboard (ACTIVE)]
[Weekly Review Screen] --(Park It)--> [Ideas Dashboard (PARKED)]
[Weekly Review Screen] --(Mark as Launched)--> [Ideas Dashboard (LAUNCHED)]
[Weekly Review Screen] --(Abandon Intentionally)--> [Ideas Dashboard (ABANDONED)]
```

## 2. Authentication Flows

**Note:** The PRD states that auth is optional in v1.  These flows are included for completeness, assuming auth is implemented.

### 2.1. Login

**Flow Name:** User Login

**Description:** User logs in to the application with existing credentials.

**Steps:**

1.  **User Action:** Clicks "Login" link on the landing page.
2.  **System Response:** Displays Login Screen (email/password).
3.  **User Action:** Enters email and password.
4.  **User Action:** Clicks "Login" button.
5.  **System Response (Success):** Authenticates user and redirects to the "Ideas Dashboard".
6.  **System Response (Failure):** Displays error message (e.g., "Invalid email or password") on the Login Screen.

**Error States:**

*   Invalid email or password.
*   Account not found.
*   Network error.

**Success Criteria:** User successfully logs in and is redirected to the "Ideas Dashboard".

**Flow Diagram:**

```
[Landing Page] --> [Login Screen]
[Login Screen] --(Success)--> [Ideas Dashboard]
[Login Screen] --(Failure)--> [Login Screen (Error Message)]
```

### 2.2. Signup

**Flow Name:** User Signup

**Description:** New user creates an account.

**Steps:**

1.  **User Action:** Clicks "Signup" link on the landing page.
2.  **System Response:** Displays Signup Screen (email/password/confirm password).
3.  **User Action:** Enters email, password, and confirmation password.
4.  **User Action:** Clicks "Signup" button.
5.  **System Response (Success):** Creates account, logs user in, and redirects to "Ideas Dashboard".
6.  **System Response (Failure):** Displays error message on the Signup Screen.

**Error States:**

*   Email already exists.
*   Passwords do not match.
*   Invalid email format.
*   Password too weak.

**Success Criteria:** User successfully creates an account, is logged in, and redirected to the "Ideas Dashboard".

**Flow Diagram:**

```
[Landing Page] --> [Signup Screen]
[Signup Screen] --(Success)--> [Ideas Dashboard]
[Signup Screen] --(Failure)--> [Signup Screen (Error Message)]
```



---
*Generated by MyContext CLI - AI-powered component generation platform*
*Last updated: 2026-02-01T09:15:34.643Z*
