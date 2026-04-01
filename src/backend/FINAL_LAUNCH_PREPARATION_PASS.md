# ColloPay Gateway — Final Launch Preparation Pass

Date: 2026-04-01
Scope: `src/backend/**` architecture and readiness review

## Executive summary

ColloPay Gateway has a strong domain baseline (typed contracts, explicit status machine, adapter abstraction, idempotency service, and webhook pipeline). However, it is **not yet production-launch ready** because persistence, distributed concurrency guarantees, and operational controls remain largely interface-only or in-memory assumptions.

---

## 1) Backend module review

### What is in good shape
- Clear module boundaries across `domain`, `services`, `adapters`, and `ports`.
- Transaction state transitions are explicitly constrained by a central status machine.
- Processor-specific logic is isolated to adapter/mappers (SpeedyPay implementation).
- Webhook flow models full lifecycle states (`RECEIVED` → terminal outcomes).

### What is launch-blocking
- Repository contracts exist, but production implementations are not present in-repo.
- Multi-step transaction writes are not atomic (status update and history append are separate).
- Controller-level error mapping is too coarse (mostly `401/400`) and does not expose deterministic API error contracts.

---

## 2) Environment/config assumption review

### Current assumptions
- SpeedyPay config accepts environment values but defaults to mock/local endpoints and empty secrets.
- `SPEEDYPAY_MODE` is loosely cast and can accept invalid runtime strings without guardrails.
- App Hosting config currently caps max instances to `1`, which is a high availability and throughput risk for launch traffic.

### Required pre-launch hardening
- Enforce startup-time config validation (non-empty secrets, strict mode enum, URL validation, timeout ranges).
- Fail fast when production mode credentials are missing.
- Increase capacity assumptions and define autoscaling, CPU/memory, and concurrency targets.

---

## 3) Security notes review

### Present controls
- Webhook payload schema validation.
- Basic signature verification contract in processor adapter.
- Freshness validation with replay window and future skew checks.

### Gaps
- No nonce replay defense or signed timestamp canonicalization in the adapter contract.
- Secret rotation/KMS integration is not implemented.
- No explicit redaction strategy for sensitive values in logs/audit details.

---

## 4) Test coverage gap review

### Covered now
- Orchestration happy path, mapping rejection, and negative-net guard.
- Webhook duplicate delivery, stale webhook rejection, and out-of-order transition handling.
- Fee engine deterministic and rule-priority behavior.

### Critical gaps
- No tests for real persistence semantics (unique constraints, transactionality, optimistic locking).
- No tests for distributed idempotency collisions across replicas.
- No tests for webhook retry worker lifecycle / DLQ behavior.
- No integration tests validating end-to-end create → webhook → settlement/reconciliation data integrity.
- No security tests for signature tampering edge cases and clock skew boundaries at processor-specific canonical payload level.

---

## 5) Deployment assumption review

### Gaps
- No readiness/liveness endpoints in backend module.
- No documented migration/index bootstrap checks tied to CI/CD gates.
- No runbook material for dead-letter processing, replay, or incident escalation.

---

## 6) Adapter boundary review

### Strengths
- `ProcessorAdapter` abstraction is clear for create/query/webhook.
- Registry pattern isolates processor selection.

### Risks
- `normalizeProcessorResponse` returns broad union types and can leak context ambiguity if misused.
- `ProcessorWebhookResolution.nextStatus` includes only a subset of lifecycle states; dispute/chargeback mapping remains partial.
- Error normalization across adapters is not centralized; each adapter can diverge in details structure.

---

## 7) Error normalization review

### Current state
- Core uses `DomainError` with domain codes.
- Services throw meaningful domain codes in many places.

### Gaps
- HTTP/controller translation is not exhaustive and can map non-validation errors to generic `400`.
- Integration errors from repos/adapters are not consistently wrapped with machine-actionable error metadata.
- No published API error schema/versioning strategy.

---

## 8) Audit logging coverage review

### Covered
- Orchestration emits key transaction events.
- Webhook successful processing emits audit entries.

### Missing
- Some failure branches (e.g., signature failure, dead-letter transitions) are state-updated but do not consistently emit audit entries.
- No integrity controls (immutability/retention policy enforcement) at persistence boundary.
- No explicit actor/session correlation IDs in every audit detail payload.

---

