import { z } from 'zod';
import { DomainError } from './errors';
import type { CreateTransactionRequest, ProcessorWebhookEvent } from './types';

const createTransactionSchema = z.object({
  idempotencyKey: z.string().min(8).max(128),
  externalReference: z.string().min(3).max(64),
  merchant: z.object({
    merchantId: z.string().min(2),
    partnerId: z.string().min(2),
  }),
  amount: z.object({
    amountMinor: z.number().int().positive(),
    currency: z.enum(['USD', 'KES', 'EUR']),
  }),
  processor: z.enum(['SPEEDYPAY']),
  metadata: z.record(z.string()).optional(),
});

const processorWebhookSchema = z.object({
  processor: z.enum(['SPEEDYPAY']),
  eventId: z.string().min(3),
  eventType: z.string().min(3),
  occurredAt: z.string().datetime(),
  signature: z.string().optional(),
  payload: z.unknown(),
});

export function validateCreateTransactionRequest(input: CreateTransactionRequest): CreateTransactionRequest {
  const parsed = createTransactionSchema.safeParse(input);

  if (!parsed.success) {
    throw new DomainError('Invalid transaction create request.', 'VALIDATION_ERROR', {
      issues: parsed.error.issues,
    });
  }

  return parsed.data;
}

export function validateProcessorWebhookEvent(input: ProcessorWebhookEvent): ProcessorWebhookEvent {
  const parsed = processorWebhookSchema.safeParse(input);

  if (!parsed.success) {
    throw new DomainError('Invalid processor webhook event.', 'VALIDATION_ERROR', {
      issues: parsed.error.issues,
    });
  }

  return {
    processor: parsed.data.processor,
    eventId: parsed.data.eventId,
    eventType: parsed.data.eventType,
    occurredAt: parsed.data.occurredAt,
    signature: parsed.data.signature,
    payload: parsed.data.payload,
  };
}
