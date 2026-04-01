# Production Readiness Notes

## Hardening still required

1. **Persistence and locking**
   - Back repositories with Firestore/Postgres and add transaction-level concurrency controls for status updates.
   - Add unique indexes for `(scope, idempotencyKey)` and `(processor, eventId)`.

2. **Outbox/eventing**
   - Emit domain events from transaction state updates using outbox pattern.
   - Add dead-letter queues for failed downstream handlers.

3. **Security**
   - Rotate processor credentials through Secret Manager.
   - Enforce strict webhook replay windows and HMAC signature timestamp checks.

4. **Observability**
   - Add structured logging with correlation IDs and idempotency keys.
   - Add metrics for authorization rate, processor latency, retry counts, and webhook failure rates.

5. **Resilience**
   - Add retry policies with exponential backoff for processor calls.
   - Add circuit-breaker behavior per processor adapter.

6. **Compliance and governance**
   - Ensure PCI scope reduction/tokenization strategy.
   - Apply audit log immutability and retention policies.

7. **API concerns**
   - Introduce API versioning and schema evolution strategy.
   - Add request/response contracts at edge with explicit error codes.
