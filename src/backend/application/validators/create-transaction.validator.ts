import { z } from 'zod';

export const createTransactionSchema = z.object({
  partnerId: z.string().min(1),
  idempotencyKey: z.string().min(8),
  externalReference: z.string().min(1),
  processor: z.string().min(1),
  paymentMethodType: z.enum(['card', 'bank_transfer', 'wallet']),
  paymentMethodToken: z.string().min(1),
  amount: z.object({
    amount: z.number().positive(),
    currency: z.enum(['USD', 'EUR', 'GBP'])
  }),
  metadata: z.record(z.string()).default({})
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
