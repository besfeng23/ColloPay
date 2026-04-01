# SpeedyPay Adapter Integration Layer

This package keeps the ColloPay domain and partner-facing API generic while containing all SpeedyPay-specific concerns behind `ProcessorAdapter`.

## Boundaries

- Domain/service layers only call generic adapter methods (`createPayment`, `queryPaymentStatus`, `processWebhook`, `normalizeProcessorResponse`).
- SpeedyPay wire formats live in `speedypay-types.ts`.
- Internal ↔ SpeedyPay mapping lives in `speedypay-mapper.ts`.

## Configuration

Use `buildSpeedyPayConfigFromEnv` to load credentials and endpoints from environment variables.
Do not commit actual keys/secrets.

## Error normalization strategy

- Convert processor transport/errors to a `DomainError` with code `INTEGRATION_ERROR`.
- Keep processor-specific details in `details` payload (`operation`, `message`, `processorTransactionId`/`externalReference`).
- Avoid leaking processor response objects to domain exceptions.

## Logging strategy

- Log structured adapter lifecycle events:
  - `processor.create_payment.request`
  - `processor.query_status.request`
  - `processor.webhook.processed`
  - `processor.request.failed`
- Include non-sensitive context only (`eventId`, references, mode, operation).
- Never log credential material.

## Mock/test harness

`MockSpeedyPayClient` supports local/staging integration testing without network dependencies.
- deterministic transaction IDs (`mock_sp_<partnerReference>`)
- deterministic signature simulation (`mock-valid-signature`)
- in-memory status store for status query calls
