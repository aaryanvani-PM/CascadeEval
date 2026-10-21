import { MODEL_TIERS, ModelTier } from '../types/gateway';

export interface FinOpsSimulationParams {
  monthlyQueries: number;            // e.g. 10,000,000
  tier1Share: number;                // default 0.70
  tier2Share: number;                // default 0.20
  tier3Share: number;                // default 0.10
  cacheHitRatio: number;             // default 0.40 (40%)
  cacheDiscountRate: number;         // default 0.85 (85%)
  asyncBatchRatio: number;           // default 0.00 (0% to 50%)
  avgInputTokens: number;            // default 1200
  avgOutputTokens: number;           // default 350
}

export interface FinOpsComparisonResult {
  frontierBaseline: {
    cpqPer1k: number;
    monthlySpend: number;
    annualSpend: number;
    p95LatencyMs: number;
  };
  midTierBaseline: {
    cpqPer1k: number;
    monthlySpend: number;
    annualSpend: number;
    savingsPct: number;
    p95LatencyMs: number;
  };
  lowTierBaseline: {
    cpqPer1k: number;
    monthlySpend: number;
    annualSpend: number;
    savingsPct: number;
    p95LatencyMs: number;
  };
  cascadeGateway: {
    cpqPer1k: number;
    monthlySpend: number;
    annualSpend: number;
    annualSavingsUsd: number;
    savingsPct: number;
    p95LatencyMs: number;
  };
}

/**
 * Calculates blended Cost Per 1,000 Queries (CPQ) using exact PRD formula.
 */
export function calculateFinOpsMetrics(params: FinOpsSimulationParams): FinOpsComparisonResult {
  const {
    monthlyQueries,
    tier1Share,
    tier2Share,
    tier3Share,
    cacheHitRatio,
    cacheDiscountRate,
    asyncBatchRatio,
    avgInputTokens,
    avgOutputTokens,
  } = params;

  // Batch API offers a flat 50% discount on async portion
  const batchMultiplier = (1 - (asyncBatchRatio * 0.50));

  // 1. Frontier Baseline (100% Tier 3 Gemini Pro, zero caching)
  const tier3 = MODEL_TIERS['tier-3'];
  const frontierInputCost = (avgInputTokens / 1_000_000) * tier3.inputRatePerM;
  const frontierOutputCost = (avgOutputTokens / 1_000_000) * tier3.outputRatePerM;
  const frontierCpq = 1000 * (frontierInputCost + frontierOutputCost);
  const frontierMonthly = (monthlyQueries / 1000) * frontierCpq;

  // 2. Mid-Tier Baseline (100% Tier 2 Gemini Flash, zero caching)
  const tier2 = MODEL_TIERS['tier-2'];
  const midInputCost = (avgInputTokens / 1_000_000) * tier2.inputRatePerM;
  const midOutputCost = (avgOutputTokens / 1_000_000) * tier2.outputRatePerM;
  const midCpq = 1000 * (midInputCost + midOutputCost);
  const midMonthly = (monthlyQueries / 1000) * midCpq;

  // 3. Low-Tier Baseline (100% Tier 1 Gemini Flash-Lite, zero caching)
  const tier1 = MODEL_TIERS['tier-1'];
  const lowInputCost = (avgInputTokens / 1_000_000) * tier1.inputRatePerM;
  const lowOutputCost = (avgOutputTokens / 1_000_000) * tier1.outputRatePerM;
  const lowCpq = 1000 * (lowInputCost + lowOutputCost);
  const lowMonthly = (monthlyQueries / 1000) * lowCpq;

  // 4. CascadeEval Dynamic Gateway (Blended shares + cache + batch offload)
  const effectiveInputTokens = avgInputTokens * (1 - (cacheHitRatio * cacheDiscountRate));
  
  const t1QueryCost = ((effectiveInputTokens / 1_000_000) * tier1.inputRatePerM + (avgOutputTokens / 1_000_000) * tier1.outputRatePerM);
  const t2QueryCost = ((effectiveInputTokens / 1_000_000) * tier2.inputRatePerM + (avgOutputTokens / 1_000_000) * tier2.outputRatePerM);
  const t3QueryCost = ((effectiveInputTokens / 1_000_000) * tier3.inputRatePerM + (avgOutputTokens / 1_000_000) * tier3.outputRatePerM);

  const blendedQueryCost = (tier1Share * t1QueryCost + tier2Share * t2QueryCost + tier3Share * t3QueryCost) * batchMultiplier;
  const gatewayCpq = 1000 * blendedQueryCost;
  const gatewayMonthly = (monthlyQueries / 1000) * gatewayCpq;
  const annualSavings = (frontierMonthly * 12) - (gatewayMonthly * 12);

  // Blended P95 Latency
  const gatewayP95Latency = Math.round(
    (tier1Share * tier1.p95LatencyMs) +
    (tier2Share * tier2.p95LatencyMs) +
    (tier3Share * tier3.p95LatencyMs) +
    18 // Average gateway overhead
  );

  return {
    frontierBaseline: {
      cpqPer1k: frontierCpq,
      monthlySpend: frontierMonthly,
      annualSpend: frontierMonthly * 12,
      p95LatencyMs: tier3.p95LatencyMs,
    },
    midTierBaseline: {
      cpqPer1k: midCpq,
      monthlySpend: midMonthly,
      annualSpend: midMonthly * 12,
      savingsPct: Math.max(0, ((frontierMonthly - midMonthly) / frontierMonthly) * 100),
      p95LatencyMs: tier2.p95LatencyMs,
    },
    lowTierBaseline: {
      cpqPer1k: lowCpq,
      monthlySpend: lowMonthly,
      annualSpend: lowMonthly * 12,
      savingsPct: Math.max(0, ((frontierMonthly - lowMonthly) / frontierMonthly) * 100),
      p95LatencyMs: tier1.p95LatencyMs,
    },
    cascadeGateway: {
      cpqPer1k: gatewayCpq,
      monthlySpend: gatewayMonthly,
      annualSpend: gatewayMonthly * 12,
      annualSavingsUsd: annualSavings,
      savingsPct: Math.max(0, ((frontierMonthly - gatewayMonthly) / frontierMonthly) * 100),
      p95LatencyMs: gatewayP95Latency,
    },
  };
}

