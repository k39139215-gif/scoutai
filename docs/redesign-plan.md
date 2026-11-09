# ScoutAI Phase 1: Comprehensive Audit & Redesign Plan

**Document:** `docs/redesign-plan.md`  
**Date:** 2026-11-09  
**Branch:** `redesign/ui-polish` (Isolated from `main` and live `gh-pages`)  
**Status:** DRAFT FOR APPROVAL (No product source code changed)

---

## 1. Executive Summary & Audit Verification

A forensic audit of the ScoutAI recruitment-operations codebase was conducted across all 14 routes, all shared layout components, mock data stores, and CSS token structures.

Every single finding identified in the screenshot review was verified directly against source code lines:

| # | Item from Screenshot Review | Source File & Location | Code Finding & Verification Status |
|---|---|---|---|
| **1** | **"Studio Desk (Refs)" button on every page** | `src/views/*.tsx` (14 views) | **CONFIRMED.** Button present in headers of `DashboardView`, `JobsView`, `CandidatesView`, `AIActivityView`, `AnalyticsView`, `ClientsView`, `InterviewsView`, `OutreachView`, `PrivacyComplianceView`, `SecurityView`, `SettingsView`, `SourcingView`, `TasksView`, `JobWorkspaceView`. |
| **2** | **"Live Mode / Studio Desk REF" toggle in top bar** | `src/components/layout/Header.tsx` (L169-205) | **CONFIRMED.** Hard-coded segmented switch toggling between `Live Mode` and `Studio Desk REF` with an indigo badge. |
| **3** | **"REF" badge on Talent Studio in sidebar** | `src/components/layout/Sidebar.tsx` (L47) | **CONFIRMED.** `{ id: 'talent-studio', label: 'Talent Studio', badge: 'REF' }`. |
| **4** | **"20 Reference Designs" & "Audio ON" chips** | `src/views/TalentStudioView.tsx` (L781, L849, L4410) | **CONFIRMED.** Internal reference design viewer trigger, audio sound toggle chip, and 20-reference lightbox modal embedded directly in production UI. |
| **5** | **"Reset Demo State" in Sidebar footer** | `src/components/layout/Sidebar.tsx` (L336-354) | **CONFIRMED.** Prominent destructive reset button sitting in primary navigation footer without confirmation modal. |
| **6** | **"(Demo)" suffix on client names** | `src/data/mockData.ts` (L646, L658, L670, L682) | **CONFIRMED.** Client company names explicitly include `(Demo)` in string definitions (e.g., `'HyperScale Fintech (Demo)'`). |
| **7** | **Unverified Claims: SOC 2, #1 Ranked, Fair-Hiring** | `src/views/TalentStudioView.tsx` (L722, L741, L759) | **CONFIRMED.** Hard-coded promotional badges: `#1 Ranked Match Precision (99.4%)`, `SOC 2 Type II Certified`, `Fair-Hiring AI v3.4 Active`. |
| **8** | **Unverified Claims: DPDP Act Compliance badge** | `src/views/PrivacyComplianceView.tsx` (L77, L148) | **CONFIRMED.** Header displays `DPDP Act Compliance` badge while banner underneath explicitly notes: *"Independent legal review is recommended for formal regulatory compliance under India's Digital Personal Data Protection (DPDP) Act."* |
| **9** | **Unverified Claims: Tamper-evident, AES-256, Zero PII** | `src/views/PrivacyComplianceView.tsx` (L210, L213), `SecurityView.tsx` (L77, L139, L204) | **CONFIRMED.** Static claims: `Zero external PII exposure`, `AES-256`, `SOC2 Type II Controls`, `Tamper-evident cold storage`. |
| **10** | **Funnel Math Contradiction: 42/247 = 70%, 12/247 = 48%** | `src/views/AnalyticsView.tsx` (L13-17) | **CONFIRMED.** `Talent pool evaluated (247, 100%)`, `Qualified on core skills (42, 70%)` [real math = 17.0%], `Recruiter shortlisted (14, 48%)` [real math = 5.7%]. |
| **11** | **Candidate Matching: Unsorted Ranked Matches** | `src/views/SourcingView.tsx` (L45-47) | **CONFIRMED.** `matchingCandidates` filters candidates but never sorts by `matchScore DESC`. High-scoring candidates (e.g. Priya Patel, 96%) appear below lower scores (94%, 88%). |
| **12** | **Pool & Count Discrepancies Across Pages** | `mockData.ts`, `HiringPipeline.tsx`, `JobsView.tsx`, `CandidatesView.tsx` | **CONFIRMED.** `mockData.ts` defines 6 candidate objects, but static strings say 247. On Dashboard, `jobCandidates.length` overrides `job.applicantsCount` (showing 2 applied instead of 38). |
| **13** | **"Next: 14:30 IST" hardcoded/unsorted** | `src/components/dashboard/OperationalSummary.tsx` (L14, L138) | **CONFIRMED.** Uses `upcomingInterviews[0].time` without sorting by timestamp or displaying the date. |
| **14** | **Fragmented Date / Today Anchors** | `mockData.ts` (tasks, interviews, audits) | **CONFIRMED.** Dates use `2026-08-15` as implied today, but various views format dates differently (ISO string vs raw vs locale). |
| **15** | **Duplicated Audit Trails in Nav** | `AIActivityView.tsx` vs `SecurityView.tsx` | **CONFIRMED.** Sidebar has two separate audit items: `Audit Trail` (operations) and `Security & Access` (auth/admin audit). |
| **16** | **Table Clipping: Requisitions, Candidates, Compliance** | `JobsView.tsx` (L260), `CandidatesView.tsx` (L807), `PrivacyComplianceView.tsx` (L238) | **CONFIRMED.** Tables lack sticky column pinning, have clipped rightmost action columns, and lack card-contained horizontal scroll shadows. |
| **17** | **Data Compliance Duplicate Status Column** | `src/views/PrivacyComplianceView.tsx` (L288, L291) | **CONFIRMED.** Status column displays `<StatusBadge status={req.status} />`, and the very next "Update" column displays a `<CustomSelect value={req.status} />` that clips off-screen. |
| **18** | **Talent Studio Expanded Row vs Copilot Overflow** | `src/views/TalentStudioView.tsx` (L1523) | **CONFIRMED.** Desktop layout splits into `gridTemplateColumns: minmax(0, 1fr) 360px`. Expanded table rows fail to wrap and overflow behind the copilot panel on screens <= 1280px. |

