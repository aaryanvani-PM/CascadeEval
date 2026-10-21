import React, { useState } from 'react';
import {
  BookOpen,
  Terminal,
  Code2,
  Copy,
  Check,
  Cpu,
  Layers,
  ShieldCheck,
  Clock,
  ArrowRight,
  Database,
  GitFork,
  FileText,
  Workflow,
  Sparkles,
} from 'lucide-react';
import { MODEL_TIERS } from '../types/gateway';

type DocSection = 'quickstart' | 'algorithm' | 'api' | 'sdk' | 'rollout';

export const DocumentationView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DocSection>('quickstart');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedSdkLang, setSelectedSdkLang] = useState<'curl' | 'python' | 'typescript'>('curl');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const curlSnippet = `curl -X POST https://api.yourdomain.com/api/gateway/route \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Extract company, ARR, and headquarter city from the vendor profile.",
    "schemaConstraint": "{\\"company\\":\\"string\\",\\"arr\\":\\"string\\",\\"city\\":\\"string\\"}",
    "executionMode": "sync"
  }'`;

  const pythonSnippet = `import httpx

GATEWAY_URL = "https://api.yourdomain.com/api/gateway/route"

payload = {
    "prompt": "Refactor synchronous thread pool into asyncio with bounded semaphore.",
    "systemInstruction": "You are a principal systems software engineer.",
    "executionMode": "sync"
}

with httpx.Client(timeout=10.0) as client:
    response = client.post(GATEWAY_URL, json=payload)
    data = response.json()
    
    print(f"Selected Tier: {data['decision']['selectedTier']}")
    print(f"Complexity Score: {data['decision']['complexityScore']}")
    print(f"Gateway Overhead: {data['decision']['gatewayOverheadMs']} ms")
    print(f"Completion: {data['result']['output']}")`;

  const tsSnippet = `import { GatewayPayload } from './types/gateway';

async function routeQuery(payload: GatewayPayload) {
  const response = await fetch('/api/gateway/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(\`Gateway HTTP error: \${response.status}\`);
  }

  const { decision, result } = await response.json();
  console.log(\`Routed to: \${decision.selectedTier} (S = \${decision.complexityScore})\`);
  return result.output;
}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              CascadeEval Engineering Documentation &amp; Setup Guide
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete technical reference covering gateway deployment, heuristic complexity algorithms, API request schemas, multi-language SDKs, and production rollout runbooks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
          <span>Target Release: Q1 2027 Alpha</span>
        </div>
      </div>

      {/* Main Grid: Navigation Sidebar & Documentation Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-1 font-mono text-xs">
          <button
            onClick={() => setActiveSection('quickstart')}
            className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
              activeSection === 'quickstart'
                ? 'bg-slate-800 border-cyan-500/60 text-cyan-300 font-semibold shadow-sm'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>01. Quickstart &amp; Setup</span>
            <ArrowRight className="h-3 w-3 opacity-60" />
          </button>

          <button
            onClick={() => setActiveSection('algorithm')}
            className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
              activeSection === 'algorithm'
                ? 'bg-slate-800 border-cyan-500/60 text-cyan-300 font-semibold shadow-sm'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>02. Routing Algorithm</span>
            <ArrowRight className="h-3 w-3 opacity-60" />
          </button>

          <button
            onClick={() => setActiveSection('api')}
            className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
              activeSection === 'api'
                ? 'bg-slate-800 border-cyan-500/60 text-cyan-300 font-semibold shadow-sm'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>03. API Specifications</span>
            <ArrowRight className="h-3 w-3 opacity-60" />
          </button>

          <button
            onClick={() => setActiveSection('sdk')}
            className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
              activeSection === 'sdk'
                ? 'bg-slate-800 border-cyan-500/60 text-cyan-300 font-semibold shadow-sm'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>04. Client SDK Snippets</span>
            <ArrowRight className="h-3 w-3 opacity-60" />
          </button>

          <button
            onClick={() => setActiveSection('rollout')}
            className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
              activeSection === 'rollout'
                ? 'bg-slate-800 border-cyan-500/60 text-cyan-300 font-semibold shadow-sm'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>05. Production Rollout</span>
            <ArrowRight className="h-3 w-3 opacity-60" />
          </button>
        </div>

        {/* Content Viewport */}
        <div className="lg:col-span-9 p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-6">
          {/* Section 1: Quickstart & Setup */}
          {activeSection === 'quickstart' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-cyan-400" />
                  <span>01. Quickstart &amp; Environment Setup</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  How to configure and run the unified full-stack CascadeEval gateway on Google Cloud or local infrastructure.
                </p>
              </div>

              {/* Step 1: Environment Variables */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Step 1: Environment Variables (.env)</span>
                <div className="relative">
                  <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
{`# Gemini API Key for server-side live model calls
GEMINI_API_KEY="AIzaSy..."

