import type { CreateTransactionRequest, Transaction } from '../../domain/types';
import type {
  SpeedyPayCreatePaymentRequest,
  SpeedyPayCreatePaymentResponse,
  SpeedyPayPaymentStatusResponse,
  SpeedyPayWebhookPayload,
} from './speedypay-types';

export function mapCreateTransactionToSpeedyPay(input: CreateTransactionRequest): SpeedyPayCreatePaymentRequest {
  return {
    amountMinor: input.amount.amountMinor,
    currency: input.amount.currency,
    partnerReference: input.externalReference,
    metadata: {
      merchantId: input.merchant.merchantId,
      partnerId: input.merchant.partnerId,
      ...input.metadata,
    },
  };
}

export function mapSpeedyPayStatusToInternal(
  status: SpeedyPayCreatePaymentResponse['status'] | SpeedyPayPaymentStatusResponse['status'] | SpeedyPayWebhookPayload['status'],
): Transaction['status'] {
  switch (status) {
    case 'PENDING':
      return 'PENDING_PROCESSOR';
    case 'AUTHORIZED':
      return 'AUTHORIZED';
    case 'CAPTURED':
      return 'CAPTURED';
    case 'SETTLED':
      return 'SETTLED';
    case 'PARTIALLY_REFUNDED':
      return 'PARTIALLY_REFUNDED';
    case 'REFUNDED':
      return 'REFUNDED';
    case 'FAILED':
      return 'FAILED';
    default:
      return 'PENDING_PROCESSOR';
  }
}

export function mapInternalTransactionToSpeedyPayReference(transaction: Pick<Transaction, 'id' | 'externalReference'>): string {
  return `${transaction.externalReference}:${transaction.id}`;
}
