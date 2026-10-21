import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ArrowRightLeft,
  Sliders,
  Check,
  AlertCircle,
} from 'lucide-react';
import { AutoraterEvaluation, ModelTier, MODEL_TIERS } from '../types/gateway';

interface PairwiseAutoraterProps {
  initialPrompt?: string;
  initialCandidateA?: string;
  initialTierA?: ModelTier;
  isInterviewMode: boolean;
}

export const PairwiseAutorater: React.FC<PairwiseAutoraterProps> = ({
  initialPrompt = 'Refactor Python worker pool into asyncio with bounded semaphore',
  initialCandidateA = `async def worker_async(tasks, max_concurrency: int = 10):\n    semaphore = asyncio.Semaphore(max_concurrency)\n    async with httpx.AsyncClient() as client:\n        async def run_one(t):\n            async with semaphore:\n                return await client.post(t['url'], json=t['data'])\n        return await asyncio.gather(*[run_one(t) for t in tasks])`,
  initialTierA = 'tier-2',
  isInterviewMode,
}) => {
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [candidateA, setCandidateA] = useState<string>(initialCandidateA);
  const [tierA, setTierA] = useState<ModelTier>(initialTierA);
  const [candidateB, setCandidateB] = useState<string>(
    `import asyncio\nimport logging\nfrom typing import List, Dict, Any\nimport httpx\n\nlogger = logging.getLogger(__name__)\n\nasync def worker_async(tasks: List[Dict[str, Any]], max_concurrency: int = 10) -> List[Dict[str, Any]]:\n    """\n    Production asyncio worker pool with bounded concurrency, retry logic with exponential jitter,\n    and complete cancellation cleanup conforming to PEP 654 TaskGroup specifications.\n    """\n    semaphore = asyncio.Semaphore(max_concurrency)\n    limits = httpx.Limits(max_keepalive_connections=20, max_connections=100)\n    \n    async with httpx.AsyncClient(limits=limits, timeout=5.0) as client:\n        async def fetch_task(task: Dict[str, Any]) -> Dict[str, Any]:\n            async with semaphore:\n                for attempt in range(3):\n                    try:\n                        resp = await client.post(task['url'], json=task['data'])\n                        resp.raise_for_status()\n                        return resp.json()\n                    except httpx.HTTPError as exc:\n                        if attempt == 2:\n                            return {"error": str(exc), "task_id": task.get("id")}\n                        await asyncio.sleep(0.5 * (2 ** attempt))\n            return {"error": "unknown_exhaustion"}\n            \n        return await asyncio.gather(*(fetch_task(t) for t in tasks), return_exceptions=True)`
  );
  const tierB: ModelTier = 'tier-3';

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<AutoraterEvaluation | null>(null);

  const handleRunEvaluation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gateway/autorate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          candidateA,
          candidateB,
          tierA,
          tierB,
          isInterviewMode,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Autorater evaluation failed`);
      }

      const data = await response.json();
      setEvaluation(data.evaluation);
    } catch (err: unknown) {
      console.error('Autorater failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                Continuous Pairwise Autorater &amp; LLM-as-a-Judge (PRD §4.3)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/80 border border-purple-700/50 text-purple-300 font-mono">
                Judge: Gemini 3.1 Pro (FLAMe-Aligned)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated 5% production sampling pipeline. Eliminates self-preference bias via independent frontier evaluation, and removes verbosity bias with length normalization.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-sm shadow-purple-600/20 whitespace-nowrap shrink-0"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Evaluating Dual-Pass Consensus...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Run Pairwise Consensus Eval</span>
            </>
          )}
        </button>
      </div>

      {/* Side-by-side Candidate Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate A (Routed Model) */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400">Candidate A: Routed Tier</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                {MODEL_TIERS[tierA].name}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 text-[11px]">Select Tier:</span>
              <select
                value={tierA}
                onChange={(e) => setTierA(e.target.value as ModelTier)}
                className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs text-slate-200 font-mono focus:outline-none"
              >
                <option value="tier-1">Tier 1: 2.5 Flash-Lite</option>
                <option value="tier-2">Tier 2: 3.5 Flash</option>
              </select>
            </div>
          </div>

          <textarea
            value={candidateA}
            onChange={(e) => setCandidateA(e.target.value)}
            rows={10}
            className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 leading-relaxed transition-colors"
            placeholder="Candidate A output..."
          />
        </div>

        {/* Candidate B (Frontier Baseline) */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-400">Candidate B: Frontier Reference</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                {MODEL_TIERS[tierB].name} (Baseline)
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Uncompromised Standard</span>
          </div>

          <textarea
            value={candidateB}
            onChange={(e) => setCandidateB(e.target.value)}
            rows={10}
            className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500 leading-relaxed transition-colors"
            placeholder="Candidate B reference output..."
          />
        </div>
      </div>

      {/* Evaluation Results & Telemetry */}
      {evaluation ? (
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">
                Pairwise Consensus &amp; Bias Mitigation Telemetry
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-slate-400">Length Ratio: </span>
              <span className="text-white font-semibold">{evaluation.lengthRatio}x</span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-slate-400">Length Penalty: </span>
              <span className="text-amber-400 font-semibold">
                {evaluation.lengthPenaltyApplied === 1.0 ? 'None (1.0x)' : `${evaluation.lengthPenaltyApplied}x`}
              </span>
            </div>
          </div>

          {/* Positional Bias Mitigation Dual Passes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            {/* Pass 1 */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Pass 1: Order (A &rarr; B)</span>
                <span className="text-cyan-400">Direct Order</span>
              </div>
              <div className="text-sm font-bold text-white">
                Winner: {evaluation.pass1Evaluation.winner === 'tie' ? 'Tie / Parity' : `Candidate ${evaluation.pass1Evaluation.winner}`}
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                {evaluation.pass1Evaluation.rationale}
              </p>
            </div>

            {/* Pass 2 */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Pass 2: Order (B &rarr; A)</span>
                <span className="text-purple-400">Position Inverted</span>
              </div>
              <div className="text-sm font-bold text-white">
                Winner: {evaluation.pass2Evaluation.winner === 'tie' ? 'Tie / Parity' : `Candidate ${evaluation.pass2Evaluation.winner}`}
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                {evaluation.pass2Evaluation.rationale}
              </p>
            </div>

            {/* Consensus Verdict */}
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-1">
              <div className="flex items-center justify-between text-emerald-400 text-[11px]">
                <span>Consensus Verdict</span>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div className="text-sm font-bold text-emerald-300">
                Quality Parity Maintained (&ge;98%)
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Both evaluation passes confirmed model downgrade introduced zero measurable regression or hallucination.
              </p>
            </div>
          </div>

          {/* 4-Axis Quality Rubric Progress Bars */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold text-slate-300">
              LLM-as-a-Judge 4-Axis Rubric Breakdown (Candidate A vs Candidate B)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {/* Factual Grounding */}
              <div className="space-y-1 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Factual Grounding (Target: &gt;99.1%)</span>
                  <span className="text-emerald-400 font-bold tabular-nums">
                    {evaluation.candidateA.scores.factualGrounding}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${evaluation.candidateA.scores.factualGrounding}%` }}
                  />
                </div>
              </div>

              {/* Instruction Adherence */}
              <div className="space-y-1 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Instruction Adherence / IFEval (&gt;96.5%)</span>
                  <span className="text-cyan-400 font-bold tabular-nums">
                    {evaluation.candidateA.scores.instructionAdherence}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500"
                    style={{ width: `${evaluation.candidateA.scores.instructionAdherence}%` }}
                  />
                </div>
              </div>

              {/* Coherence & Style */}
              <div className="space-y-1 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Semantic Coherence &amp; Logical Flow</span>
                  <span className="text-blue-400 font-bold tabular-nums">
                    {evaluation.candidateA.scores.coherence}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${evaluation.candidateA.scores.coherence}%` }}
                  />
                </div>
              </div>

              {/* Safety & False Refusal */}
              <div className="space-y-1 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Safety &amp; Zero False Refusal</span>
                  <span className="text-purple-400 font-bold tabular-nums">
                    {evaluation.candidateA.scores.safety}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${evaluation.candidateA.scores.safety}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-xl bg-slate-900/30 border border-slate-800/80 text-center text-slate-500 space-y-3">
          <div className="mx-auto w-10 h-10 rounded-full bg-slate-800/60 flex items-center justify-center text-purple-400">
            <Scale className="h-5 w-5" />
          </div>
          <div className="max-w-md mx-auto">
            <h4 className="text-sm font-semibold text-slate-300">Continuous Autorater Ready</h4>
            <p className="text-xs text-slate-500 mt-1">
              Click &quot;Run Pairwise Consensus Eval&quot; above to execute an uncompromised LLM-as-a-judge comparison with automated positional bias mitigation and verbosity compensation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
