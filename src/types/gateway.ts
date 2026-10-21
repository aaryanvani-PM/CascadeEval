export type ModelTier = 'tier-1' | 'tier-2' | 'tier-3';

export interface ModelTierConfig {
  id: ModelTier;
  name: string;
  apiModel: string;
  headline: string;
  complexityMin: number;
  complexityMax: number;
  inputRatePerM: number;
  outputRatePerM: number;
  targetShare: number; // e.g. 0.70 for 70%
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  ttftP50Ms: number;
  color: string;
  description: string;
}

export const MODEL_TIERS: Record<ModelTier, ModelTierConfig> = {
  'tier-1': {
    id: 'tier-1',
    name: 'Gemini 2.5 Flash-Lite',
    apiModel: 'gemini-2.5-flash-lite',
    headline: 'High-Throughput / Fast Triage',
    complexityMin: 0.00,
    complexityMax: 0.35,
    inputRatePerM: 0.075,
    outputRatePerM: 0.30,
    targetShare: 0.70,
    p50LatencyMs: 180,
    p95LatencyMs: 350,
    p99LatencyMs: 600,
    ttftP50Ms: 90,
    color: '#06B6D4', // Cyan
    description: 'FAQ, structured JSON extraction, sentiment, triage, summarization',
  },
  'tier-2': {
    id: 'tier-2',
    name: 'Gemini 3.5 Flash',
    apiModel: 'gemini-2.5-flash',
    headline: 'Balanced Multimodal Intelligence',
    complexityMin: 0.36,
    complexityMax: 0.75,
    inputRatePerM: 0.30,
    outputRatePerM: 1.20,
    targetShare: 0.20,
    p50LatencyMs: 450,
    p95LatencyMs: 850,
    p99LatencyMs: 1400,
    ttftP50Ms: 220,
    color: '#3B82F6', // Blue
    description: 'Code refactoring, logic generation, multi-turn agents, document synthesis',
  },
  'tier-3': {
    id: 'tier-3',
    name: 'Gemini 3.1 Pro',
    apiModel: 'gemini-2.5-pro',
    headline: 'Deep Reasoning Frontier',
    complexityMin: 0.76,
    complexityMax: 1.00,
    inputRatePerM: 2.00,
    outputRatePerM: 12.00,
    targetShare: 0.10,
    p50LatencyMs: 1200,
    p95LatencyMs: 2400,
    p99LatencyMs: 4000,
    ttftP50Ms: 650,
    color: '#8B5CF6', // Purple/Violet
    description: 'Multi-step financial/legal audits, mathematical proofs, RAG synthesis',
  },
};

export interface ComplexityFactors {
  entropy: number;            // 0.0 - 1.0
  reasoningIntensity: number; // 0.0 - 1.0
  constraintDensity: number;  // 0.0 - 1.0
  domainDifficulty: number;   // 0.0 - 1.0
  tokenRatio: number;         // 0.0 - 1.0
}

export interface RoutingDecision {
  requestId: string;
  complexityScore: number;
  factors: ComplexityFactors;
  selectedTier: ModelTier;
  ruleBypassApplied?: string;
  cacheHit: boolean;
  cacheHash: string;
  cachedTokens: number;
  totalTokens: {
    input: number;
    output: number;
    total: number;
  };
  contextPruned: boolean;
  tokensBeforePruning: number;
  tokensAfterPruning: number;
  gatewayOverheadMs: number;
  projectedCostUsd: number;
  frontierBaselineCostUsd: number;
  savingsPercentage: number;
}

export interface ExecutionResult {
  output: string;
  actualTier: ModelTier;
  fallbackTriggered: boolean;
  fallbackReason?: string;
  ttftMs: number;
  totalLatencyMs: number;
  actualCostUsd: number;
  isSimulated: boolean;
  timestamp: string;
}

export interface GatewayPayload {
  prompt: string;
  systemInstruction?: string;
  contextPayload?: string;
  schemaConstraint?: string;
  executionMode?: 'sync' | 'async-batch';
  targetOverride?: ModelTier;
  isInterviewMode?: boolean;
  simulateRateLimit?: boolean;
  simulateSchemaError?: boolean;
}

export interface AutoraterScores {
  factualGrounding: number;      // 0 - 100
  instructionAdherence: number;  // 0 - 100
  coherence: number;             // 0 - 100
  safety: number;                // 0 - 100
  aggregateScore: number;        // 0 - 100
}

export interface AutoraterEvaluation {
  id: string;
  timestamp: string;
  judgeModel: string;
  promptSnippet: string;
  candidateA: {
    tier: ModelTier;
    modelName: string;
    outputSnippet: string;
    tokenLength: number;
    scores: AutoraterScores;
  };
  candidateB: {
    tier: ModelTier;
    modelName: string;
    outputSnippet: string;
    tokenLength: number;
    scores: AutoraterScores;
  };
  pass1Evaluation: {
    order: 'A_then_B';
    winner: 'A' | 'B' | 'tie';
    rationale: string;
  };
  pass2Evaluation: {
    order: 'B_then_A';
    winner: 'A' | 'B' | 'tie';
    rationale: string;
  };
  consensusWinner: 'A' | 'B' | 'tie';
  positionalBiasDetected: boolean;
  lengthRatio: number;
  lengthPenaltyApplied: number;
  finalWinRateParityAchieved: boolean; // Quality parity >= 98%
}

export interface EnterprisePreset {
  id: string;
  title: string;
  domain: string;
  expectedTier: ModelTier;
  prompt: string;
  systemInstruction?: string;
  contextPayload?: string;
  schemaConstraint?: string;
  executionMode?: 'sync' | 'async-batch';
  simulatedCliff?: boolean;
}

export interface TelemetryLogEntry {
  id: string;
  timestamp: string;
  promptPreview: string;
  tier: ModelTier;
  complexityScore: number;
  cacheHit: boolean;
  latencyMs: number;
  ttftMs: number;
  gatewayOverheadMs: number;
  costUsd: number;
  savingsUsd: number;
  fallbackTriggered: boolean;
}