---

## 2. Phase 6B: BoardUI Stack Gate Report

Per the Phase 6B instructions, the stack was evaluated before making any structural changes:

* **Framework:** React `19.2.8` with Vite `8.2.1`
* **TypeScript:** Yes (`typescript ~6.0.2`, `tsconfig.json`, `tsconfig.app.json`)
* **Tailwind CSS:** **NOT INSTALLED** (app currently uses plain CSS with custom CSS variables and inline styles).
* **Path Alias (`@/*`):** **NOT CONFIGURED** in `tsconfig.json` or `vite.config.ts`.
* **Deployment Base Path:** `./` (Relative path for GitHub Pages subfolder).
* **react-aria-components:** **NOT INSTALLED**.

### Stack Gate Analysis & Recommendation:
1. **BoardUI Prerequisites:** BoardUI components depend strictly on Tailwind CSS v4, `@/*` alias, and `react-aria-components`.
2. **Risk Assessment:** Introducing Tailwind CSS v4 into this React 19 project would require converting or layering hundreds of existing CSS variable rules and inline styles, risking layout regressions across all 14 screens.
3. **Execution Decision:** In accordance with Step 1 of Phase 6B:
   > *"If the project is plain HTML/JS or a different stack, STOP this phase. Do not migrate frameworks. Skip to Phase 7 and implement the same components with the project's current stack using the Phase 6 tokens."*
   We recommend **implementing the interactive primitives (accessible Select, Dropdown, Tabs, Modal, Tooltip, Toast, Drawer, Segmented Control) natively** within the existing React + CSS architecture using the exact Phase 6 tokens. This guarantees zero framework friction, zero bundle bloat, and total pixel control.

---

## 3. Unified Design Token System (Phase 6 Specification)

All styling will be anchored to a single source of truth in `src/styles/tokens.css` (or `src/index.css` token section):

### A. Typography Scale
* Hero number (strictly 1 per page max): `36px` / line-height `1.1` / weight `600` / tabular-nums
* Section Title / View Heading: `20px` / line-height `1.25` / weight `600` / tracking `-0.02em`
* Subsection / Card Heading: `16px` / line-height `1.3` / weight `600`
* Body Primary / Table Content: `14px` / line-height `1.45` / weight `400`
* Body Secondary / Metadata: `13px` / line-height `1.4` / weight `400`
* Labels / Pills / Footnotes / Timestamps: `12px` / line-height `1.3` / weight `500`
* **Strict Rule:** Zero text below `12px` across the entire application.

