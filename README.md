# CascadeEval: LLM Router and FinOps Gateway

A prototype gateway that sends each request to the cheapest Gemini tier likely to handle it, and checks whether the cheaper answer holds up against a stronger model. Built for product and platform teams who want to cut inference cost without guessing how much quality they give up.

**Status:** Working prototype. Built in Google AI Studio; exported to GitHub on 22 October 2026.

## What it does

- **Routes by complexity.** A heuristic scores each prompt from 0.0 to 1.0 (reasoning intensity, domain difficulty, constraint density, entropy, token ratio) and picks one of three tiers: Gemini 2.5 Flash-Lite, 2.5 Flash, or 2.5 Pro.
- **Judges quality pairwise.** Gemini 2.5 Pro compares two candidate answers on grounding, instruction adherence, coherence, and safety, then runs a second pass with the order swapped to check for position bias.
- **Models cost.** A FinOps calculator estimates blended cost per 1K requests across tiers and cache-hit rates.
- **Shows telemetry.** A dashboard summarizes routing decisions, cache hits, fallbacks, and latency.

## How it works

React and Vite front end, Express server (`server.ts`) that calls the Gemini API through `@google/genai`.

| Endpoint | What it does |
|---|---|
| `POST /api/gateway/route` | Scores the prompt, picks a tier, calls that Gemini model, returns the answer with measured latency |
| `POST /api/gateway/autorate` | Pairwise LLM-as-judge comparison with a position-swap pass |
| `GET /api/gateway/stats` | Aggregates the request log for the telemetry view |
| `POST /api/gateway/simulate-batch` | Loads a fixed set of sample prompts for a demo run |

## What's real and what's simulated

**Real, when a Gemini API key is set**
- Routing calls to the three Gemini 2.5 tiers, with latency timed on the server.
- The pairwise judge call to Gemini 2.5 Pro.

**Simulated or assumed**
- Without a key, or if a call fails, the app falls back to a deterministic sandbox with canned answers and randomized latency around preset values.
- The batch simulator uses a fixed list of sample prompts with preset complexity scores.
- Context caching is modeled: the cache key is a SHA-256 hash of the system prompt and context, and a hit assumes 85% of input tokens are cached.
- Rate-limit and schema-error fallbacks are triggered by toggles in the UI, not by real failures.
- The complexity weights (40/30/15/10/5) are product judgment, not fitted to data.
- Latency figures on the documentation page are design targets.

## What I learned

- A keyword-style heuristic is cheap and fast, but it can misread a short, hard prompt as easy. The real risk in routing is the misroute rate, not the average saving.
- LLM-as-judge needs a bias check. Swapping the order of the two answers is the simplest guard against the judge favoring whichever it reads first.
- Cost savings depend heavily on the cache-hit rate, so a routing business case should be modeled with and without caching.

## Next steps

- Label a set of prompts with the tier a judge prefers, and measure how often the heuristic picks a different tier.
- Fit the complexity weights to that labeled set instead of setting them by hand.

## Run it locally

Requires Node.js.

```bash
npm install
cp .env.example .env    # add your own GEMINI_API_KEY; never commit .env
npm run dev
```

Without a key, the app runs in sandbox mode with simulated responses.