# Server runtime port
PORT=3000

# Node environment mode
NODE_ENV="production"`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard('GEMINI_API_KEY="AIzaSy..."\nPORT=3000\nNODE_ENV="production"', 'env')}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {copiedKey === 'env' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Step 2: Architecture Overview */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-300">Step 2: Unified Full-Stack Architecture</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  CascadeEval uses a unified <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded font-mono">server.ts</code> entry point that mounts Express API routes on <code className="text-slate-300 font-mono">/api/gateway/*</code> while serving Vite middlewares. In production, this compiles down to a single hermetic container deployable to Google Cloud Run with zero CORS configuration needed.
                </p>
              </div>

              {/* Step 3: Start Command */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-300">Step 3: Server Execution</span>
                <div className="relative">
                  <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
{`# Start development server on port 3000
npm run dev

# Compile production bundle and start server
npm run build && npm start`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard('npm run dev', 'start')}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {copiedKey === 'start' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Routing Algorithm & Latency Budget */}
          {activeSection === 'algorithm' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  <span>02. Semantic Complexity Scoring Algorithm (PRD §4.1)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  How the gateway evaluates incoming payloads in under 25ms to assign a normalized score $S \in [0.0, 1.0]$.
                </p>
              </div>

              {/* Formulation */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Complexity Scoring Formulation</span>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
{`S = clamp( (0.40 * ReasoningIntensity) +
            (0.30 * DomainDifficulty) +
            (0.15 * ConstraintDensity) +
            (0.10 * Entropy) +
            (0.05 * TokenRatio),  min=0.05, max=1.00 )`}
                </div>
              </div>

              {/* Factors Table */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Scoring Factor Breakdown</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                        <th className="py-2 px-3">Factor</th>
                        <th className="py-2 px-3 text-right">Weight</th>
                        <th className="py-2 px-3">Evaluation Signal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">Reasoning Intensity</td>
                        <td className="py-2.5 px-3 text-right text-cyan-400">40%</td>
                        <td className="py-2.5 px-3 text-slate-400">Multi-step logic, code refactoring, algorithmic complexity, mathematical proofs.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">Domain Difficulty</td>
                        <td className="py-2.5 px-3 text-right text-cyan-400">30%</td>
                        <td className="py-2.5 px-3 text-slate-400">Regulatory law (MiCA, SEC), cryptographic invariants, quantum physics, medical protocols.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">Constraint Density</td>
                        <td className="py-2.5 px-3 text-right text-cyan-400">15%</td>
                        <td className="py-2.5 px-3 text-slate-400">Strict JSON schemas, exact regex boundaries, programmatic formatting rules.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">Entropy &amp; Token Ratio</td>
                        <td className="py-2.5 px-3 text-right text-cyan-400">15%</td>
                        <td className="py-2.5 px-3 text-slate-400">Lexical diversity, payload volume, context document token length.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tier Thresholds */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-300">Tier Threshold Mapping</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/30">
                    <span className="text-cyan-400 font-bold block">Tier 1: S &le; 0.35</span>
                    <span className="text-white text-[11px] block mt-1">Gemini 2.5 Flash-Lite</span>
                    <span className="text-slate-500 text-[10px] block mt-0.5">Target: 70% share (&lt;180ms P50)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-blue-500/30">
                    <span className="text-blue-400 font-bold block">Tier 2: 0.35 &lt; S &le; 0.75</span>
                    <span className="text-white text-[11px] block mt-1">Gemini 3.5 Flash</span>
                    <span className="text-slate-500 text-[10px] block mt-0.5">Target: 20% share (&lt;450ms P50)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-purple-500/30">
                    <span className="text-purple-400 font-bold block">Tier 3: S &gt; 0.75</span>
                    <span className="text-white text-[11px] block mt-1">Gemini 3.1 Pro</span>
                    <span className="text-slate-500 text-[10px] block mt-0.5">Target: 10% share (&lt;1,200ms P50)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: API Specifications */}
          {activeSection === 'api' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-cyan-400" />
                  <span>03. Gateway API Endpoints &amp; Schemas</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Complete request/response specifications for the gateway reverse proxy routes.
                </p>
              </div>

              {/* Route 1 */}
              <div className="space-y-2 p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">POST</span>
                  <span className="text-white font-semibold">/api/gateway/route</span>
                </div>
                <p className="text-xs text-slate-400">
                  Primary reverse-proxy endpoint. Validates schema, performs SHA-256 context deduplication, scores complexity, prunes context cliff drift, and executes routed completion.
                </p>
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-mono text-slate-300">Request Body Schema:</span>
                  <pre className="p-3 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
{`{
  "prompt": "string (required)",
  "systemInstruction": "string (optional)",
  "schemaConstraint": "string (optional JSON schema)",
  "contextPayload": "string (optional reference doc)",
  "executionMode": "sync | async-batch",
  "isInterviewMode": "boolean (toggle live Gemini API)",
  "targetOverride": "tier-1 | tier-2 | tier-3 (optional manual override)"
}`}
                  </pre>
                </div>
              </div>

              {/* Route 2 */}
              <div className="space-y-2 p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-800">POST</span>
                  <span className="text-white font-semibold">/api/gateway/autorate</span>
                </div>
                <p className="text-xs text-slate-400">
                  Pairwise LLM-as-a-judge endpoint. Evaluates Candidate A vs Candidate B with positional swap mitigation (A, B) and (B, A) using independent frontier judge.
                </p>
              </div>

              {/* Route 3 */}
              <div className="space-y-2 p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-800">GET</span>
                  <span className="text-white font-semibold">/api/gateway/stats</span>
                </div>
                <p className="text-xs text-slate-400">
                  Telemetry monitoring endpoint. Returns live query count, traffic tier distribution, cache efficiency ratio, and recent ingested query logs.
                </p>
              </div>
            </div>
          )}

          {/* Section 4: Client SDK Snippets */}
          {activeSection === 'sdk' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="h-4 w-4 text-cyan-400" />
                    <span>04. Multi-Language Client SDKs</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Drop-in client examples for integrating upstream services with the CascadeEval gateway.
                  </p>
                </div>

                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                  <button
                    onClick={() => setSelectedSdkLang('curl')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      selectedSdkLang === 'curl' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => setSelectedSdkLang('python')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      selectedSdkLang === 'python' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    Python (httpx)
                  </button>
                  <button
                    onClick={() => setSelectedSdkLang('typescript')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      selectedSdkLang === 'typescript' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    TypeScript
                  </button>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="relative">
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                  {selectedSdkLang === 'curl' && curlSnippet}
                  {selectedSdkLang === 'python' && pythonSnippet}
                  {selectedSdkLang === 'typescript' && tsSnippet}
                </pre>
                <button
                  onClick={() =>
                    copyToClipboard(
                      selectedSdkLang === 'curl'
                        ? curlSnippet
                        : selectedSdkLang === 'python'
                        ? pythonSnippet
                        : tsSnippet,
                      'sdk'
                    )
                  }
                  className="absolute top-3 right-3 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {copiedKey === 'sdk' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Section 5: Production Rollout Runbook */}
          {activeSection === 'rollout' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Workflow className="h-4 w-4 text-cyan-400" />
                  <span>05. Enterprise Production Rollout Plan (PRD §9)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Three-phase migration roadmap for adopting CascadeEval across enterprise workloads.
                </p>
              </div>

              <div className="space-y-4">
                {/* Phase 1 */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-cyan-400">
                    <span className="font-bold">Phase 1: Alpha Proxy (Weeks 1–4)</span>
                    <span className="text-[10px] text-slate-500">Internal Testing</span>
                  </div>
                  <ul className="text-slate-300 space-y-1 font-sans text-xs list-disc list-inside">
                    <li>Deploy internal reverse-proxy gateway proxying non-critical internal traffic.</li>
                    <li>Establish classifier baseline against 50,000 historical enterprise queries.</li>
                    <li>Verify classifier latency stays strictly below the 20ms P95 budget.</li>
                  </ul>
                </div>

                {/* Phase 2 */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-blue-400">
                    <span className="font-bold">Phase 2: Shadow Production Dual-Write (Weeks 5–8)</span>
                    <span className="text-[10px] text-slate-500">Shadow Mode</span>
                  </div>
                  <ul className="text-slate-300 space-y-1 font-sans text-xs list-disc list-inside">
                    <li>Send 100% of live traffic to existing monolithic endpoint, shadow-routing to CascadeEval.</li>
                    <li>Run automated pairwise autorater evaluations on a 5% production sample.</li>
                    <li>Calibrate complexity score thresholds until quality parity reaches &ge;98.0%.</li>
                  </ul>
                </div>

                {/* Phase 3 */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="font-bold">Phase 3: Phased Canary Rollout &amp; GA (Weeks 9–12)</span>
                    <span className="text-[10px] text-slate-500">Full GA</span>
                  </div>
                  <ul className="text-slate-300 space-y-1 font-sans text-xs list-disc list-inside">
                    <li>10% canary traffic rollout for non-critical workloads.</li>
                    <li>Gradual ramp to 50% &rarr; 100% across all production Kubernetes clusters.</li>
                    <li>Activate dynamic SHA-256 context caching and Gemini Batch API 50% discount offload.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
