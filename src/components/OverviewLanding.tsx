import React, { useState } from 'react';
import {
  Layers,
  TrendingDown,
  Clock,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Database,
  Scale,
  Activity,
  BookOpen,
  Cpu,
  Sparkles,
  GitFork,
  DollarSign,
  ChevronRight,
  Play,
} from 'lucide-react';
import { MODEL_TIERS } from '../types/gateway';

interface OverviewLandingProps {
  onNavigate: (tab: 'playground' | 'finops' | 'autorater' | 'telemetry' | 'docs') => void;
  onToggleInterviewMode: () => void;
  isInterviewMode: boolean;
}

export const OverviewLanding: React.FC<OverviewLandingProps> = ({
  onNavigate,
  onToggleInterviewMode,
  isInterviewMode,
}) => {
  const [selectedArchStage, setSelectedArchStage] = useState<
    'gateway' | 'classifier' | 'tier1' | 'tier2' | 'tier3' | 'evals'
  >('classifier');

  return (
    <div className="space-y-12 pb-8">
      {/* Executive Hero Section */}
      <section className="relative pt-4 pb-8 border-b border-slate-800/80">
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
            <span>Enterprise AI Infrastructure</span>
            <span className="text-slate-600">·</span>
            <span>Target Release: Q1 2027 Internal Alpha / Q2 2027 Platform GA</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            CascadeEval: Intelligent Model Routing &amp; FinOps Gateway
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Modern enterprise applications treat foundation model APIs as monolithic endpoints, routing every routine FAQ, sentiment triage, and JSON extraction query to costly flagship models. CascadeEval is an intelligent reverse-proxy gateway that dynamically scores query complexity in <strong className="text-white">&lt;25ms</strong>, routing payloads across Google&apos;s tiered foundation models while preserving <strong className="text-emerald-400">&ge;98% quality win-rate parity</strong> at an <strong className="text-cyan-400">85% lower blended cost</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('playground')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Launch Router Playground</span>
            </button>

            <button
              onClick={() => onNavigate('docs')}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700/80 rounded-lg hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
            >
              <BookOpen className="h-4 w-4 text-cyan-400" />
              <span>Developer Setup &amp; API Docs</span>
            </button>

            <button
              onClick={() => onNavigate('finops')}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700/80 rounded-lg hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
            >
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span>Explore FinOps Calculator</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quantified Business Outcomes (Mechanism-to-Outcome) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="font-semibold text-slate-200">Production Performance Targets (PRD §1 &amp; §7.2)</span>
          <span>Targeting 10M+ Queries / Month Enterprise Baseline</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Blended Cost Reduction</span>
              <TrendingDown className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
              85.1%
            </div>
            <p className="text-xs text-slate-400">
              Blended CPQ reduced from <strong className="text-slate-200 font-mono">$6.60</strong> to <strong className="text-emerald-300 font-mono">$0.98</strong> per 1k queries.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>P95 Latency Acceleration</span>
              <Clock className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-cyan-400 tabular-nums">
              65.0%
            </div>
            <p className="text-xs text-slate-400">
              Blended P95 response time drops from <strong className="text-slate-200 font-mono">2,400ms</strong> to <strong className="text-cyan-300 font-mono">480ms</strong>.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Quality Win-Rate Parity</span>
              <CheckCircle2 className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-blue-400 tabular-nums">
              &ge; 98.4%
            </div>
            <p className="text-xs text-slate-400">
              Verified continuously via independent frontier pairwise LLM-as-a-judge autorater.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Context Cliff Protection</span>
              <ShieldAlert className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-amber-400 tabular-nums">
              100%
            </div>
            <p className="text-xs text-slate-400">
              Automated conversation pruner clamps inputs at 199.5k tokens, averting doubled rates.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Architecture Walkthrough */}
      <section className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>Interactive System Architecture Walkthrough (PRD §3)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any stage in the gateway pipeline to inspect routing parameters, latency budgets, and token economics.
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            Overhead Budget: &lt;25ms P95
          </span>
        </div>

        {/* Interactive Architecture Stage Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <button
            onClick={() => setSelectedArchStage('gateway')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              selectedArchStage === 'gateway'
                ? 'bg-slate-800 border-cyan-500 text-cyan-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] text-slate-500">STAGE 1</div>
            <div className="font-bold text-white mt-1">Gateway Entry</div>
            <div className="text-[10px] text-slate-400 mt-1">Schema &amp; Hash</div>
          </button>

          <button
            onClick={() => setSelectedArchStage('classifier')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              selectedArchStage === 'classifier'
                ? 'bg-slate-800 border-cyan-500 text-cyan-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] text-slate-500">STAGE 2</div>
            <div className="font-bold text-white mt-1">Classifier</div>
            <div className="text-[10px] text-slate-400 mt-1">S &isin; [0.0, 1.0]</div>
          </button>

          <button
            onClick={() => setSelectedArchStage('tier1')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              selectedArchStage === 'tier1'
                ? 'bg-slate-800 border-cyan-500 text-cyan-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] text-cyan-400">70% TRAFFIC</div>
            <div className="font-bold text-white mt-1">Tier 1: Fast</div>
            <div className="text-[10px] text-slate-400 mt-1">2.5 Flash-Lite</div>
          </button>

          <button
            onClick={() => setSelectedArchStage('tier2')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              selectedArchStage === 'tier2'
                ? 'bg-slate-800 border-blue-500 text-blue-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] text-blue-400">20% TRAFFIC</div>
            <div className="font-bold text-white mt-1">Tier 2: Balanced</div>
            <div className="text-[10px] text-slate-400 mt-1">3.5 Flash</div>
          </button>

          <button
            onClick={() => setSelectedArchStage('tier3')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              selectedArchStage === 'tier3'
                ? 'bg-slate-800 border-purple-500 text-purple-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] text-purple-400">10% TRAFFIC</div>
            <div className="font-bold text-white mt-1">Tier 3: Deep</div>
            <div className="text-[10px] text-slate-400 mt-1">3.1 Pro</div>
          </button>

          <button
            onClick={() => setSelectedArchStage('evals')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              selectedArchStage === 'evals'
                ? 'bg-slate-800 border-emerald-500 text-emerald-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] text-emerald-400">5% SAMPLE</div>
            <div className="font-bold text-white mt-1">Pairwise Evals</div>
            <div className="text-[10px] text-slate-400 mt-1">Frontier Judge</div>
          </button>
        </div>

        {/* Selected Stage Detail Panel */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
          {selectedArchStage === 'gateway' && (
            <div className="space-y-1.5">
              <span className="text-cyan-400 font-bold block text-sm">
                Stage 1: Gateway Ingestion &amp; SHA-256 Context Caching
              </span>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                Inbound client payloads are validated against target JSON schemas and token bounds. System instructions and reference documents exceeding 32k tokens are fingerprinted with deterministic SHA-256 hashes, activating Google Context Caching to capture an 85% discount on repeated prompt tokens.
              </p>
              <div className="flex gap-4 text-[11px] text-slate-400 pt-1">
                <span>Validation Overhead: &lt;2ms</span>
                <span>·</span>
                <span>Context Cache Discount: 85%</span>
                <span>·</span>
                <span>200k Cliff Guard: Active</span>
              </div>
            </div>
          )}

          {selectedArchStage === 'classifier' && (
            <div className="space-y-1.5">
              <span className="text-cyan-400 font-bold block text-sm">
                Stage 2: Heuristic Semantic Classifier (&lt;25ms Budget)
              </span>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                Computes a normalized complexity score $S \in [0.0, 1.0]$ based on query entropy, reasoning triggers, structural constraints, and domain hardness. Compact schema extractions (&lt;500 chars) execute a deterministic rule-based bypass straight to Tier 1 in under 1ms.
              </p>
              <div className="flex gap-4 text-[11px] text-slate-400 pt-1">
                <span>Tier 1 Boundary: S &le; 0.35</span>
                <span>·</span>
                <span>Tier 2 Boundary: 0.35 &lt; S &le; 0.75</span>
                <span>·</span>
                <span>Tier 3 Boundary: S &gt; 0.75</span>
              </div>
            </div>
          )}

          {selectedArchStage === 'tier1' && (
            <div className="space-y-1.5">
              <span className="text-cyan-400 font-bold block text-sm">
                Tier 1 (Fast): Gemini 2.5 Flash-Lite — 70% Target Share
              </span>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                Ultra-high-throughput tier designed for FAQs, sentiment classification, structured lead parsing, and schema extraction. Delivers sub-180ms P50 latency and sub-90ms TTFT at $0.075 / $0.30 per 1M tokens.
              </p>
              <div className="flex gap-4 text-[11px] text-slate-400 pt-1">
                <span>P50 / P95: 180ms / 350ms</span>
                <span>·</span>
                <span>Cost / 1M (In/Out): $0.075 / $0.30</span>
                <span>·</span>
                <span>Fallback: Auto-escalates to Tier 2 on 429</span>
              </div>
            </div>
          )}

          {selectedArchStage === 'tier2' && (
            <div className="space-y-1.5">
              <span className="text-blue-400 font-bold block text-sm">
                Tier 2 (Balanced): Gemini 3.5 Flash — 20% Target Share
              </span>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                Balanced intelligence workhorse handling code refactoring, multi-turn conversational agents, complex SQL generation, and document summarization. Operates with an 850ms P95 latency SLA at $0.30 / $1.20 per 1M tokens.
              </p>
              <div className="flex gap-4 text-[11px] text-slate-400 pt-1">
                <span>P50 / P95: 450ms / 850ms</span>
                <span>·</span>
                <span>Cost / 1M (In/Out): $0.30 / $1.20</span>
                <span>·</span>
                <span>Fallback: Escalates to Tier 3 on logic error</span>
              </div>
            </div>
          )}

          {selectedArchStage === 'tier3' && (
            <div className="space-y-1.5">
              <span className="text-purple-400 font-bold block text-sm">
                Tier 3 (Deep): Gemini 3.1 Pro — 10% Target Share
              </span>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                Uncompromised frontier reasoning tier reserved for multi-jurisdiction compliance audits, mathematical proofs, financial stress-testing, and RAG synthesis. Protected by the 200k token cliff guard to avoid triggering doubled rate tiers.
              </p>
              <div className="flex gap-4 text-[11px] text-slate-400 pt-1">
                <span>P50 / P95: 1,200ms / 2,400ms</span>
                <span>·</span>
                <span>Cost / 1M: $2.00 / $12.00</span>
                <span>·</span>
                <span>Cliff Protection: Clamped at 199.5k tokens</span>
              </div>
            </div>
          )}

          {selectedArchStage === 'evals' && (
            <div className="space-y-1.5">
              <span className="text-emerald-400 font-bold block text-sm">
                Continuous Evaluation: Independent Pairwise Autorater
              </span>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                A 5% production sample is evaluated by an independent Tier 3 (Pro) FLAMe-aligned judge. Runs dual passes (A, B) and (B, A) to eradicate positional bias, and applies length-penalty scaling to ensure concise outputs aren&apos;t penalized against verbose responses.
              </p>
              <div className="flex gap-4 text-[11px] text-slate-400 pt-1">
                <span>Sampling Ratio: 5%</span>
                <span>·</span>
                <span>Axes: Grounding, IFEval, Coherence, Safety</span>
                <span>·</span>
                <span>Target Parity: &ge;98%</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Module Deep Dives (Interactive Launchpads) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Platform Modules &amp; Interactive Workbenches</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Explore the core engineering components built to evaluate, model, and monitor dynamic model routing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Router Playground */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Play className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-mono text-cyan-400">Workbench 01</span>
              </div>
              <h3 className="text-sm font-bold text-white">Router Playground &amp; Cascade</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Test custom or pre-loaded enterprise queries. Inspect real-time complexity score factors ($S$), SHA-256 cache hits, circuit breaker failovers, and the dynamic 200k Context Cliff Visualizer.
              </p>
            </div>
            <button
              onClick={() => onNavigate('playground')}
              className="flex items-center justify-between text-xs font-semibold text-cyan-400 hover:text-cyan-300 pt-2 border-t border-slate-800/80 cursor-pointer"
            >
              <span>Launch Router Playground</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 2: FinOps Calculator */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <DollarSign className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-mono text-emerald-400">Workbench 02</span>
              </div>
              <h3 className="text-sm font-bold text-white">FinOps Financial Calculus</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Model monthly query volumes (1M–50M), cache hit rates, and Gemini Batch API discounts (flat 50% off). Compare blended CPQ against frontier, mid-tier, and low-tier baselines.
              </p>
            </div>
            <button
              onClick={() => onNavigate('finops')}
              className="flex items-center justify-between text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-2 border-t border-slate-800/80 cursor-pointer"
            >
              <span>Open FinOps Calculator</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 3: Pairwise Autorater */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Scale className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-mono text-purple-400">Workbench 03</span>
              </div>
              <h3 className="text-sm font-bold text-white">Pairwise Continuous Autorater</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verify quality win-rate parity. Evaluates routed candidate against the frontier baseline using dual passes (A, B) and (B, A) to eradicate positional bias, applying verbosity normalization.
              </p>
            </div>
            <button
              onClick={() => onNavigate('autorater')}
              className="flex items-center justify-between text-xs font-semibold text-purple-400 hover:text-purple-300 pt-2 border-t border-slate-800/80 cursor-pointer"
            >
              <span>Launch Pairwise Autorater</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 4: Telemetry Dashboard */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Activity className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-mono text-blue-400">Workbench 04</span>
              </div>
              <h3 className="text-sm font-bold text-white">Telemetry &amp; SLA Monitor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recharts data visualization tracking Router Accuracy Index versus P95 Latency over 24h, 7d, and 30d. Monitor circuit breaker frequency and stream live 20-query simulated production bursts.
              </p>
            </div>
            <button
              onClick={() => onNavigate('telemetry')}
              className="flex items-center justify-between text-xs font-semibold text-blue-400 hover:text-blue-300 pt-2 border-t border-slate-800/80 cursor-pointer"
            >
              <span>Inspect Telemetry &amp; SLAs</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 5: Setup & Documentation */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-colors md:col-span-2 lg:col-span-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-mono text-cyan-400">Guide &amp; Runbook</span>
              </div>
              <h3 className="text-sm font-bold text-white">Setup Guide, API Schemas &amp; Runbook</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Comprehensive engineering documentation covering Quickstart setup, heuristic classifier algorithms, API schemas with interactive cURL, Python httpx, and TypeScript SDK examples, plus the Phase 1–3 enterprise rollout plan.
              </p>
            </div>
            <button
              onClick={() => onNavigate('docs')}
              className="flex items-center justify-between text-xs font-semibold text-cyan-400 hover:text-cyan-300 pt-2 border-t border-slate-800/80 cursor-pointer"
            >
              <span>Read Documentation &amp; Setup Guide</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Production Baseline Comparison Table */}
      <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-semibold text-slate-200">Production Baseline Spend Comparison (PRD §7.2)</span>
          <span className="text-slate-400">10M Queries/Month Baseline</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">Deployment Strategy</th>
                <th className="py-2.5 px-3 text-right">Cost / 1k</th>
                <th className="py-2.5 px-3 text-right">P95 Latency</th>
                <th className="py-2.5 px-3 text-right">Annual Spend</th>
                <th className="py-2.5 px-3 text-right">Net Savings</th>
                <th className="py-2.5 px-3 text-right">Quality Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Frontier Monolith (100% Gemini 3.1 Pro)</td>
                <td className="py-3 px-3 text-right tabular-nums">$6.60</td>
                <td className="py-3 px-3 text-right tabular-nums text-slate-400">2,400 ms</td>
                <td className="py-3 px-3 text-right tabular-nums text-slate-300">$792,000</td>
                <td className="py-3 px-3 text-right text-slate-500">Reference</td>
                <td className="py-3 px-3 text-right text-slate-400">100% Baseline</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-300">Mid-Tier Monolith (100% Gemini 3.5 Flash)</td>
                <td className="py-3 px-3 text-right tabular-nums">$4.95</td>
                <td className="py-3 px-3 text-right tabular-nums text-slate-400">850 ms</td>
                <td className="py-3 px-3 text-right tabular-nums text-slate-300">$594,000</td>
                <td className="py-3 px-3 text-right text-cyan-400 font-semibold tabular-nums">+25.0%</td>
                <td className="py-3 px-3 text-right text-slate-400">Partial Parity</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-300">Low-Tier Monolith (100% Flash-Lite)</td>
                <td className="py-3 px-3 text-right tabular-nums">$0.26</td>
                <td className="py-3 px-3 text-right tabular-nums text-slate-400">350 ms</td>
                <td className="py-3 px-3 text-right tabular-nums text-slate-300">$31,200</td>
                <td className="py-3 px-3 text-right text-amber-400 font-semibold tabular-nums">+96.1%</td>
                <td className="py-3 px-3 text-right text-amber-400">Regresses ~38%</td>
              </tr>
              <tr className="bg-cyan-950/20 font-semibold border-l-2 border-cyan-400">
                <td className="py-3 px-3 text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span>CascadeEval Dynamic Gateway</span>
                </td>
                <td className="py-3 px-3 text-right tabular-nums text-cyan-300 font-bold">$0.98</td>
                <td className="py-3 px-3 text-right tabular-nums text-white font-bold">480 ms</td>
                <td className="py-3 px-3 text-right tabular-nums text-emerald-400 font-bold">$117,600</td>
                <td className="py-3 px-3 text-right text-emerald-400 font-bold tabular-nums">+85.1%</td>
                <td className="py-3 px-3 text-right text-emerald-400 font-bold">&ge;98% Parity Maintained</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
