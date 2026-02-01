# Product Features

```markdown
# Guardrail Features Document

## 1. Core Features

These are the primary functionalities that define the product.

*   **Feature Name:** Idea Guardrail Scoring & Decision
    *   **Description:** Allows users to score their ideas based on a predefined set of criteria and receive a `GO`, `MODIFY`, or `DROP` decision. This is the central function of the app.
    *   **User Value Proposition:** Provides objective feedback on idea viability, preventing wasted time and effort on flawed concepts.
    *   **Acceptance Criteria:**
        *   The system calculates a score based on the user's input to the scoring criteria.
        *   The system returns a `GO`, `MODIFY`, or `DROP` decision based on the score and predefined thresholds.
        *   The scoring logic is deterministic and accurately reflects the defined criteria.
    *   **Priority Level:** High
    *   **Dependencies:** None

*   **Feature Name:** Weekly Focus Lock
    *   **Description:** Enforces a commitment to one idea per week by locking the user into working on a single, active idea.
    *   **User Value Proposition:** Reduces idea switching, improves focus, and increases the likelihood of completing projects.
    *   **Acceptance Criteria:**
        *   The system allows only one idea to be marked as `ACTIVE` at any given time.
        *   The system prevents the user from activating a new idea until the weekly lock expires (Sunday 11:59 PM).
        *   The system displays a lock screen with the active idea's name and the lock expiration time.
    *   **Priority Level:** High
    *   **Dependencies:** Idea Guardrail Scoring & Decision

*   **Feature Name:** Execution Tracker
    *   **Description:** Allows users to track the progress of their active idea each week based on a predefined rubric.
    *   **User Value Proposition:** Provides a structured way to measure progress without self-judgment, leading to more realistic expectations and accountability.
    *   **Acceptance Criteria:**
        *   The system allows users to select a value for each metric in the execution rubric (Build Progress, Exposure, Real Usage, Signal, Revenue Attempt).
        *   The system calculates and displays an "Execution Health" status (🟢 Healthy, 🟡 Stalled, 🔴 Avoidance Detected) based on the rubric values.
        *   The system saves the weekly execution tracking data.
    *   **Priority Level:** High
    *   **Dependencies:** Idea Guardrail Scoring & Decision, Weekly Focus Lock

## 2. User Features

Features that directly benefit end users.

*   **Feature Name:** Add Idea
    *   **Description:** Allows users to create new idea entries with a title and optional note.
    *   **User Value Proposition:** Provides a simple and quick way to capture ideas before they are lost.
    *   **Acceptance Criteria:**
        *   The system allows users to create new idea entries with a title (required) and a note (optional, max 140 characters).
        *   The system saves the new idea entry to the database.
        *   The system redirects the user to the Ideas Dashboard.
    *   **Priority Level:** High
    *   **Dependencies:** None

*   **Feature Name:** Ideas Dashboard
    *   **Description:** Provides an overview of all the user's ideas, their scores, decisions, and execution status.
    *   **User Value Proposition:** Offers a centralized view of all ideas, making it easy to prioritize and track progress.
    *   **Acceptance Criteria:**
        *   The system displays a table with all the user's ideas, including their title, score, decision, and status.
        *   The system highlights the active idea (if any) in a prominent card at the top of the dashboard.
        *   The system provides actions to score (if unscored) or view execution (if GO) for each idea.
    *   **Priority Level:** High
    *   **Dependencies:** Add Idea, Idea Guardrail Scoring & Decision, Execution Tracker

*   **Feature Name:** Guardrail Scoring Screen
    *   **Description:** Allows users to score their ideas based on the defined criteria.
    *   **User Value Proposition:** Facilitates an objective evaluation of ideas, helping users identify potential flaws.
    *   **Acceptance Criteria:**
        *   The system presents the scoring criteria in a clear and concise format (one criterion per screen or stacked cards).
        *   Each criterion includes a short description and a dropdown to select a score from 1 to 5.
        *   The system displays a progress indicator showing the number of completed criteria.
    *   **Priority Level:** High
    *   **Dependencies:** Add Idea

*   **Feature Name:** Decision Result Screen
    *   **Description:** Displays the final score and decision for an idea, along with options for further action.
    *   **User Value Proposition:** Provides clear and actionable feedback on idea viability.
    *   **Acceptance Criteria:**
        *   The system displays the final score and a prominent decision banner (🟢 GO, 🟡 MODIFY, 🔴 DROP).
        *   The system provides appropriate CTAs based on the decision:
            *   GO: Set as Weekly Focus
            *   MODIFY: Archive, Re-score later (locked 7 days)
            *   DROP: Confirm Drop
    *   **Priority Level:** High
    *   **Dependencies:** Guardrail Scoring Screen

*   **Feature Name:** Weekly Review Screen
    *   **Description:** Presents a series of questions to help users close the loop on their weekly execution and make informed decisions about their active idea.
    *   **User Value Proposition:** Encourages reflection and intentional decision-making, leading to more effective use of time and resources.
    *   **Acceptance Criteria:**
        *   The system displays a series of questions related to the active idea's progress.
        *   The system offers one-click decision options: Keep active, Park, Mark as Launched, Abandon.
        *   The system saves the user's decision and updates the idea's status accordingly.
    *   **Priority Level:** Medium
    *   **Dependencies:** Execution Tracker, Weekly Focus Lock

## 3. Admin Features

Administrative and management capabilities (minimal, as per PRD).  These will likely be very basic in the MVP.

*   **Feature Name:** User Management (Basic)
    *   **Description:** Allows administrators to view and manage user accounts (if auth is implemented). This is low priority.
    *   **User Value Proposition:**  Not directly user-facing.  Allows for basic system management.
    *   **Acceptance Criteria:**
        *   Admin can view a list of all users (if auth implemented).
        *   Admin can (optionally) delete or deactivate user accounts (if auth implemented).
    *   **Priority Level:** Low
    *   **Dependencies:**  Authentication (if implemented)

*   **Feature Name:** Data Export (Aggregate)
    *   **Description:** Allows administrators to export aggregate data on idea scores, decisions, and execution progress for analysis.
    *   **User Value Proposition:** Not directly user-facing. Enables analysis of overall system effectiveness and trends.
    *   **Acceptance Criteria:**
        *   Admin can export data in a standard format (e.g., CSV) containing aggregate information on idea scores, decisions, and execution progress.
    *   **Priority Level:** Low
    *   **Dependencies:**  None

## 4. Technical Features

Backend, API, and infrastructure features.

*   **Feature Name:** Scoring Logic Engine
    *   **Description:** The backend component responsible for calculating the idea score and determining the decision based on user input and predefined thresholds.
    *   **User Value Proposition:** Not directly user-facing.  Ensures accurate and consistent scoring.
    *   **Acceptance Criteria:**
        *   The engine accurately calculates the score based on the user's responses to the scoring criteria.
        *   The engine correctly determines the decision (GO, MODIFY, DROP) based on the score and thresholds.
        *   The engine is deterministic, meaning it always produces the same output for the same input.
    *   **Priority Level:** High
    *   **Dependencies:** None

*   **Feature Name:** Database Management
    *   **Description:** The system for storing and retrieving idea data, user data (if auth is implemented), and execution tracking data.
    *   **User Value Proposition:** Not directly user-facing.  Ensures data persistence and reliability.
    *   **Acceptance Criteria:**
        *   The database can store and retrieve idea entries, scoring data, and execution tracking data.
        *   The database is scalable to handle a growing number of users and ideas.
    *   **Priority Level:** High
    *   **Dependencies:** None

*   **Feature Name:** API (Internal)
    *   **Description:** Internal API endpoints for communication between the frontend and backend.
    *   **User Value Proposition:** Not directly user-facing.  Enables modularity and maintainability.
    *   **Acceptance Criteria:**
        *   API endpoints are defined for creating, reading,

---
*Generated by MyContext CLI - AI-powered component generation platform*
*Last updated: 2026-02-01T09:15:22.865Z*