/**
 * Calculates individual query cost with caching and batch discounts.
 */
export function calculateSingleQueryCost(
  tier: ModelTier,
  inputTokens: number,
  outputTokens: number,
  isCached: boolean,
  isAsyncBatch: boolean,
  isAboveCliff: boolean = false
): { costUsd: number; frontierEquivalentUsd: number } {
  const config = MODEL_TIERS[tier];
  
  // If input exceeds 200k tokens and wasn't pruned, rates double
  const cliffMultiplier = isAboveCliff ? 2.0 : 1.0;
  const inputRate = config.inputRatePerM * cliffMultiplier;
  const outputRate = config.outputRatePerM * (isAboveCliff ? 1.5 : 1.0);

  // Caching yields 85% discount on cached input tokens
  const effectiveInputTokens = isCached ? inputTokens * 0.15 : inputTokens;
  const rawCost = (effectiveInputTokens / 1_000_000) * inputRate + (outputTokens / 1_000_000) * outputRate;
  
  // Batch API gives flat 50% discount
  const costUsd = isAsyncBatch ? rawCost * 0.5 : rawCost;

  // Frontier equivalent (100% Pro without caching or batch)
  const tier3Config = MODEL_TIERS['tier-3'];
  const frontierRate = isAboveCliff ? 4.00 : tier3Config.inputRatePerM;
  const frontierOutRate = isAboveCliff ? 18.00 : tier3Config.outputRatePerM;
  const frontierEquivalentUsd = (inputTokens / 1_000_000) * frontierRate + (outputTokens / 1_000_000) * frontierOutRate;

  return { costUsd, frontierEquivalentUsd };
}
