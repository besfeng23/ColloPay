import type { FeeBreakdown, Money, PaymentMethodType } from '../../domain/types/transaction.types';

export interface FeePolicy {
  percentageByPaymentMethod: Record<PaymentMethodType, number>;
  fixedFeeByCurrency: Record<Money['currency'], number>;
  processorMarkupPercentage: number;
}

export class FeeEngineService {
  constructor(private readonly policy: FeePolicy) {}

  calculate(amount: Money, paymentMethodType: PaymentMethodType): FeeBreakdown {
    const percentage = this.policy.percentageByPaymentMethod[paymentMethodType];
    const fixedFee = this.policy.fixedFeeByCurrency[amount.currency] ?? 0;

    const percentageFee = this.round2(amount.amount * percentage);
    const processorFee = this.round2(percentageFee * this.policy.processorMarkupPercentage);
    const platformFee = this.round2(percentageFee - processorFee + fixedFee);
    const totalFee = this.round2(percentageFee + fixedFee);
    const netAmount = this.round2(amount.amount - totalFee);

    return {
      percentageFee,
      fixedFee,
      processorFee,
      platformFee,
      totalFee,
      netAmount
    };
  }

  private round2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
