import { z } from 'zod';
import { DomainError } from './errors';
import {
  FEE_TYPES,
  PROCESSOR_TYPES,
  type CreateTransactionRequest,
  type FeeRule,
  type Merchant,
  type ProcessorMapping,
  type ProcessorWebhookEvent,
} from './types';

const currencySchema = z.enum(['USD', 'KES', 'EUR']);

export const createPaymentRequestSchema = z.object({
  idempotencyKey: z.string().min(8).max(128),
  externalReference: z.string().min(3).max(64),
  merchant: z.object({
    merchantId: z.string().min(2),
    partnerId: z.string().min(2),
  }),
  amount: z.object({
    amountMinor: z.number().int().positive(),
    currency: currencySchema,
  }),
  processor: z.enum(PROCESSOR_TYPES),
  captureMode: z.enum(['AUTOMATIC', 'MANUAL']).optional(),
  customer: z
    .object({
      customerId: z.string().min(2).optional(),
      email: z.string().email().optional(),
      phone: z.string().min(6).max(32).optional(),
    })
    .optional(),
  metadata: z.record(z.string()).optional(),
});

export const createMerchantSchema = z.object({
  id: z.string().min(2),
  partnerId: z.string().min(2),
  name: z.string().min(2).max(120),
  externalReference: z.string().min(3).max(64),
  categoryCode: z.string().max(16).optional(),
  defaultCurrency: currencySchema,
  status: z.enum(['ACTIVE', 'SUSPENDED', 'INACTIVE']),
  metadata: z.record(z.string()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createFeeRuleSchema = z
  .object({
    id: z.string().min(2),
    partnerId: z.string().min(2).optional(),
    merchantId: z.string().min(2).optional(),
    processorType: z.enum(PROCESSOR_TYPES).optional(),
    feeType: z.enum(FEE_TYPES),
    basisPoints: z.number().int().min(0).max(100_000).optional(),
    flatAmountMinor: z.number().int().min(0).optional(),
    minFeeMinor: z.number().int().min(0).optional(),
    maxFeeMinor: z.number().int().min(0).optional(),
    effectiveFrom: z.string().datetime(),
    effectiveTo: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .superRefine((value, ctx) => {
    if (value.feeType === 'PERCENTAGE_BPS' && value.basisPoints === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'basisPoints is required for percentage fee rules.' });
    }

    if (value.feeType === 'FLAT' && value.flatAmountMinor === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'flatAmountMinor is required for flat fee rules.' });
    }

    if (value.minFeeMinor !== undefined && value.maxFeeMinor !== undefined && value.minFeeMinor > value.maxFeeMinor) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'minFeeMinor cannot be greater than maxFeeMinor.' });
    }
  });

export const createProcessorMappingSchema = z.object({
  id: z.string().min(2),
  merchantId: z.string().min(2),
  processorId: z.string().min(2),
  priority: z.number().int().min(1).max(999),
  enabled: z.boolean(),
  routeRules: z.record(z.string()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const incomingWebhookPayloadEnvelopeSchema = z.object({
  processor: z.enum(PROCESSOR_TYPES),
  eventId: z.string().min(3),
  eventType: z.string().min(3),
  occurredAt: z.string().datetime(),
  signature: z.string().optional(),
  payload: z.unknown().refine((value) => value !== undefined, 'payload is required'),
});

export function validateCreateTransactionRequest(input: CreateTransactionRequest): CreateTransactionRequest {
  const parsed = createPaymentRequestSchema.safeParse(input);

  if (!parsed.success) {
    throw new DomainError('Invalid transaction create request.', 'VALIDATION_ERROR', {
      issues: parsed.error.issues,
    });
  }

  return parsed.data;
}

export function validateCreateMerchant(input: Merchant): Merchant {
  return validateOrThrow(createMerchantSchema, input, 'Invalid merchant create request.');
}

export function validateCreateFeeRule(input: FeeRule): FeeRule {
  return validateOrThrow(createFeeRuleSchema, input, 'Invalid fee rule create request.');
}

export function validateCreateProcessorMapping(input: ProcessorMapping): ProcessorMapping {
  return validateOrThrow(createProcessorMappingSchema, input, 'Invalid processor mapping create request.');
}

export function validateProcessorWebhookEvent(input: ProcessorWebhookEvent): ProcessorWebhookEvent {
  const parsed = incomingWebhookPayloadEnvelopeSchema.safeParse(input);
  if (!parsed.success) {
    throw new DomainError('Invalid processor webhook event.', 'VALIDATION_ERROR', { issues: parsed.error.issues });
  }

  return parsed.data as ProcessorWebhookEvent;
}

function validateOrThrow<T>(schema: z.ZodType<T>, input: T, message: string): T {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    throw new DomainError(message, 'VALIDATION_ERROR', { issues: parsed.error.issues });
  }

  return parsed.data;
}
