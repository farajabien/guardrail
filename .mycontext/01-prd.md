📘 IDEA GUARD — FULL PRD + DESIGN SPEC

PRODUCT SUMMARY
Product Name

IdeaGuard (working name)

One-Line Description

A deterministic, AI-assisted startup idea validator that tells you GO / MODIFY / REJECT before you waste time building.

Core Belief

Most startup ideas don’t fail because of execution — they fail because of structural flaws that were visible from day one.

IdeaGuard exists to surface those flaws early.

NON-NEGOTIABLE PRODUCT CONSTRAINTS (GUARDRAILS)
These are product-level laws, not preferences.

Single Core Feature

Validate ideas → return verdict

No feature expansion unless it directly improves this flow

One-Way Payments Only

User → IdeaGuard

No payouts, no escrow, no custody, no revenue sharing

Zero Regulatory Dependency

Must work without licenses

Must not trigger gaming, gambling, financial custody, or KYC

Low Ops by Design

No human review

No moderation queues

No onboarding calls

AI as the Only Variable Cost

Everything else deterministic, cached, or static

If any future feature breaks one of these, it is automatically rejected.

TARGET USER
Primary User

Solo founders

Indie hackers

Builders validating side projects

Early startup founders pre-MVP

User Mindset

Time-poor

Skeptical

Wants clarity, not hype

Comfortable being told “this is a bad idea”

PROBLEM STATEMENT
Founders repeatedly build ideas that:

require licenses they didn’t anticipate (e.g. gaming)

require two-sided payments

rely on inactive users

require too many features to deliver value

don’t scale with a small team

These failures are predictable, but no simple tool enforces these checks upfront.

SOLUTION OVERVIEW
IdeaGuard runs ideas through a strict, experience-based scorecard and produces:

A verdict (GO / MODIFY / REJECT)

Clear failure reasons

Optional pivot suggestions

The system is:

deterministic first

AI second (explanations only)

CORE FEATURE (ONLY FEATURE)
Idea Validation Engine

Input

Idea description

Guided answers to guardrail questions

Output

Verdict

Scorecard breakdown

Explanation

Suggested pivots (optional)

Everything else supports this.

FULL SCORECARD (DETERMINISTIC CORE)
Scoring Philosophy

Binary pass/fail per rule

Some rules are hard fails

AI never decides the verdict

CATEGORY A: EXISTING ACTIVITY

A1. Existing Participants

Are people already doing this activity without your product?

❌ Fail = REJECT

A2. Engagement Reality

Are users already active or monetizing?

❌ Fail = HIGH RISK

CATEGORY B: MONEY & PAYMENTS (HARD FAIL ZONE)

B1. One-Way Payments

Does money only flow from customer → product?

❌ Fail = REJECT

B2. No Payouts / Custody

Does the product avoid holding or redistributing funds?

❌ Fail = REJECT

B3. Payment Processor Safety

Would Stripe/Paystack allow this without special approval?

❌ Fail = REJECT

CATEGORY C: REGULATION & LEGALITY (HARD FAIL)

C1. Licensing Required

Any gaming, betting, finance, escrow, health, or compliance risk?

❌ Fail = REJECT (Your FPLMOTW example fails here)

CATEGORY D: CORE FEATURE DISCIPLINE (HARD FAIL)

D1. Single Feature Value

Can one feature deliver the main benefit?

❌ Fail = REJECT

D2. Feature Dependency

Does value collapse if features are removed?

❌ Fail = MODIFY / REJECT

CATEGORY E: FRICTION & AUTOMATION

E1. Manual Pain

Are users doing something repetitive or annoying today?

❌ Fail = LOW VALUE

E2. Automation Leverage

Can software replace or simplify this?

❌ Fail = MODIFY

CATEGORY F: INCENTIVE ALIGNMENT

F1. User Wins Immediately

Does the user benefit directly?

❌ Fail = REJECT

F2. Platform Share

Can IdeaGuard monetize without friction?

❌ Fail = MODIFY

CATEGORY G: SCALABILITY

G1. Small-Team Scale

Can 2–3 people run this to 1M users?

❌ Fail = REJECT

G2. Ops Load

Any human dependency?

❌ Fail = REJECT

VERDICT LOGIC
Verdict Rules

Any Hard Fail → REJECT

0–2 soft fails → GO

3–4 soft fails → MODIFY

5+ soft fails → REJECT

Verdicts are final per run.

AI ROLE (STRICTLY LIMITED)
AI Is Used For:

Explaining failed rules

Suggesting safer pivots

Summarizing reasoning

AI Is NOT Used For:

Scoring

Decision making

Validation logic

This prevents hallucinated outcomes.

USER FLOW (FULL APP FLOW)
1️⃣ Landing Page

Clear promise: “Know if your idea is broken in 5 minutes”

CTA: Validate an Idea

2️⃣ Idea Input Screen

Textarea (idea description)

