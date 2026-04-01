# ColloPay Backend Architecture (Domain-Oriented)

## Proposed backend folder structure

```text
src/backend
├── api/                         # Firebase HTTPS endpoints / callable handlers
│   ├── controllers/             # Thin transport handlers
│   ├── dto/                     # API contracts and response mappers
│   └── middleware/              # Authn/authz, idempotency header extraction
├── application/
│   ├── errors/                  # Shared typed domain/application errors
│   ├── interfaces/              # Ports: adapters, repositories
│   ├── services/                # Use-cases and orchestration services
│   └── validators/              # Input validation schemas
├── domain/
│   ├── entities/                # Core aggregates (Transaction)
│   ├── events/                  # Audit and domain event contracts
│   ├── rules/                   # Status transition invariants
│   └── types/                   # Shared domain types/value structures
├── infrastructure/
│   ├── adapters/processors/     # Processor-specific implementations
│   ├── logging/                 # Audit/event logging providers
│   ├── persistence/             # Firebase/Firestore connectors
│   └── repositories/            # Repository implementations
└── shared/                      # Shared utilities (clock, ids, tracing)
```

## Refactored domain/service layout

- Transaction lifecycle is governed by `TransactionStatusService` + transition rules.
- Fees are centralized in `FeeEngineService` to avoid duplication.
- Transaction creation flow is orchestrated by `TransactionOrchestrationService`.
- Webhooks are parsed/verified in processor adapters and applied by `WebhookProcessingService`.
- Idempotency locking is encapsulated by `IdempotencyService`.
- All sensitive operations emit `AuditEvent` via `AuditLogger`.

## Production-readiness hardening backlog

1. Replace in-memory repositories with Firestore implementations using transactional writes.
2. Add distributed lock provider for idempotency (Redis/Firestore lease docs with TTL + heartbeat).
3. Implement cryptographic webhook signature verification with timing-safe compare.
4. Add retry/circuit breaker policies for processor HTTP calls and webhook workflows.
5. Add outbox/event bus for async downstream events (reconciliation, notifications).
6. Add metrics/tracing (OpenTelemetry) for per-processor latency and failure rates.
7. Encrypt or tokenize sensitive metadata and enforce PII field allow-lists.
8. Add dead-letter queue for invalid webhook payloads.
9. Add role-aware audit enrichment (request IDs, actor identity, IP, environment).
10. Add chaos/integration tests against processor sandbox and Firebase emulator.