## 9) Transaction status logic review

### Strengths
- Explicit allowed transitions and illegal-transition enforcement.
- Reversal/refund/chargeback categories captured in model.

### Gaps
- No atomic write guarantee between status mutation and history append.
- No optimistic versioning to protect from concurrent conflicting updates.
- Reconciliation-trigger semantics for `SETTLED`, `REFUNDED`, and chargeback outcomes are not coupled to durable event emission.

---

## 10) Reconciliation readiness review

### Gaps
- Reconciliation status exists in model, but there is no reconciliation service/job implementation in backend module.
- No settlement ingestion/parsing pipeline shown.
- No matching-tolerance strategy, exception queue workflow, or aging SLA metrics.

---

## Final launch blockers

1. **Distributed idempotency correctness**: replace in-memory lock with datastore-level atomic reservation + unique `(scope,key)` constraint.
2. **Webhook deduplication correctness**: enforce unique `(processor,eventId)` at database layer.
3. **Atomic transaction timeline writes**: status update + history append must be committed atomically.
4. **Production repository implementations**: concrete, tested persistence adapters are required.
5. **Error contract hardening**: deterministic domain-to-HTTP/API error map for partner-facing reliability.
6. **Operational readiness**: health/readiness probes, metrics, tracing, and alerting must be in place before launch.

---

## Recommended staging checklist

- Validate all required env vars with startup fail-fast in staging config.
- Run end-to-end flow tests:
  - create payment
  - webhook delivery (normal, duplicate, stale, invalid signature)
  - out-of-order webhook
  - retry pending → dead-letter transitions
- Chaos/failure drills:
  - adapter timeout and transient 5xx
  - repository contention and partial write simulation
- Verify observability:
  - correlation IDs through request → adapter → webhook
  - dashboard panels for webhook failure rate, retry backlog, status transition errors
- Confirm index/constraint provisioning scripts run successfully in staging.
- Dry-run reconciliation with sample settlement files and manual exception handling path.

---

## Recommended production rollout checklist

- Enable production secrets in secret manager with rotation metadata.
- Apply DB migrations/indexes/constraints (`(scope,key)`, `(processor,eventId)`, transaction status history transactionality).
- Deploy canary slice (low traffic partner/merchant cohort) with strict alert thresholds.
- Validate first-hour metrics and logs against SLO baselines.
- Confirm runbook ownership and on-call escalation matrix.
- Run rollback drill readiness check (artifact version pinning, config rollback path, replay strategy).

---

## Post-launch monitoring checklist

- Track and alert on:
  - webhook signature failures
  - webhook retry queue depth and DLQ rate
  - illegal status transition count
  - idempotency conflict rate
  - processor latency/error rate by processor and endpoint
  - reconciliation unmatched/exception aging
- Daily operational review:
  - top failure reasons by normalized error code
  - manual review queue throughput
  - settlement drift between processor reports and internal ledger snapshots
- Weekly controls:
  - secret rotation posture
  - audit log completeness spot-checks
  - index/query performance regression review

---

## Future roadmap suggestions

### A) Multi-processor support
- Introduce capability-driven routing engine (auth-only, capture, refund, local methods).
- Add processor health scoring and dynamic failover.
- Define processor-agnostic canonical event taxonomy and error matrix.

### B) Merchant self-service onboarding
- Build onboarding workflow service with KYC/KYB state machine and document collection.
- Add merchant portal APIs for processor mapping requests, webhook endpoint verification, and API key lifecycle.
- Implement policy checks (MCC restrictions, country/currency constraints) at onboarding time.

### C) Settlement automation
- Add settlement ingestion worker (SFTP/API pulls), parser framework, and normalized settlement records.
- Auto-generate payout instructions with hold/release controls.
- Build settlement close job with reconciliation checkpointing and exception gating.

### D) Dispute/refund handling
- Add dispute case aggregate with evidence deadlines, representment states, and liability tracking.
- Model partial refund limits and policy checks against captured/settled balances.
- Integrate processor dispute webhooks into same normalized lifecycle framework.

### E) Analytics
- Introduce analytics event outbox from transaction/webhook state transitions.
- Build partner/merchant KPI layer: auth rate, capture rate, net margin, dispute rate, settlement lag.
- Add anomaly detection for decline spikes, duplicate webhook storms, and reconciliation drift.