### B. Color & Semantic Status Palette
* **Brand Primary Accent:** Deep Indigo (`#4338ca` default, `#3730a3` hover, `#e0e7ff` soft tint)
* **Surfaces:**
  * Canvas: `#f8fafc`
  * Card Surface: `#ffffff`
  * Hover / Subsurface: `#f1f5f9`
  * Borders: `#e2e8f0` (subtle), `#cbd5e1` (default), `#94a3b8` (strong)
  * Text: `#0f172a` (primary ink), `#475569` (secondary slate), `#64748b` (muted)
* **Unified Status Palette (24px height, 12px text, borderless tint):**
  * `Active` / `Open` / `Completed` / `Approved` $\rightarrow$ Success Tint (BG: `#ecfdf5`, Text: `#065f46`)
  * `Pending` / `Scheduled` / `Draft` $\rightarrow$ Info/Neutral Tint (BG: `#f1f5f9`, Text: `#334155` or `#eff6ff` / `#1e40af`)
  * `Paused` / `In Review` / `Moderate` $\rightarrow$ Warning Tint (BG: `#fffbeb`, Text: `#92400e`)
  * `Closed` / `Failed` / `Cancelled` / `Archived` $\rightarrow$ Muted/Danger (BG: `#fef2f2`, Text: `#991b1b` or neutral slate)
* **Priority Palette:**
  * High: Amber/Red Tint (`#fef2f2`, `#991b1b`)
  * Medium: Neutral Slate Tint (`#f1f5f9`, `#334155`)
  * Low: Soft Muted (`#f8fafc`, `#64748b`)

### C. Controls & Elevation
* **Height:** Consistent `36px` default (`32px` compact density for dense table rows).
* **Radius:** `6px` consistent control radius; `8px` card radius.
* **Button Hierarchy:**
  * Exactly **ONE solid primary button** per screen view (Deep Indigo `#4338ca` or dark slate `#0f172a`).
  * Secondary buttons: White `#ffffff` background with `#cbd5e1` 1px border.
  * Tertiary buttons: Borderless text button with hover tint.
  * Destructive: Red outline/text (`#b91c1c`), solid fill reserved strictly for confirmed modal dialog actions.
* **Selection State:** Light tint + accent text/ring (`#eef2ff` with `#4338ca` text), never solid black.
* **Focus Rings:** `box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #4338ca` on `:focus-visible`.

---

## 4. Single Source of Truth: Centralized Data & Utilities Module (Phase 4)

We will introduce a dedicated single-source-of-truth module: `src/data/recruitmentData.ts` and `src/utils/formatters.ts`.

### A. Reconciled Metrics & Data Definitions
* **Talent Repository Pool:** `247 profiles` (simulated candidate base).
* **Active Candidates Directory:** Explicitly labeled as `6 Active Shortlisted Profiles` currently in active evaluation pipelines, from a broader indexed repository of 247 profiles.
* **Requisition Pipeline Counts:**
  * Derive `applicantsCount`, `qualifiedCount`, `shortlistedCount`, and `interviewingCount` directly from candidate relational foreign keys (`appliedJobId`), with explicit fallback definitions when rendering broader client totals.
* **Funnel Calculation Engine:**
  * Conversion percentages calculated dynamically against explicit bases:
    * Conversion vs Overall Talent Pool: $\frac{\text{Stage Count}}{247} \times 100\%$
    * Stage-over-Stage Conversion: $\frac{\text{Current Stage Count}}{\text{Previous Stage Count}} \times 100\%$
    * Display both numbers clearly with a visible legend.
* **Candidate Matching (`SourcingView`):**
  * Sort matches deterministically by `matchScore DESC`. Top candidate rendered with distinctive hero treatment.
* **Timeline & Date Normalization:**
  * Anchor: `2026-08-15` (Demo "Today").
  * Unified date formatter: `formatDemoDate(dateString)` $\rightarrow$ `"Aug 15, 2026"`.
  * Unified time formatter: `formatDemoTime(timeString)` $\rightarrow$ `"2:30 PM IST"`.
  * Dashboard "Next Interview" computed by sorting scheduled interviews chronologically: returns `"Aug 16, 2026 • 2:30 PM IST"`.

