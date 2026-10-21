/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewLanding } from './components/OverviewLanding';
import { RouterPlayground } from './components/RouterPlayground';
import { FinOpsCalculator } from './components/FinOpsCalculator';
import { PairwiseAutorater } from './components/PairwiseAutorater';
import { TelemetryDashboard } from './components/TelemetryDashboard';
import { DocumentationView } from './components/DocumentationView';
import { ModelTier, RoutingDecision, ExecutionResult } from './types/gateway';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'playground' | 'finops' | 'autorater' | 'telemetry' | 'docs'>('overview');
  const [isInterviewMode, setIsInterviewMode] = useState<boolean>(false);
  const [quotaRemaining, setQuotaRemaining] = useState<number>(25);

  // Cross-tab state: passing playground query to autorater
  const [autoraterPrompt, setAutoraterPrompt] = useState<string>(
    'Refactor Python worker pool into asyncio with bounded semaphore'
  );
  const [autoraterCandidateA, setAutoraterCandidateA] = useState<string>(
    `async def worker_async(tasks, max_concurrency: int = 10):\n    semaphore = asyncio.Semaphore(max_concurrency)\n    async with httpx.AsyncClient() as client:\n        async def run_one(t):\n            async with semaphore:\n                return await client.post(t['url'], json=t['data'])\n        return await asyncio.gather(*[run_one(t) for t in tasks])`
  );
  const [autoraterTierA, setAutoraterTierA] = useState<ModelTier>('tier-2');

  const handleSendToAutorater = (prompt: string, candidateA: string, tierA: ModelTier) => {
    setAutoraterPrompt(prompt);
    setAutoraterCandidateA(candidateA);
    setAutoraterTierA(tierA);
    setActiveTab('autorater');
  };

  const handleQueryComplete = (decision: RoutingDecision, result: ExecutionResult) => {
    if (isInterviewMode && !result.isSimulated) {
      setQuotaRemaining((prev) => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* 3-Zone Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isInterviewMode={isInterviewMode}
        setIsInterviewMode={setIsInterviewMode}
        quotaRemaining={quotaRemaining}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Editorial Subtitle Strip (Shown across active tool views) */}
        {activeTab !== 'overview' && (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <span>Platform GA Specification</span>
                <span>·</span>
                <span>Google Cloud Vertex AI &amp; Gemini Architecture</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {activeTab === 'playground' && 'Router Playground & Execution Cascade'}
                {activeTab === 'finops' && 'FinOps Financial Calculus & Unit Economics'}
                {activeTab === 'autorater' && 'Continuous Pairwise Autorater & Judge'}
                {activeTab === 'telemetry' && 'Gateway Telemetry, Latency SLAs & Accuracy'}
                {activeTab === 'docs' && 'Developer Setup, API Reference & Rollout Runbook'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
                {activeTab === 'playground' && 'Test live query complexity scoring, inspect rule bypasses, SHA-256 context caching, and real-time context cliff truncation.'}
                {activeTab === 'finops' && 'Model blended cost-per-query (CPQ) across query volumes, cache hit rates, and Gemini Batch API discounts.'}
                {activeTab === 'autorater' && 'Independent frontier judge evaluating candidate outputs with positional swap consensus and length normalization.'}
                {activeTab === 'telemetry' && 'Recharts performance trends, P50/P95/P99 latency budgets, and real-time query stream logs.'}
                {activeTab === 'docs' && 'Complete technical documentation for running, integrating, and deploying CascadeEval in production.'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
              <span className="text-slate-500">Tier Matrix:</span>
              <span className="text-cyan-400 font-semibold">T1 Flash-Lite</span>
              <span className="text-slate-600">·</span>
              <span className="text-blue-400 font-semibold">T2 3.5 Flash</span>
              <span className="text-slate-600">·</span>
              <span className="text-purple-400 font-semibold">T3 3.1 Pro</span>
            </div>
          </div>
        )}

        {/* Tab Viewport */}
        {activeTab === 'overview' && (
          <OverviewLanding
            onNavigate={(tab) => setActiveTab(tab)}
            onToggleInterviewMode={() => setIsInterviewMode(!isInterviewMode)}
            isInterviewMode={isInterviewMode}
          />
        )}

        {activeTab === 'playground' && (
          <RouterPlayground
            isInterviewMode={isInterviewMode}
            onSendToAutorater={handleSendToAutorater}
            onQueryComplete={handleQueryComplete}
          />
        )}

        {activeTab === 'finops' && <FinOpsCalculator />}

        {activeTab === 'autorater' && (
          <PairwiseAutorater
            initialPrompt={autoraterPrompt}
            initialCandidateA={autoraterCandidateA}
            initialTierA={autoraterTierA}
            isInterviewMode={isInterviewMode}
          />
        )}

        {activeTab === 'telemetry' && <TelemetryDashboard />}

        {activeTab === 'docs' && <DocumentationView />}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12 text-center text-xs text-slate-500 font-mono">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <span>CascadeEval Enterprise Gateway Engine</span>
            <span className="mx-2 text-slate-700">·</span>
            <span>FinOps Steering Committee &amp; Applied AI Core Infrastructure</span>
          </div>
          <div className="text-slate-400">
            Target Release: Q1 2027 Internal Alpha / Q2 2027 Platform GA
          </div>
        </div>
      </footer>
    </div>
  );
}