Optional category

CTA: Continue

3️⃣ Guided Question Wizard

One question per screen

Progress bar (e.g. 6 / 14)

Simple inputs (Yes / No / Short text)

“Why this matters” expandable hint

4️⃣ Processing State

Short loader

“Running structural checks…”

5️⃣ Results Page (Core Screen)

Above the fold:

Verdict badge (GO / MODIFY / REJECT)

Color-coded but calm

Below:

Scorecard table (Pass / Fail)

Hard-fail reasons (if any)

AI explanation per failed rule

6️⃣ Pivot Suggestions (Paid)

2–4 alternative safer ideas

Clearly marked as suggestions

7️⃣ Save / Share

Save to dashboard

Shareable link

Export as image / PDF

DASHBOARD (SECONDARY)
List of past ideas

Verdict history

Compare ideas side-by-side

PRICING MODEL
Free

1 validation / month

Verdict + limited explanation

Pay Per Validation

$5–$10

Full breakdown

Pivot suggestions

Export

Pro Subscription

$20/month

Unlimited validations

History + comparison

Priority AI depth

DESIGN SPEC
Visual Style

Minimal

Serious

Utility-first

No illustrations, no mascots

Color System

Green = GO

Amber = MODIFY

Red = REJECT

Neutral greys elsewhere

Typography

Clear hierarchy

No playful fonts

Feels like a checker, not a coach

TECH CONSTRAINTS (HIGH LEVEL)
Stateless scoring engine

Deterministic rules in code

AI via API (cached responses)

Payment via Stripe / Paystack (digital goods only)

OUT OF SCOPE (FOREVER)
Community

Messaging

Mentorship

Idea marketplaces

Voting

Social features

Fundraising tools

SUCCESS METRICS
Primary

Completion rate

Repeat validations

Paid conversion

Secondary

Shares

Time saved feedback

“This stopped me from building X”

INTERNAL NORTH STAR
If the product can’t confidently say “don’t build this,” it has failed.


The designs for IdeaGuard have been generated based on your detailed PRD. The UI follows a strict, utility-first aesthetic with a focus on deterministic validation and clear verdicts.

IdeaGuard Landing Page: A minimalist entry point emphasizing clarity and the "5-minute" validation promise with a direct CTA.
Input Idea Description: A focused, distraction-free screen for founders to articulate their startup concept.
Validation Question Wizard: A step-by-step interface for the scorecard questions, featuring progress tracking and educational tooltips.
Validation Results (Reject): A high-impact results screen displaying the "REJECT" verdict, the scorecard breakdown, and AI-powered explanations for hard-fail rules.
User Idea Dashboard: A clean history view where users can track past validations and see their "Go / Modify / Reject" status at a glance.
Would you like to see the "GO" or "MODIFY" variants of the results page, or perhaps the pricing/upgrade flow?


Design the "GO" verdict results screen


The "GO" verdict results screen has been generated:

Validation Results - Go Verdict: This screen features a prominent green "GO" badge, signaling a high-potential idea. It includes a full scorecard breakdown with green checkmarks for all passed categories (Money, Regulation, Scalability, etc.), a summary of structural strengths, and strategic next steps for scaling.
Would you like to design the "MODIFY" verdict screen next, or should we look into the side-by-side comparison feature?


Design the "MODIFY" verdict results screen


The "MODIFY" verdict results screen has been generated:

Validation Results - Modify Verdict: This screen features a prominent amber badge, indicating that the idea has potential but requires structural adjustments. It highlights specific "Soft Fails" in the scorecard and provides AI-generated pivot directions to help the founder transition the idea toward a "GO" verdict.
With the three core verdict screens complete (GO, MODIFY, REJECT), what would you like to focus on next?


Create the side-by-side idea comparison screen


The side-by-side comparison screen has been generated:

Idea Comparison Screen: This screen allows founders to weigh two different startup concepts against each other. It uses a clean, two-column table to compare key categories like Payment Safety, Regulation, and Scalability, helping users choose the path with the least structural resistance.
What would you like to build next to complete the IdeaGuard experience?


Design the "Pro Subscription" upgrade flow


The Pro Subscription upgrade flow has been designed:

Pro Upgrade Screen: A high-clarity screen detailing the value of the Pro tier, focusing on unlimited structural checks and priority AI pivot depth.
Pro Subscription Checkout: A secure, minimalist payment interface designed to look trustworthy and utility-first, facilitating a frictionless upgrade.
We have now covered the landing page, the validation wizard, all three verdict types (GO, MODIFY, REJECT), idea comparison, and the Pro upgrade path. What should we focus on next?


GUARDRAIL — PRD + DESIGN SPEC

Product name: Guardrail

Tagline: Decide once. Execute calmly.

Audience: Solo founders & indie builders

Platform: Web (mobile-first)

Auth: Optional (local-first / simple auth in v1)

