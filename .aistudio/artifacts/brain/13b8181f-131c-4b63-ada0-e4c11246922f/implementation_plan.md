# CascadeEval: Overview Landing Page & Interactive Documentation

Add an executive overview homepage introducing the product value proposition with an interactive architecture walkthrough and direct feature deep-dives, alongside an interactive Setup & Developer Documentation tab equipped with API schemas, multi-language SDK snippets, and production rollout runbooks.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following directions have been confirmed for this expansion:
> - **Overview Structure**: Executive product showcase featuring an interactive system architecture diagram, quantified business value metrics (85.1% blended cost reduction, 65% P95 latency improvement), and direct deep-dive launchpads into all application modules.
> - **Documentation Depth**: Interactive developer and FinOps documentation suite featuring a Quickstart setup guide, formal routing algorithm specifications, interactive cURL/Python/TypeScript code snippets with copy actions, and a Phase 1–3 enterprise rollout runbook.

- **Confirmed Decision 1**: The new **Overview** tab will serve as the initial application landing page, providing clean orientation for enterprise engineering leads and PM interviewers before diving into granular tools.
- **Confirmed Decision 2**: The **Documentation** tab will provide interactive code examples with live schema inspection, explaining the $<25\text{ms}$ classification budget, 200k token cliff guard, and dual-pass pairwise evaluation rubrics.
- **Navigation Contract**: 6 single-line, clean navigation links in the header (`Overview`, `Router Playground`, `FinOps & Cost Model`, `Pairwise Autorater`, `Telemetry & SLAs`, `Documentation`).

---

### 1. Overview & Core Concept

1. **Executive Overview Landing Page**:
   - **Hero Statement**: "Intelligent Model Routing & FinOps Gateway for Google Gemini Architecture."
   - **Quantified Business Proof**: Live metrics cards demonstrating 85.1% spend reduction ($0.98/1k queries vs $6.60/1k frontier baseline), 480ms P95 latency (vs 2,400ms for 3.1 Pro), and $\ge 98\%$ quality win-rate parity.
   - **Interactive System Architecture Walkthrough**: Clickable diagram mapping incoming requests through the Heuristic Classifier ($S \in [0.0, 1.0]$), Tier 1/2/3 endpoints, Context Caching, and Pairwise Autorater.
   - **Module Launchpads**: 5 curated cards with direct navigation into Router Playground, FinOps Calculator, Pairwise Autorater, Telemetry SLAs, and Documentation.
   - **Enterprise Customer Archetype Comparison**: Quick summary table comparing Frontier Monolith vs CascadeEval Dynamic Gateway.

2. **Interactive Developer Documentation & Setup Guide**:
   - **Quickstart & Setup**: Environment variables (`GEMINI_API_KEY`, `APP_URL`), server-side Express proxy setup, and Portfolio Sandbox configuration.
   - **Routing Algorithm & Latency Budget**: Mathematical definition of the semantic complexity score $S$, heuristic factors (entropy, reasoning intensity, constraint density, domain difficulty, token ratio), and the $<25\text{ms}$ gateway SLA.
   - **Interactive API Reference**:
     - `POST /api/gateway/route`: Endpoints, parameters, headers, and response payloads.
     - `POST /api/gateway/autorate`: Dual-pass positional bias evaluation schemas.
     - `GET /api/gateway/stats`: Real-time telemetry monitoring.
   - **Multi-Language SDK Snippets**: Toggleable code tabs (cURL, Python `httpx`, TypeScript Fetch) with one-click copy buttons.
   - **Production Rollout Runbook**: Detailed guidance for Phase 1 (Alpha proxy), Phase 2 (Shadow dual-write & 5% autorater sampling), and Phase 3 (Canary rollout to 100%) from PRD Section 9.

---

### 2. User Experience & Visual Design

Following the **Universal Frontend Design Constitution** and **Marketing / SaaS Guidelines**:
- **Aesthetic Direction**: High-density engineering console with clean dark-slate posture (`#0B0F17` canvas, `#111827` surface containers, hairline `#1F2937` borders). No generic purple gradients or pill badges.
- **Typography**: `Plus Jakarta Sans` for titles and display structure, paired with `JetBrains Mono` / `tabular-nums` for code snippets, endpoints, token counts, and latency percentiles.
- **Navigation Contract**: 3-zone clean top bar with wordmark (`CascadeEval`), 6 single-line text tabs with active state styling, and the Sandbox Mode / Live Quota status control.

---

### 3. Key Product Decisions & Trade-Offs

- **Integrated Tab Architecture**:
  - *Chosen Approach*: Implement `OverviewLanding.tsx` and `DocumentationView.tsx` as first-class tabs alongside existing tools, with seamless cross-linking so any module card in the overview switches the active tab directly.
  - *Why*: Provides immediate context for executive reviewers and recruiters without fragmenting the unified full-stack application.
- **Interactive Code Tabs with Live Sandbox Sync**:
  - *Chosen Approach*: Documentation snippets include live parameter toggles (e.g. `isInterviewMode`, `x-execution-mode: async`) that match the actual server API endpoints.
  - *Why*: Allows technical interviewers to inspect exact HTTP request structures and see how enterprise clients integrate with the gateway.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 Browser Client (React)                                 │
│  ┌───────────┐  ┌─────────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌──────┐ │
│  │ Overview  │  │ Playground  │  │  FinOps   │  │ Autorater │  │ Telemetry │  │ Docs │ │
│  └─────┬─────┘  └──────┬──────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └──┬───┘ │
└────────┼───────────────┼───────────────┼──────────────┼──────────────┼───────────┼─────┘
         │               │               │              │              │           │
         ▼               ▼               ▼              ▼              ▼           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        CascadeEval Express Full-Stack Server                           │
│                                                                                        │
│   • /api/gateway/route      (Routing Engine, Complexity Classifier, Cliff Guard)       │
│   • /api/gateway/autorate   (Dual-Pass Frontier Pairwise Judge, Length Compensation)   │
│   • /api/gateway/stats      (Rolling Latency Percentiles & Ingested Query Logs)        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Interactive Component & State Mapping

- `OverviewLanding`: Renders the executive hero, quantified proof metrics, interactive architecture graph, module launchpads with `onNavigate` callbacks, and business case study comparison.
- `DocumentationView`: Renders the multi-section documentation suite with sidebar navigation (Quickstart, Routing Algorithm, API Reference, Code Snippets, Rollout Runbook) and code copy helpers.
- `Navbar` & `App`: Updated tab state supporting `'overview' | 'playground' | 'finops' | 'autorater' | 'telemetry' | 'docs'`, defaulting to `'overview'` on initial load.
