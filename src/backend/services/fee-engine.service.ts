import { DomainError } from '../domain/errors';
import type { CurrencyCode, FeeBreakdown } from '../domain/types';

export interface FeePolicy {
  processorBasisPoints: number;
  platformBasisPoints: number;
  flatFeeMinor: number;
}

export interface FeePolicyProvider {
  getPolicy(currency: CurrencyCode): FeePolicy;
}

export class FeeEngineService {
  constructor(private readonly feePolicyProvider: FeePolicyProvider) {}

  calculate(input: { amountMinor: number; currency: CurrencyCode }): FeeBreakdown {
    if (input.amountMinor <= 0) {
      throw new DomainError('Cannot calculate fees on non-positive transaction amount.', 'VALIDATION_ERROR');
    }

    const policy = this.feePolicyProvider.getPolicy(input.currency);
    const processorFeeMinor = Math.round((input.amountMinor * policy.processorBasisPoints) / 10_000);
    const platformFeeMinor = Math.round((input.amountMinor * policy.platformBasisPoints) / 10_000) + policy.flatFeeMinor;
    const partnerFeeMinor = 0;
    const totalFeeMinor = processorFeeMinor + platformFeeMinor + partnerFeeMinor;

    if (totalFeeMinor >= input.amountMinor) {
      throw new DomainError('Fee stack is invalid: net amount would be zero or negative.', 'VALIDATION_ERROR', {
        input,
        policy,
      });
    }

    return {
      processorFeeMinor,
      platformFeeMinor,
      partnerFeeMinor,
      totalFeeMinor,
    };
  }
}