---

## 5. Screen-by-Screen Focal Points & Plan (Phase 7)

1. **Top Bar & Navigation:**
   * Remove "Live Mode / Studio Desk REF" toggle.
   * Add single authoritative **"Demo data"** pill badge (`#f1f5f9` background, `#475569` text, `12px`).
   * Clean Top Bar: Breadcrumb $\rightarrow$ Global Search (real ⌘K palette) $\rightarrow$ Notifications $\rightarrow$ Recruiter Avatar.
   * Remove "REF" badge from Sidebar.
   * Move "Reset Demo State" out of the sidebar footer and into **Settings > Demo Data** tab with a secure confirmation modal.
   * Consolidate **Audit Trail** and **Security & Access** into a single navigation item: **Audit & Governance** (or **Audit Trail** with `Operations` and `Security` tabs).

2. **Dashboard:**
   * Action items ("5 pending recruiter actions", "Next interview") moved to prominent top-right summary rail.
   * Single primary button: **Post Requisition**. "Match Candidates" demoted to secondary.
   * Zero counts displayed with neutral gray tone rather than false-positive green.

3. **Requisitions (`JobsView`):**
   * Replace the bordered dropdowns in the table with unified status pills (`Open` = Emerald tint). Status changed via cleanly styled row action menu `...`.
   * Row primary action ("View Workspace") pinned and always visible with sticky positioning.
   * Mute loud green background fills on candidate count pills.

4. **Candidates Directory (`CandidatesView`):**
   * Single primary button in header: **Post Job**. "Import" and "Talent Actions" grouped in secondary dropdown menu.
   * Match score made the focal point in each row using tabular numerals and standard font.
   * Table equipped with horizontal scroll container and sticky first column (Candidate name/avatar).

5. **Talent Studio (`TalentStudioView`):**
   * Remove all 3 unverified claim pills (`#1 Ranked`, `SOC 2 Type II`, `Fair-Hiring AI`).
   * Remove internal dev controls ("20 Reference Designs", "Audio ON" chips, reference modal).
   * Replace multicolor rainbow pipeline bar with clean muted segments.
   * Fix expanded row container width and make AI Copilot panel auto-collapse below 1280px screen width.

6. **Candidate Matching (`SourcingView`):**
   * Top-ranked candidate sorted to index 0 with elevated visual card.
   * Limit skill badges to max 3 visible + `+n more`.
   * Standardize action buttons to right rail.

7. **Outreach Cadence (`OutreachView`):**
   * Segmented tone preset (Professional, Engaging, Executive) styled with subtle indigo tint (`#eef2ff`), not solid black.
   * Single primary button: **Save as Draft**. "Send (Demo)" styled as secondary button with explicit disclaimer pill: *"Simulation: No external emails dispatched"*.

8. **Interviews Schedule (`InterviewsView`):**
   * Interview card date & time elevated as hero typography (`16px`, weight 600, tabular).
   * Action hierarchy: "Complete" = green tint; "Reschedule" = secondary; "Cancel" = text button.
   * Layout restructured into 2-column grid with an upcoming summary rail to eliminate vast empty spaces.

9. **Recruiter Tasks (`TasksView`):**
   * Completed tasks styled with muted strike/fade (`#94a3b8`); pending tasks rendered crisply with High priority highlighted in warm amber/rose.
   * Added side rail summarizing "Due Today (2)", "Overdue (1)", "Completed (3)" to fill empty whitespace.

10. **Audit & Security Trail (`AIActivityView` & `SecurityView`):**
    * Consolidated into a 2-tab view: `[Operations Activity] | [Security & Access Log]`.
    * Highlight failures and warnings clearly. Neutralize columns of repetitive green checkmarks when operations are standard successes.
    * Neutralize claims: remove `Tamper-evident cold storage` $\rightarrow$ replace with `Immutable activity logging`.

11. **Pipeline Analytics (`AnalyticsView`):**
    * Correct conversion funnel formulas to stated bases with full mathematical transparency.
    * Add date range selector and delta indicators on KPI cards.

12. **Client Accounts (`ClientsView`):**
    * Strip `(Demo)` from company names.
    * Format fulfillment progress bar with amber warning for low fulfillment (<50%).
    * Rebalance grid into clean 2x2 or 4-up grid to eliminate orphan card hanging on the bottom row.

