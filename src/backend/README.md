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