Product Objective
Guardrail is a decision and execution enforcement tool for people with too many ideas and limited energy.

Guardrail helps users:

Decide which ideas deserve execution

Commit to one idea per week

Track execution progress without self-judgment

Guardrail is not a planner, note app, or ideation tool.

Core Product Model
Guardrail has two systems that support each other:

System

Purpose

Idea Guardrail

Decide: GO / MODIFY / DROP

Execution Tracker

Track progress of GO ideas

One-way flow:

Idea → Guardrail Score → Decision → Execution Tracking

No reverse flow.

Core Data Models (Simplified)
3.1 Idea

id

title

created_at

last_scored_at

guardrail_score (0–50)

guardrail_decision (GO / MODIFY / DROP)

active (boolean)

execution_status

notes (max 140 chars)

3.2 Guardrail Score

10 criteria, each 1–5:

existing_participants

pain_intensity

monetization_gap

manual_pain

automation_potential

one_way_payment

incentive_alignment

operational_simplicity

small_team_fit

time_to_value

3.3 Execution Progress

Weekly snapshot:

build_progress

exposure_level

real_usage

signal

revenue_attempt

updated_at

Screen & Flow Overview
Primary Screens

Ideas Dashboard

Add Idea

Guardrail Scoring

Decision Result

Execution Tracker

Weekly Review

Focus Lock Screen

Screen-by-Screen Design Spec
5.1 Ideas Dashboard (Home)

Purpose: Answer one question immediately:

“What am I working on right now?”

Layout

Header:

This Week’s Focus

Large card (if exists):

Idea name

Status: ACTIVE

Days remaining in lock

Below:

All Ideas Table

Idea

Score

Decision

Status

Tailor Your CV

47

GO

ACTIVE

Skika

36

MODIFY

Parked

BAO!

29

DROP

Dropped

Actions

➕ Add Idea

Score (if unscored)

View Execution (GO only)

Constraints

Only one ACTIVE idea

Cannot activate another until lock expires

5.2 Add Idea Screen

Purpose: Capture ideas without thinking.

Fields

Idea title (required)

Optional note (max 140 chars)

Buttons:

Save

Save & Score

No links. No attachments.

5.3 Guardrail Scoring Screen

Purpose: Cold, objective evaluation.

UI

One criterion per screen or stacked cards

Each criterion:

Short description

Dropdown: 1–5

Example:

Existing Participants

Do people already do this today?

⬇️ 1 2 3 4 5

Progress indicator: 7 / 10

Guardrail Criteria Displayed

Existing Participants

Clear Pain

Monetization Gap

Manual Pain

Automation Opportunity

One-Way Payment Flow

Incentive Alignment

Operational Simplicity

Small Team Fit

Time to Value

5.4 Decision Result Screen

Purpose: Enforce clarity.

Display

Big Score: 47 / 50

Decision Banner:

🟢 GO

🟡 MODIFY

🔴 DROP

CTA Options

If GO:

Set as Weekly Focus

If MODIFY:

Archive

Re-score later (locked 7 days)

If DROP:

Confirm Drop

No editing allowed after confirmation

5.5 Focus Lock Screen (Critical)

Triggered when an idea becomes ACTIVE.

Display

You are committing to:

Tailor Your CV

Locked until: Sunday, 11:59 PM

Rules shown:

No new ACTIVE ideas

Other ideas are read-only

Button:

“I Understand”

5.6 Execution Tracker Screen (GO Ideas Only)

Purpose: Track reality, not feelings.

Execution Status Dropdown

Planned

In Progress

Launched

Validated

Parked

Abandoned

Weekly Execution Rubric

Each metric is dropdown:

Metric

Options

Build Progress

None / Partial / Complete

Exposure

None / Shared / Marketed

Real Usage

None / Self / External

Signal

None / Qualitative / Quantitative

Revenue Attempt

None / Tried / Achieved

Output

Execution Health:

🟢 Healthy

🟡 Stalled

🔴 Avoidance Detected

No charts. No analytics.

5.7 Weekly Review Screen (Sunday Only)

Purpose: Close the loop.

Questions:

Keep this active next week?

Park it?

Mark as Launched?

Abandon intentionally?

One-click decisions only.

UX Guardrails (Non-Negotiable)
No free text essays

No AI suggestions

No infinite flexibility

No more than 3 clicks per action

Decisions are timestamped

Locks enforce calm

What Makes Guardrail Valuable
Removes emotional bias

Prevents overthinking

Reframes “abandonment” as intentional

Enforces weekly focus

Makes progress visible without shame

MVP Build Scope
Required

CRUD ideas

Scoring logic

Decision thresholds

Weekly lock

Execution rubric

Not Required

Auth

Notifications

AI

Collaboration

Mobile apps

Success Metrics
One idea active per week

Reduced idea switching

More launched projects

Lower anxiety during execution

Product Truth
Guardrail is not about finding the best idea.

It is about protecting your attention.