13. **Data Compliance (`PrivacyComplianceView`):**
    * Soften legal badge: change `DPDP Act Compliance` badge to `DPDP-aligned workflows (Informational)`.
    * Remove duplicate status column in table; leave one clear Status Badge and a single "Review" action button.
    * Neutralize `AES-256` and `Zero external PII exposure` into honest enterprise operational descriptors (`Role-based access & encryption at rest`).

14. **System Settings (`SettingsView`):**
    * Deduplicate "Save changes" buttons down to exactly one authoritative primary button.
    * Left-align content with equal page gutters to match the rest of the application.
    * Add dedicated "Demo Data Management" section containing the reset button with a protective confirmation dialog.

---

## 6. Implementation File List & Phases

### Files to Create:
1. `src/styles/tokens.css` — Central design tokens (typography scale, spacing, unified colors, button states).
2. `src/data/recruitmentData.ts` — Single source of truth for all computed pipeline counts, candidate statuses, and reconciled numbers.
3. `src/utils/formatters.ts` — Single source of truth for dates, times, currency, and percentages.
4. `src/components/common/Tooltip.tsx` — Accessible hover/focus tooltip for all truncated values.
5. `src/components/common/ConfirmModal.tsx` — Reusable confirmation dialog for destructive actions (e.g. Reset Demo Data).
6. `tests/data-reconciliation.test.js` — Automated unit tests asserting cross-view mathematical consistency.

### Files to Update:
1. `src/context/AppContext.tsx` — Wire unified data, remove dev switches, manage demo reset modal.
2. `src/components/layout/Header.tsx` — Clean top bar, remove dev toggle, add Demo Data badge.
3. `src/components/layout/Sidebar.tsx` — Remove REF badges, remove sidebar reset button, consolidate audit nav.
4. `src/views/DashboardView.tsx` & `src/components/dashboard/*` — Reconcile counts, highlight next interview.
5. `src/views/JobsView.tsx` — Fix table clipping, remove bordered selects, sticky actions.
6. `src/views/CandidatesView.tsx` — Sticky first column, single primary action, tooltip integration.
7. `src/views/TalentStudioView.tsx` — Remove unverified claims and dev chips, collapse copilot <=1280px.
8. `src/views/SourcingView.tsx` — Sort ranked matches by fit descending.
9. `src/views/OutreachView.tsx` — Tinted selection, honest simulation notice, primary draft button.
10. `src/views/InterviewsView.tsx` — 2-column balanced grid, hero date/time, text cancel button.
11. `src/views/TasksView.tsx` — Summary rail, muted completed tasks, warm priority tags.
12. `src/views/AIActivityView.tsx` / `SecurityView.tsx` — Unified 2-tab audit experience.
13. `src/views/AnalyticsView.tsx` — Corrected funnel formulas and stage deltas.
14. `src/views/ClientsView.tsx` — Strip (Demo) suffixes, clean 2x2 grid, amber low-fulfillment warning.
15. `src/views/PrivacyComplianceView.tsx` — Remove duplicate status column, soften DPDP/PII claims.
16. `src/views/SettingsView.tsx` — Left alignment, single save button, demo reset dialog.

---

## 7. Verification Criteria & Automated Gate Checks

Before submitting for final review in Phase 8, the following automated checks must pass:
1. **Zero Unverified Claims:** Grep check confirms 0 occurrences of `#1 Ranked`, `SOC 2 Type II Certified`, `Fair-Hiring AI`, `Zero external PII exposure`, `Tamper-evident`.
2. **Zero Dev UI Leakage:** Grep check confirms 0 occurrences of `Studio Desk (Refs)`, `20 Reference Designs`, `Audio ON`.
3. **Data Reconciliation Tests:** All automated unit tests in `tests/data-reconciliation.test.js` pass with 100% assertions.
4. **Layout Verification:** Playwright tests confirm 0 horizontal overflow scrollbars at 1440px, 1280px, and 390px widths.
5. **A11y & Contrast:** axe-core scan on all 14 views confirms 0 serious/critical violations, and all text meets 4.5:1 contrast with $\ge 12\text{px}$ minimum size.
6. **Focal Point Enforcement:** Exactly $\le 1$ solid dark/accent primary button per screen.
7. **Typecheck & Build:** `npm run build` passes with zero errors and clean bundle output.

---

**End of Phase 1 Audit & Plan.**  
*Awaiting your approval to proceed to Phase 2 (Developer UI Removal).*
