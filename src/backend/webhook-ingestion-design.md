# ColloPay Gateway Webhook Ingestion & Processing Module

## 1) Webhook controller structure

`WebhookController` is framework-agnostic and takes `{ headers, body }`.

- Parse + normalize incoming payload into `ProcessorWebhookEvent`.
- Pull signature from `x-webhook-signature` header (placeholder flow).
- Call `WebhookProcessingService.process(...)` with retry enabled.
- Return `202` for accepted events, `401/400` for rejected events.

## 2) Webhook service structure

`WebhookProcessingService` performs a staged flow:

1. Validate incoming event envelope.
2. Persist raw webhook event as `RECEIVED`.
3. Enforce idempotency using deterministic `processingKey` (`{processor}:{eventId}`).
4. Verify signature via processor adapter placeholder.
5. Resolve processor event into internal transaction update intent.
6. Correlate webhook to internal transaction using `processorTransactionId`.
7. Safely apply status transition through orchestration service.
8. Persist processing outcome state and emit audit logs.

## 3) Event persistence model

`WebhookEvent` now stores:

- Identity: `id`, `processingKey`, `processor`, `eventId`, `eventType`
- Timing: `occurredAt`, `receivedAt`, `processedAt`, `nextRetryAt`, `lastErrorAt`
- Correlation: `correlationStatus`, `transactionId`
- Processing safety: `attemptCount`, `status`, `outcomeCode`, `processingError`, `deadLetterReason`
- Compliance data: `signature`, `payload` (raw event)

## 4) Transaction correlation logic

Correlation source of truth is `processorTransactionId` resolved by adapter.

- If found: mark correlation as `CORRELATED`, process transaction update.
- If not found:
  - `RETRY_PENDING` when retry is allowed.
  - `DEAD_LETTER` when retries are exhausted or disabled.
  - `MANUAL_REVIEW` for unmapped webhook states.

## 5) Webhook processing status model

Status lifecycle:

- `RECEIVED` → raw payload persisted.
- `SIGNATURE_VERIFIED` → signature check passed.
- `PROCESSING` → correlation/transaction update in progress.
- Terminal/holding states:
  - `PROCESSED`
  - `DUPLICATE`
  - `RETRY_PENDING`
  - `DEAD_LETTER`
  - `MANUAL_REVIEW`
  - `FAILED`

## 6) Example retry-safe flow

1. Processor sends event `evt_123`.
2. Event persisted with `attemptCount = 1` and `RECEIVED`.
3. Signature verified; status becomes `SIGNATURE_VERIFIED`.
4. Correlation fails (`processorTransactionId` missing).
5. Event marked `RETRY_PENDING` with `nextRetryAt`.
6. Worker retries event; `attemptCount = 2`.
7. Correlation succeeds; transition applied safely.
8. Event marked `PROCESSED` with `correlationStatus = CORRELATED`.
9. Any later duplicate delivery becomes `DUPLICATE` and exits fast.

## 7) Test plan for duplicate and out-of-order webhooks

- **Duplicate delivery test**
  - Send same `(processor, eventId)` twice.
  - Expect first event `PROCESSED`, second `DUPLICATE`.
  - Verify `attemptCount` increments and transaction is not re-mutated.

- **Out-of-order status test**
  - Preload transaction in a later state (`CAPTURED`).
  - Deliver earlier state webhook (`AUTHORIZED`).
  - Expect `FAILED` with non-retryable outcome due to illegal transition.

- **Correlation failure test**
  - Deliver event with unknown `processorTransactionId`.
  - Expect `RETRY_PENDING` and `nextRetryAt` set.
  - After retry exhaustion, expect `DEAD_LETTER`.

- **Unmapped event test**
  - Adapter returns no mapping.
  - Expect `MANUAL_REVIEW` and no transaction mutation.
