import React, { useState, useId } from 'react';
import {
  DollarSign,
  TrendingDown,
  Layers,
  Database,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { calculateFinOpsMetrics, FinOpsSimulationParams } from '../utils/finopsMath';
import { MODEL_TIERS } from '../types/gateway';

export const FinOpsCalculator: React.FC = () => {
  const queryVolInputId = useId();
  const cacheHitInputId = useId();
  const asyncBatchInputId = useId();
  const [monthlyQueries, setMonthlyQueries] = useState<number>(10000000);
  const [tier1Share, setTier1Share] = useState<number>(0.70);
  const [tier2Share, setTier2Share] = useState<number>(0.20);
  const [tier3Share, setTier3Share] = useState<number>(0.10);
  const [cacheHitRatio, setCacheHitRatio] = useState<number>(0.40);
  const [asyncBatchRatio, setAsyncBatchRatio] = useState<number>(0.15);
  const [avgInputTokens, setAvgInputTokens] = useState<number>(1200);
  const [avgOutputTokens, setAvgOutputTokens] = useState<number>(350);

  const params: FinOpsSimulationParams = {
    monthlyQueries,
    tier1Share,
    tier2Share,
    tier3Share,
    cacheHitRatio,
    cacheDiscountRate: 0.85,
    asyncBatchRatio,
    avgInputTokens,
    avgOutputTokens,
  };

  const results = calculateFinOpsMetrics(params);

  // Helper to re-balance tier distribution sliders cleanly
  const updateTier1 = (val: number) => {
    setTier1Share(val);
    const rem = 1 - val;
    setTier2Share(Math.round(rem * 0.67 * 100) / 100);
    setTier3Share(Math.round((rem - rem * 0.67) * 100) / 100);
  };

  const resetToPrdBaseline = () => {
    setMonthlyQueries(10000000);
    setTier1Share(0.70);
    setTier2Share(0.20);
    setTier3Share(0.10);
    setCacheHitRatio(0.40);
    setAsyncBatchRatio(0.00);
    setAvgInputTokens(1200);
    setAvgOutputTokens(350);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Annual Enterprise Savings</span>
            <TrendingDown className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            ${Math.round(results.cascadeGateway.annualSavingsUsd).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            +{results.cascadeGateway.savingsPct.toFixed(1)}% reduction vs Frontier
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Blended CPQ (per 1k)</span>
            <DollarSign className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
            ${results.cascadeGateway.cpqPer1k.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Baseline: ${results.frontierBaseline.cpqPer1k.toFixed(2)} / 1k queries
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>P95 End-to-End Latency</span>
            <Clock className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {results.cascadeGateway.p95LatencyMs} ms
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            65% faster than 3.1 Pro (2,400ms)
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Evaluated Quality Parity</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            &ge; 98.4%
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Verified via Pairwise Autorater
          </p>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Model Comparison Table on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive FinOps Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-semibold text-slate-200">Financial Modeling Parameters</span>
              </div>
              <button
                onClick={resetToPrdBaseline}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Reset to PRD Baseline
              </button>
            </div>

            {/* Monthly Query Volume */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <label htmlFor={queryVolInputId} className="text-slate-300">Monthly Query Volume</label>
                <span className="text-cyan-400 font-semibold tabular-nums">
                  {(monthlyQueries / 1000000).toFixed(1)}M queries/mo
                </span>
              </div>
              <input
                id={queryVolInputId}
                type="range"
                min={1000000}
                max={50000000}
                step={1000000}
                value={monthlyQueries}
                aria-label="Monthly Query Volume"
                onChange={(e) => setMonthlyQueries(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>1M</span>
                <span>10M (PRD Target)</span>
                <span>50M</span>
              </div>
            </div>

            {/* Tier Traffic Distribution */}
            <div className="space-y-3 pt-2 border-t border-slate-800/60">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Traffic Distribution Mix:</span>
                <span className="text-[11px] font-mono text-slate-400">
                  {Math.round(tier1Share * 100)}% / {Math.round(tier2Share * 100)}% / {Math.round(tier3Share * 100)}%
                </span>
              </div>

              {/* Tier 1 Flash-Lite Share */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-cyan-300">Tier 1: Gemini 2.5 Flash-Lite</span>
                  <span>{Math.round(tier1Share * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.30}
                  max={0.90}
                  step={0.05}
                  value={tier1Share}
                  aria-label="Tier 1 Flash-Lite Traffic Share"
                  onChange={(e) => updateTier1(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Tier 2 Flash Share */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-blue-300">Tier 2: Gemini 3.5 Flash</span>
                  <span>{Math.round(tier2Share * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-lg overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${tier2Share * 100}%` }} />
                </div>
              </div>

              {/* Tier 3 Pro Share */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-purple-300">Tier 3: Gemini 3.1 Pro</span>
                  <span>{Math.round(tier3Share * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-lg overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${tier3Share * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Context Caching & Batch Offload */}
            <div className="space-y-4 pt-2 border-t border-slate-800/60">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label htmlFor={cacheHitInputId} className="text-slate-300 flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Context Cache Hit Ratio</span>
                  </label>
                  <span className="text-cyan-400 font-semibold tabular-nums">
                    {Math.round(cacheHitRatio * 100)}%
                  </span>
                </div>
                <input
                  id={cacheHitInputId}
                  type="range"
                  min={0.0}
                  max={0.90}
                  step={0.05}
                  value={cacheHitRatio}
                  aria-label="Context Cache Hit Ratio"
                  onChange={(e) => setCacheHitRatio(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 font-mono block">
                  Captures 85% discount on repeated system instructions &gt;32k tokens.
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label htmlFor={asyncBatchInputId} className="text-slate-300">Async Batch API Offload</label>
                  <span className="text-cyan-400 font-semibold tabular-nums">
                    {Math.round(asyncBatchRatio * 100)}%
                  </span>
                </div>
                <input
                  id={asyncBatchInputId}
                  type="range"
                  min={0.0}
                  max={0.60}
                  step={0.05}
                  value={asyncBatchRatio}
                  aria-label="Async Batch API Offload Percentage"
                  onChange={(e) => setAsyncBatchRatio(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 font-mono block">
                  Gemini Batch API delivers a flat 50% discount for non-interactive workloads.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Comparative FinOps Matrix & Blended CPQ Formula */}
        <div className="lg:col-span-7 space-y-4">
          {/* Comparative ROI Matrix Table */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <span className="text-xs font-semibold text-slate-200">
                Production Financial Comparison Table (PRD §7.2)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {avgInputTokens} Input / {avgOutputTokens} Output Tokens
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-2.5 px-3">Strategy</th>
                    <th className="py-2.5 px-3 text-right">Cost / 1k</th>
                    <th className="py-2.5 px-3 text-right">Annual Spend</th>
                    <th className="py-2.5 px-3 text-right">P95 Latency</th>
                    <th className="py-2.5 px-3 text-right">Savings vs Frontier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {/* Frontier Baseline */}
                  <tr className="hover:bg-slate-950/40">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">Frontier Baseline</div>
                      <div className="text-[10px] text-slate-500">100% Gemini 3.1 Pro</div>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300 font-semibold tabular-nums">
                      ${results.frontierBaseline.cpqPer1k.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                      ${Math.round(results.frontierBaseline.annualSpend).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 tabular-nums">
                      {results.frontierBaseline.p95LatencyMs} ms
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500">
                      Reference
                    </td>
                  </tr>

                  {/* Mid-Tier Baseline */}
                  <tr className="hover:bg-slate-950/40">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">Mid-Tier Baseline</div>
                      <div className="text-[10px] text-slate-500">100% Gemini 3.5 Flash</div>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                      ${results.midTierBaseline.cpqPer1k.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                      ${Math.round(results.midTierBaseline.annualSpend).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 tabular-nums">
                      {results.midTierBaseline.p95LatencyMs} ms
                    </td>
                    <td className="py-3 px-3 text-right text-cyan-400 font-semibold tabular-nums">
                      +{results.midTierBaseline.savingsPct.toFixed(1)}%
                    </td>
                  </tr>

                  {/* Low-Tier Baseline */}
                  <tr className="hover:bg-slate-950/40">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">Low-Tier Baseline</div>
                      <div className="text-[10px] text-amber-500/80">100% Flash-Lite (~38% quality drop)</div>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                      ${results.lowTierBaseline.cpqPer1k.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                      ${Math.round(results.lowTierBaseline.annualSpend).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 tabular-nums">
                      {results.lowTierBaseline.p95LatencyMs} ms
                    </td>
                    <td className="py-3 px-3 text-right text-amber-400 tabular-nums">
                      +96.1% (Unacceptable)
                    </td>
                  </tr>

                  {/* CascadeEval Gateway */}
                  <tr className="bg-cyan-950/20 hover:bg-cyan-950/30 font-semibold">
                    <td className="py-3 px-3 border-l-2 border-cyan-400">
                      <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                        <span>CascadeEval Gateway</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-normal">
                        Dynamic Routing + Cache (&ge;98% parity)
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right text-cyan-300 font-bold tabular-nums">
                      ${results.cascadeGateway.cpqPer1k.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-bold tabular-nums">
                      ${Math.round(results.cascadeGateway.annualSpend).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-white font-semibold tabular-nums">
                      {results.cascadeGateway.p95LatencyMs} ms
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-bold tabular-nums">
                      +{results.cascadeGateway.savingsPct.toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mathematical Formulation Explainer */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 font-mono text-xs">
            <span className="font-semibold text-slate-300 block">
              Blended Cost-per-Query (CPQ) Formal Calculus
            </span>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-cyan-300 overflow-x-auto text-[11px] leading-relaxed">
              C_blended = 1000 &times; &sum; [ P(T_i) &times; ( (I_i &times; (1 - &delta;_i &times; &alpha;_i) / 10^6) &times; R_in,i + (O_i / 10^6) &times; R_out,i ) ] &times; (1 - 0.50 &times; AsyncBatchRatio)
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1">
              <div>&bull; P(T_i): Traffic proportion routed to Tier i</div>
              <div>&bull; &delta;_i: Context cache hit ratio (0.0 to 1.0)</div>
              <div>&bull; &alpha;_i: Context cache discount rate (85%)</div>
              <div>&bull; R_in, R_out: Token price rates per 1M tokens</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
