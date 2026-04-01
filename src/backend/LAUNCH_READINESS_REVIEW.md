# ColloPay Gateway Launch Readiness Review

Date: 2026-04-01
Reviewer perspective: Senior production engineer pre-launch audit

## 1) Architectural weaknesses

### Findings
- No persistence implementations are included for core ports (`TransactionRepository`, `WebhookEventRepository`, `IdempotencyRepository`), so production consistency and performance characteristics are undefined.
- Transaction creation flow spans multiple writes (`create`, `updateStatus`, `append history`, `updateProcessorReference`) without an atomic unit-of-work.
- Orchestration directly owns adapter invocation and persistence sequencing; there is no outbox/event bus boundary for downstream side effects.

### Proposed fixes
- Implement Firestore-backed repositories with explicit transactional boundaries for status updates and webhook state progression.
- Introduce an outbox table/collection and worker for guaranteed async event delivery.
- Separate command orchestration from persistence strategy via a transaction manager abstraction.

## 2) Security gaps

### Findings
- Webhook freshness/replay-window validation was missing.
- No timestamp skew policy in webhook acceptance path.
- Secret rotation and KMS/Secret Manager integration are not implemented in adapter layer.

### Implemented now
- Added webhook freshness enforcement in `WebhookProcessingService` using `occurredAt` limits.

### Proposed fixes
- Add strict signature scheme validation including signed timestamp and nonce.
- Enforce per-processor secret versioning and rotation schedule.

## 3) Reliability issues

### Findings
- Idempotency relied only on read-then-create logic, which is race-prone under concurrent requests.
- Retry policy exists for webhook correlation/update but lacks capped retry metadata strategy tied to a queue.

### Implemented now
- Added in-process contention protection for idempotency keys to reduce same-instance race windows.

### Proposed fixes
- Add datastore-level atomic reservation with unique key constraint and retry-safe upsert.
- Introduce queue-backed retries with jittered exponential backoff and max-attempt policy.

## 4) Missing validation

### Findings
- Net settlement amount could become negative if fees exceed amount.
- Missing stricter validation on webhook temporal validity (addressed).

### Implemented now
- Added net amount non-negative enforcement in transaction creation.

### Proposed fixes
- Add stricter reference-format validation (allowed charset/length per partner contract).
- Add metadata size guards to prevent oversized payload persistence.

## 5) Weak error handling

### Findings
- `applyStatusUpdate` threw generic `Error` for missing transaction.
- Failure paths do not consistently map to domain-level codes suitable for API error contracts.

### Implemented now
- Switched missing transaction branch to `DomainError` with `NOT_FOUND_ERROR` and structured details.

### Proposed fixes
- Introduce centralized error mapper (`DomainError` -> HTTP/API code schema).
- Ensure all repository failures are wrapped with actionable context.

## 6) Data consistency risks

### Findings
- Status update and status history append are not atomic.
- Processor reference update is a separate write that can diverge from transaction status timeline.

### Proposed fixes
- Persist status + history in one transaction/batch.
- Add version field and optimistic concurrency control on transaction aggregate.

## 7) Firestore modeling risks

### Findings
- No documented partitioning/hotspot strategy for high-volume webhook or idempotency keys.
- Query patterns imply required composite indexes are not defined in repo.

### Proposed fixes
- Use document IDs with entropy (or hash prefixes) to avoid write hotspots.
- Create composite index plan for processor/eventId, transactionId/status, partnerId/date ranges.
- Add TTL policy for ephemeral webhook retry artifacts where compliant.

## 8) Webhook and idempotency risks

### Findings
- Duplicate handling is present but depends on repository semantics not shown.
- Idempotency currently has only in-process lock; multi-instance race remains.

### Implemented now
- Strengthened webhook replay resistance via freshness window checks.
- Added TODO launch-blocker marker in idempotency service for distributed atomic enforcement.

### Proposed fixes
- Add uniqueness guarantee on `(processor,eventId)` and `(scope,key)`.
- Require signed webhook timestamp and reject stale/replayed signatures.

## 9) Observability gaps

### Findings
- Audit logs exist but no structured operational logs with correlation IDs.
- No metrics/tracing instrumentation for latency, retries, conflicts, and error-class rates.

### Proposed fixes
- Add OpenTelemetry traces for orchestration and webhook pipeline.
- Add metrics: `webhook_processed_total`, `webhook_signature_fail_total`, `idempotency_conflict_total`, `processor_call_duration_ms`.

## 10) Deployment-readiness gaps

### Findings
- No runtime health/readiness checks in backend module.
- No explicit migration/index bootstrap process for production repositories.
- No documented runbook for retry queue dead-letter drains.

### Proposed fixes
- Add health/readiness endpoints and dependency probes.
- Add CI job to verify schema/index prerequisites before deployment.
- Add SLOs + alert thresholds + on-call runbooks.

---

## Launch-readiness checklist by severity

### Critical
- [ ] TODO(launch-blocker): Implement datastore-level atomic idempotency reservation + unique constraint across replicas.
- [ ] TODO(launch-blocker): Enforce unique `(processor,eventId)` at persistence layer to guarantee webhook deduplication.
- [ ] TODO(launch-blocker): Make transaction status update + status history append atomic.
- [ ] TODO(launch-blocker): Introduce API error contract mapping with deterministic status codes.

### High
- [ ] TODO(launch-blocker): Add signed timestamp + nonce verification for webhook signatures.
- [ ] TODO(launch-blocker): Add OpenTelemetry tracing and production metrics dashboards/alerts.
- [ ] TODO(launch-blocker): Implement retry worker + DLQ for webhook retry lifecycle.
- [ ] TODO(launch-blocker): Finalize Firestore index plan and deployment checks.

### Medium
- [ ] Add strict field constraints for `externalReference` and metadata payload size.
- [ ] Add optimistic concurrency versioning on transaction records.
- [ ] Add health/readiness probes and dependency diagnostics.

### Low
- [ ] Add architecture decision records (ADRs) for repository patterns and webhook pipeline.
- [ ] Add chaos tests/fault injection scenarios for processor and datastore failures.

