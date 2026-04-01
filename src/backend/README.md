# ColloPay Backend Architecture (Proposed)

```text
src/backend/
  adapters/
    processor-adapter.ts
    processor-adapter-registry.ts
    speedypay/
      speedypay-adapter.ts
  domain/
    errors.ts
    status-machine.ts
    types.ts
    validation.ts
  ports/
    repositories.ts
  services/
    audit-log.service.ts
    fee-engine.service.ts
    idempotency.service.ts
    transaction-orchestrator.service.ts
    webhook-processing.service.ts
    __tests__/
      fee-engine.service.test.ts
      transaction-orchestrator.service.test.ts
  index.ts
```

## Design Notes

- Partner-facing API remains generic via service-layer request types in `domain/types.ts`.
- Processor-specific behavior is isolated by `ProcessorAdapter` and implemented by `SpeedyPayAdapter`.
- Transaction states are guarded by `assertValidStatusTransition` and persisted with status history append operations.
- Fee logic lives only in `FeeEngineService` to avoid duplication.
- Idempotency replay and conflict checks are centralized in `IdempotencyService`.
- Webhook flow validates input, deduplicates events, verifies signatures, resolves processor status mapping, then applies explicit status transitions.

## Transaction orchestration sequence (partner payment create)

1. Accept partner request (`CreateTransactionRequest`) and validate payload schema.
2. Validate merchant + partner + processor mapping via `MerchantMappingRepository`.
3. Enforce idempotency on scope `transaction:create:{merchantId}`.
   - same key + same payload => return stored response snapshot (`replayed: true`)
   - same key + different payload => fail with `CONFLICT_ERROR`
4. Compute fee breakdown with `FeeEngineService`.
5. Create internal transaction in `INITIATED`.
6. Transition to `PENDING_PROCESSOR` and persist status history.
7. Call processor adapter (`ProcessorAdapterRegistry.getAdapter(...).createPayment(...)`).
8. Store processor transaction reference on the internal transaction.
9. Transition to processor-returned status (`AUTHORIZED` / `FAILED` / `PENDING_PROCESSOR`).
10. Emit structured audit/event entries for each write step.
11. Return normalized partner response (`PartnerPaymentResponse`) with explicit idempotency flags.

## Example normalized responses

### Success

```json
{
  "transactionId": "2e6e2e90-e83d-4481-93aa-04f1b0d58da2",
  "externalReference": "order-123",
  "status": "AUTHORIZED",
  "processor": "SPEEDYPAY",
  "processorReference": "spd_001",
  "amount": { "amountMinor": 10000, "currency": "USD" },
  "netAmountMinor": 9690,
  "feeBreakdown": {
    "processorFeeMinor": 200,
    "platformFeeMinor": 100,
    "partnerFeeMinor": 10,
    "totalFeeMinor": 310
  },
  "idempotency": { "key": "idem-key-123", "replayed": false },
  "auditTrail": {
    "createdAt": "2026-04-01T10:11:12.000Z",
    "updatedAt": "2026-04-01T10:11:13.000Z"
  }
}
```

### Failure (merchant mapping invalid)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Merchant is not mapped to the requested processor.",
    "details": {
      "merchantId": "m_001",
      "partnerId": "p_001",
      "processor": "SPEEDYPAY"
    }
  }
}
```

### Duplicate idempotent replay

```json
{
  "transactionId": "2e6e2e90-e83d-4481-93aa-04f1b0d58da2",
  "externalReference": "order-123",
  "status": "AUTHORIZED",
  "processor": "SPEEDYPAY",
  "processorReference": "spd_001",
  "amount": { "amountMinor": 10000, "currency": "USD" },
  "netAmountMinor": 9690,
  "feeBreakdown": {
    "processorFeeMinor": 200,
    "platformFeeMinor": 100,
    "partnerFeeMinor": 10,
    "totalFeeMinor": 310
  },
  "idempotency": { "key": "idem-key-123", "replayed": true },
  "auditTrail": {
    "createdAt": "2026-04-01T10:11:12.000Z",
    "updatedAt": "2026-04-01T10:11:13.000Z"
  }
}
```
