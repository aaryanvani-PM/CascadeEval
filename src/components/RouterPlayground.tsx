import React, { useState, useEffect } from 'react';
import {
  Play,
  Copy,
  Check,
  AlertTriangle,
  Database,
  ArrowRight,
  Sparkles,
  RefreshCw,
  GitFork,
  DollarSign,
  Gauge,
  SlidersHorizontal,
} from 'lucide-react';
import {
  GatewayPayload,
  RoutingDecision,
  ExecutionResult,
  ModelTier,
  MODEL_TIERS,
} from '../types/gateway';
import { ENTERPRISE_PRESETS } from '../utils/presets';

interface RouterPlaygroundProps {
  isInterviewMode: boolean;
  onSendToAutorater: (prompt: string, candidateA: string, tierA: ModelTier) => void;
  onQueryComplete: (decision: RoutingDecision, result: ExecutionResult) => void;
}

export const RouterPlayground: React.FC<RouterPlaygroundProps> = ({
  isInterviewMode,
  onSendToAutorater,
  onQueryComplete,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-extraction');
  const [prompt, setPrompt] = useState<string>('');
  const [systemInstruction, setSystemInstruction] = useState<string>('');
  const [schemaConstraint, setSchemaConstraint] = useState<string>('');
  const [contextPayload, setContextPayload] = useState<string>('');
  const [executionMode, setExecutionMode] = useState<'sync' | 'async-batch'>('sync');
  const [simulateRateLimit, setSimulateRateLimit] = useState<boolean>(false);
  const [simulateSchemaError, setSimulateSchemaError] = useState<boolean>(false);
  const [targetOverride, setTargetOverride] = useState<ModelTier | ''>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [decision, setDecision] = useState<RoutingDecision | null>(null);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load initial preset
  useEffect(() => {
    loadPreset('preset-extraction');
  }, []);

  const loadPreset = (presetId: string) => {
    const found = ENTERPRISE_PRESETS.find(p => p.id === presetId);
    if (!found) return;
    setSelectedPresetId(presetId);
    setPrompt(found.prompt);
    setSystemInstruction(found.systemInstruction || '');
    setSchemaConstraint(found.schemaConstraint || '');
    setContextPayload(found.contextPayload || '');
    setExecutionMode(found.executionMode || 'sync');
    setSimulateRateLimit(false);
    setSimulateSchemaError(false);
    setTargetOverride('');
    setErrorMessage(null);
  };

  // Interactive simulated token offset for instant slider exploration
  const [simulatedTokenBoost, setSimulatedTokenBoost] = useState<number>(0);

  // Estimate current token volume for context cliff calculation
  const isCliffScenario = selectedPresetId === 'preset-context-cliff';
  const baseTokens = isCliffScenario
    ? 218500
    : Math.round((prompt.length + (contextPayload?.length || 0) + (systemInstruction?.length || 0)) / 3.8);

  const rawTokenEstimate = Math.max(120, baseTokens + simulatedTokenBoost);

  // Thresholds: Approaching Warning at 160k tokens, Hard Cliff at 200k tokens
  const isApproachingCliff = rawTokenEstimate >= 160000;
  const isAboveCliff = rawTokenEstimate >= 200000;
  const prunedTokens = isAboveCliff ? rawTokenEstimate - 199500 : 0;
  const clampedTokens = isAboveCliff ? 199500 : rawTokenEstimate;

  const handleExecute = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    // If boosted above 180k, inject simulation indicator into context payload
    let effectiveContext = contextPayload;
    if (simulatedTokenBoost > 0 || isCliffScenario) {
      effectiveContext = `[SIMULATED_CONTEXT_SCALE: ${rawTokenEstimate} tokens]\n${contextPayload || ''}`;
    }

    const payload: GatewayPayload = {
      prompt,
      systemInstruction: systemInstruction || undefined,
      schemaConstraint: schemaConstraint || undefined,
      contextPayload: effectiveContext || undefined,
      executionMode,
      targetOverride: targetOverride ? targetOverride : undefined,
      isInterviewMode,
      simulateRateLimit,
      simulateSchemaError,
    };

    try {
      const response = await fetch('/api/gateway/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to route query`);
      }

      const data = await response.json();
      setDecision(data.decision);
      setResult(data.result);
      onQueryComplete(data.decision, data.result);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Routing gateway execution failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyOutput = () => {
    if (!result?.output) return;
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Enterprise Workload Presets Strip */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Enterprise Workload Archetypes</span>
          <span>Click to load production queries calibrated to specific routing tiers</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {ENTERPRISE_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setSimulatedTokenBoost(0);
                  loadPreset(preset.id);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all text-left flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-500/60 text-cyan-300 shadow-sm shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span>{preset.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-400 font-mono">
                  {MODEL_TIERS[preset.expectedTier].name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-Time Context Truncation Alert & 200k Token Cliff Visualizer */}
      <div
        className={`p-4 rounded-xl border transition-all duration-300 ${
          isApproachingCliff
            ? 'bg-gradient-to-b from-orange-950/30 to-amber-950/20 border-orange-500/60 shadow-lg shadow-orange-950/20'
            : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5">
            <div
              className={`p-2 rounded-lg transition-colors ${
                isApproachingCliff
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  : 'bg-slate-800 text-cyan-400'
              }`}
            >
              <Gauge className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {isApproachingCliff ? 'Context Truncation Alert' : 'Context Cliff Guard'}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                    isAboveCliff
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 animate-pulse'
                      : isApproachingCliff
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  {isAboveCliff
                    ? 'PRUNING ACTIVE · 199.5k CLAMPED'
                    : isApproachingCliff
                    ? 'APPROACHING CLIFF (>160k)'
                    : 'NOMINAL (<160k)'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isApproachingCliff ? (
                  <span className="text-orange-200/90 font-medium">
                    Critical Threshold: Gemini 3.1 Pro pricing escalates 2&times; from $2.00 to $4.00/1M tokens if input exceeds 200k tokens.
                  </span>
                ) : (
                  <span>
                    Monitors input token ceiling. Automatically prunes conversational drift prior to triggering the 200,000-token pricing cliff.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Quick Simulation Token Booster */}
          <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg p-1.5">
              <span className="text-[11px] text-slate-500 pl-1">Simulate Context:</span>
              <button
                type="button"
                onClick={() => setSimulatedTokenBoost(0)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  rawTokenEstimate < 160000 && simulatedTokenBoost === 0
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                12k Normal
              </button>
              <button
                type="button"
                onClick={() => setSimulatedTokenBoost(165000)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  rawTokenEstimate >= 160000 && rawTokenEstimate < 200000
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                175k Warning
              </button>
              <button
                type="button"
                onClick={() => setSimulatedTokenBoost(218500)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  rawTokenEstimate >= 200000
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                218k Overshoot
              </button>
            </div>

            <div className="text-right">
              <span className="text-slate-400 text-[11px]">Input Volume: </span>
              <span
                className={`font-bold tabular-nums text-sm ${
                  isApproachingCliff ? 'text-orange-400' : 'text-cyan-400'
                }`}
              >
                {rawTokenEstimate.toLocaleString()}
              </span>
              <span className="text-slate-500 text-[11px]"> tokens</span>
            </div>
          </div>
        </div>

        {/* Dynamic Status Bar (Turns Vibrant Orange when approaching / exceeding cliff) */}
        <div className="mt-3.5 space-y-1.5">
          <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex relative border border-slate-800">
            {/* Safe Zone (0 - 160k) */}
            <div
              className={`h-full transition-all duration-300 ${
                isApproachingCliff ? 'bg-orange-500' : 'bg-cyan-500'
              }`}
              style={{
                width: `${Math.min(100, (rawTokenEstimate / 220000) * 100)}%`,
              }}
            />
            {/* Cliff Boundary Marker Line at 200k (200/220 = 90.9%) */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500/80 z-10"
              style={{ left: '90.9%' }}
              title="200,000 Token Pricing Cliff"
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-slate-500">0</span>
            <span className="text-slate-500">80k</span>
            <span className="text-slate-400">160k (Threshold Warning)</span>
            <span className="text-orange-400 font-bold flex items-center gap-1">
              <span>&uarr; 200,000 Pricing Cliff</span>
            </span>
          </div>
        </div>

        {/* Dynamic Illustrated History Pruning Breakdown */}
        {isApproachingCliff && (
          <div className="mt-4 pt-3.5 border-t border-orange-500/30 space-y-3">
            <div className="flex items-start gap-2.5 text-xs text-orange-200">
              <AlertTriangle className="h-4 w-4 shrink-0 text-orange-400 mt-0.5" />
              <div>
                <strong className="text-orange-300">Gateway Conversational Pruner Engaged:</strong>{' '}
                Raw payload of <span className="font-mono font-bold text-white">{rawTokenEstimate.toLocaleString()} tokens</span> exceeds the 200k threshold. To prevent doubling input costs from $2.00 to $4.00 per 1M tokens, the gateway actively prunes redundant conversational turns.
              </div>
            </div>

            {/* Visual History Pruning Diagram */}
            <div className="p-3 rounded-lg bg-slate-950/90 border border-orange-500/30 grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">1. Inbound Unpruned Context</span>
                <span className="text-rose-400 font-bold tabular-nums text-sm">
                  {rawTokenEstimate.toLocaleString()} tokens
                </span>
                <span className="text-[10px] text-rose-300/80 block mt-0.5">
                  Escalated Rate: $4.00 / 1M tokens
                </span>
              </div>

              <div className="p-2 rounded bg-orange-950/40 border border-orange-500/40">
                <span className="text-[10px] text-orange-400 block">2. Drift Pruned by Gateway</span>
                <span className="text-orange-300 font-bold tabular-nums text-sm">
                  {prunedTokens > 0 ? `-${prunedTokens.toLocaleString()}` : '0 (Safety Buffer)'} tokens
                </span>
                <span className="text-[10px] text-orange-300/80 block mt-0.5">
                  Earliest dialogue turns truncated
                </span>
              </div>

              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/40">
                <span className="text-[10px] text-emerald-400 block">3. Clamped Active Window</span>
                <span className="text-emerald-300 font-bold tabular-nums text-sm">
                  {clampedTokens.toLocaleString()} tokens
                </span>
                <span className="text-[10px] text-emerald-300/80 block mt-0.5">
                  Preserves Base Rate: $2.00 / 1M tokens
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Split-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Request Configuration */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <span className="text-xs font-semibold text-slate-200">Incoming API Request Payload</span>
              <span className="text-[11px] font-mono text-slate-400">
                Mode: {executionMode === 'sync' ? 'Real-Time Sync' : 'Async Batch (50% Off)'}
              </span>
            </div>

            {/* Prompt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">Prompt / Task Query</label>
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <span className={isApproachingCliff ? 'text-orange-400 font-semibold' : 'text-slate-500'}>
                    Tokens: {rawTokenEstimate.toLocaleString()}
                  </span>
                  {isApproachingCliff && (
                    <span className="text-orange-300 font-bold bg-orange-950/80 border border-orange-500/40 px-1.5 py-0.5 rounded">
                      Truncation Guard Active
                    </span>
                  )}
                </div>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className={`w-full rounded-lg bg-slate-950 border p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono transition-colors ${
                  isApproachingCliff
                    ? 'border-orange-500/50 focus:border-orange-400'
                    : 'border-slate-800 focus:border-cyan-500'
                }`}
                placeholder="Enter user prompt or select an enterprise preset..."
              />
            </div>

            {/* System Instruction */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">System Instruction</label>
              <input
                type="text"
                value={systemInstruction}
                onChange={(e) => setSystemInstruction(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                placeholder="System instructions for the model..."
              />
            </div>

            {/* Schema Constraint (JSON) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">Schema Constraint (JSON)</label>
                <span className="text-[10px] text-slate-500 font-mono">Bypasses complexity to Tier 1 if compact</span>
              </div>
              <textarea
                value={schemaConstraint}
                onChange={(e) => setSchemaConstraint(e.target.value)}
                rows={3}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs text-cyan-200/90 font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="Optional JSON schema..."
              />
            </div>

            {/* Context Payload & SHA-256 Fingerprint */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">Document Context &amp; Reference</label>
                <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                  <Database className="h-3 w-3" /> SHA-256 Context Caching
                </span>
              </div>
              <textarea
                value={contextPayload}
                onChange={(e) => setContextPayload(e.target.value)}
                rows={2}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs text-slate-300 font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="Attach large reference manual or conversation logs (>32k tokens trigger 85% cache discount)..."
              />
            </div>

            {/* Gateway Controls & Failover Testing */}
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">Execution Mode:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExecutionMode('sync')}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      executionMode === 'sync'
                        ? 'bg-slate-800 border-cyan-500/50 text-cyan-300'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    Sync Real-Time
                  </button>
                  <button
                    onClick={() => setExecutionMode('async-batch')}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      executionMode === 'async-batch'
                        ? 'bg-slate-800 border-cyan-500/50 text-cyan-300'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    Async Batch (50% Off)
                  </button>
                </div>
              </div>

              {/* Circuit Breaker & Fallback Simulator */}
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400" />
                    Failover Circuit Breaker Testing (PRD §6)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={simulateRateLimit}
                      onChange={(e) => setSimulateRateLimit(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                    />
                    <span>Simulate Upstream 429</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={simulateSchemaError}
                      onChange={(e) => setSimulateSchemaError(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                    />
                    <span>Simulate Schema Violation</span>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                onClick={handleExecute}
                disabled={isLoading || !prompt.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-600/20 transition-all"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Evaluating Query Complexity &amp; Routing...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    <span>Route &amp; Execute Query via CascadeEval</span>
                  </>
                )}
              </button>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Cascade Inspector & Execution Telemetry */}
        <div className="lg:col-span-6 space-y-4">
          {decision ? (
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    Routing Decision &amp; Cascade Telemetry
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">
                  Gateway Overhead: {decision.gatewayOverheadMs} ms (&lt;25ms SLA)
                </span>
              </div>

              {/* Classifier Radar / Score breakdown */}
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Semantic Complexity Score (S):</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-cyan-400 tabular-nums">
                      {decision.complexityScore.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">/ 1.00</span>
                  </div>
                </div>

                {decision.ruleBypassApplied ? (
                  <div className="p-2 rounded bg-cyan-950/30 border border-cyan-800/40 text-[11px] font-mono text-cyan-300">
                    ⚡ {decision.ruleBypassApplied}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                    <div className="flex justify-between p-1.5 rounded bg-slate-900/60">
                      <span>Reasoning:</span>
                      <span className="text-slate-200">{decision.factors.reasoningIntensity.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between p-1.5 rounded bg-slate-900/60">
                      <span>Domain Hardness:</span>
                      <span className="text-slate-200">{decision.factors.domainDifficulty.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between p-1.5 rounded bg-slate-900/60">
                      <span>Constraints:</span>
                      <span className="text-slate-200">{decision.factors.constraintDensity.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between p-1.5 rounded bg-slate-900/60">
                      <span>Entropy / Tokens:</span>
                      <span className="text-slate-200">{decision.factors.entropy.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Tier Banner */}
              <div
                className="p-3.5 rounded-lg border flex items-center justify-between"
                style={{
                  backgroundColor: `${MODEL_TIERS[result?.actualTier || decision.selectedTier].color}10`,
                  borderColor: `${MODEL_TIERS[result?.actualTier || decision.selectedTier].color}40`,
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold"
                      style={{ color: MODEL_TIERS[result?.actualTier || decision.selectedTier].color }}
                    >
                      {MODEL_TIERS[result?.actualTier || decision.selectedTier].name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 text-slate-300 font-mono">
                      {MODEL_TIERS[result?.actualTier || decision.selectedTier].apiModel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {MODEL_TIERS[result?.actualTier || decision.selectedTier].headline}
                  </p>
                </div>

                <div className="text-right font-mono text-[11px]">
                  <span className="text-slate-400">P95 SLA: </span>
                  <span className="text-white font-semibold">
                    {MODEL_TIERS[result?.actualTier || decision.selectedTier].p95LatencyMs} ms
                  </span>
                </div>
              </div>

              {/* Fallback notification if triggered */}
              {result?.fallbackTriggered && (
                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-600/40 text-xs text-amber-300 flex items-start gap-2">
                  <GitFork className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <span className="font-semibold">Circuit Breaker Failover Engaged:</span>
                    <p className="mt-0.5 text-amber-200/90">{result.fallbackReason}</p>
                  </div>
                </div>
              )}

              {/* Output Completion Stream */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-300">Completion Output</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {result?.isSimulated ? '(Deterministic Sandbox Output)' : '(Live Gemini Inference)'}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyOutput}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {result?.output}
                </div>
              </div>

              {/* Latency & FinOps Economics Card */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">TTFT / Total Latency</span>
                  <span className="text-slate-200 font-semibold tabular-nums">
                    {result?.ttftMs}ms / {result?.totalLatencyMs}ms
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Query Cost</span>
                  <span className="text-cyan-400 font-semibold tabular-nums">
                    ${result?.actualCostUsd.toFixed(6)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Savings vs Frontier</span>
                  <span className="text-emerald-400 font-semibold tabular-nums">
                    +{decision.savingsPercentage}%
                  </span>
                </div>
              </div>

              {/* Action to send to autorater */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() =>
                    onSendToAutorater(
                      prompt,
                      result?.output || '',
                      result?.actualTier || decision.selectedTier
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/40 border border-cyan-800/60 rounded-lg hover:bg-cyan-900/40 transition-colors"
                >
                  <span>Evaluate with Pairwise Autorater</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[460px] flex flex-col items-center justify-center p-8 rounded-xl bg-slate-900/30 border border-slate-800/80 text-center text-slate-500 space-y-3">
              <div className="p-3 rounded-full bg-slate-800/50 text-slate-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-300">Gateway Awaiting Prompt</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Select an enterprise workload archetype above or craft a custom query, then hit "Route &amp; Execute Query" to inspect the dynamic classification cascade.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
