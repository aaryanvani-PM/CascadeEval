import { EnterprisePreset } from '../types/gateway';

export const ENTERPRISE_PRESETS: EnterprisePreset[] = [
  {
    id: 'preset-extraction',
    title: 'Lead Parsing & Schema Normalization',
    domain: 'CRM Data Engineering',
    expectedTier: 'tier-1',
    prompt: `Extract structured lead attributes from the raw unformatted email transcript below. Return valid JSON only.

RAW EMAIL:
"Hi support, my name is Marcus Vance (VP Technology at HyperScale Corp, marcus.v@hyperscale.io, cell: +1 415 555 0192). We currently run 4,200 microservices on AWS and want to migrate to Google Cloud Kubernetes Engine by Q3 2027. Budget approved at $2.4M. Urgent POC requested."`,
    systemInstruction: 'You are an ultra-fast high-throughput data extraction processor. Emit strictly valid JSON conforming to the requested schema. No commentary.',
    schemaConstraint: `{
  "leadName": "string",
  "title": "string",
  "company": "string",
  "email": "string",
  "phone": "string",
  "currentInfrastructure": "string",
  "targetService": "string",
  "budget": "string",
  "targetTimeline": "string",
  "urgency": "low | medium | high"
}`,
    executionMode: 'sync',
  },
  {
    id: 'preset-sentiment',
    title: 'Customer Ticket Sentiment & Routing',
    domain: 'Customer Support SLA',
    expectedTier: 'tier-1',
    prompt: `Analyze the customer tier, churn risk, issue category, and urgency score (1-10) for this incoming Zendesk webhook:

"Ticket #98821: Our production API gateway has been dropping 14% of client requests with 504 Gateway Timeout for the past 28 minutes. This is impacting our peak Black Friday transaction flow. If this isn't resolved in 15 minutes we will invoke our SLA penalty clause and initiate contract termination."`,
    systemInstruction: 'Classify incoming customer support tickets instantly for tier-1 dispatcher routing. Output concise JSON.',
    schemaConstraint: `{
  "urgencyScore": "number (1-10)",
  "churnRisk": "low | medium | high | critical",
  "category": "string",
  "recommendedAction": "string"
}`,
    executionMode: 'sync',
  },
  {
    id: 'preset-code-refactor',
    title: 'Python Async Memory Leak Refactor',
    domain: 'Software Architecture',
    expectedTier: 'tier-2',
    prompt: `Refactor this synchronous Python worker pool into an asyncio-based producer-consumer queue with bounded concurrency (semaphore=10), exponential backoff retry on HTTP 429/503, and graceful SIGTERM shutdown handler. Identify any memory leaks from uncollected task references:

def worker_sync(tasks):
    results = []
    for t in tasks:
        try:
            r = requests.post(f"https://api.internal/v1/jobs/{t['id']}", json=t['data'], timeout=5)
            results.append(r.json())
        except Exception as e:
            results.append({'error': str(e)})
    return results`,
    systemInstruction: 'You are a principal systems software engineer. Provide robust, production-grade Python asyncio code with clear inline explanations of concurrency bounds.',
    executionMode: 'sync',
  },
  {
    id: 'preset-financial-audit',
    title: 'Multi-Jurisdiction Financial Compliance Audit',
    domain: 'FinTech & Regulatory Governance',
    expectedTier: 'tier-3',
    prompt: `Perform a rigorous comparative cross-jurisdiction regulatory compliance analysis between EU MiCA (Markets in Crypto-Assets Regulation) Title III Asset-Referenced Tokens and the US SEC/CFTC joint framework on collateral segregation for digital custody.

Synthesize:
1. Exact reserve backing liquidity ratios and eligible liquid asset composition.
2. Redemption rights and capital buffer stress-test thresholds under a 30-day liquidity crunch scenario.
3. Personal liability exposure for algorithmic market-making liquidity providers versus non-custodial broker-dealers.
4. Mathematical risk model formulation for systemic contagion coefficient under sudden depeg events.`,
    systemInstruction: 'You are a senior regulatory counsel and quantitative financial risk analyst. Provide an exhaustive, multi-step formal assessment with mathematical modeling of systemic capital risks.',
    executionMode: 'sync',
  },
  {
    id: 'preset-cached-manual',
    title: 'Context Caching: 35,000-Token System Manual',
    domain: 'FinOps Context Deduplication',
    expectedTier: 'tier-2',
    prompt: `Based on the provided 35,000-token Cloud Enterprise Architectural Policy Manual, what is the exact protocol for cross-region disaster recovery replication of customer PII data under HIPAA Title II? Specify the permitted RPO and RTO thresholds.`,
    systemInstruction: 'You are a compliance retrieval assistant grounded solely in the loaded Cloud Enterprise Policy Manual.',
    contextPayload: `[SYSTEM_POLICY_MANUAL_HASH_V4] (Simulating 36,480 tokens of comprehensive enterprise security guidelines, ISO 27001 control matrices, SOC2 compliance procedures, FedRAMP High baseline rules, and multi-region disaster recovery runbooks. This context is indexed with a deterministic SHA-256 fingerprint: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855).`,
    executionMode: 'sync',
  },
  {
    id: 'preset-context-cliff',
    title: 'Context Cliff Guard: 220k-Token Conversation Drift',
    domain: 'Token Cliff & Pricing Protection',
    expectedTier: 'tier-3',
    prompt: `Analyze the complete multi-month cross-departmental dialogue history and summarize the key architectural consensus reached regarding zero-trust service meshes.`,
    systemInstruction: 'Synthesize overarching consensus while identifying unaddressed stakeholder objections.',
    contextPayload: `[MASSIVE_CONVERSATION_HISTORY] (Simulating 218,500 historical tokens from 42 engineering meetings, PR review logs, and chat logs. Without CascadeEval context pruning, this payload triggers the 200,000-token pricing cliff doubling input costs from $2.00 to $4.00 per 1M tokens. CascadeEval automated pruner detects the boundary and safely clamps history to 199,500 tokens).`,
    simulatedCliff: true,
    executionMode: 'sync',
  },
];
