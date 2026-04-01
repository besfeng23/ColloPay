import { DomainError } from '../domain/errors';
import type { CurrencyCode, FeeBreakdown, TransactionSplit, PaymentRequest } from '../domain/types';

export interface FeePolicy {
  processorBasisPoints: number;
  platformBasisPoints: number;
  flatFeeMinor: number;
}

export interface FeePolicyProvider {
  getPolicy(currency: CurrencyCode): FeePolicy;
}

export type FeeRuleType = 'PERCENTAGE' | 'FIXED' | 'HYBRID';

export interface FeeComponentRule {
  basisPoints?: number;
  fixedMinor?: number;
  minMinor?: number;
  maxMinor?: number;
}

export interface FeeRuleDefinition {
  id: string;
  currency: CurrencyCode;
  ruleType: FeeRuleType;
  platformFee: FeeComponentRule;
  processorFee?: FeeComponentRule;
  partnerId?: string;
  merchantId?: string;
  transactionType?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  priority?: number;
  isFallback?: boolean;
  createdAt?: string;
}

export interface FeeComputationInput {
  partnerId: string;
  merchantId: string;
  amountMinor: number;
  currency: CurrencyCode;
  transactionDate: string;
  transactionType?: string;
}

export interface FeeCalculationResult {
  matchedFeeRuleId: string;
  grossAmountMinor: number;
  platformFeeMinor: number;
  processorFeeMinor: number;
  netMerchantAmountMinor: number;
  feeBreakdownExplanation: string[];
  warnings: string[];
}

export interface FeeRuleProvider {
  listRules(currency: CurrencyCode): FeeRuleDefinition[];
}

const BASIS_POINTS_DENOMINATOR = 10_000;

export class FeeEngineService {
  constructor(
    private readonly feePolicyProvider?: FeePolicyProvider,
    private readonly feeRuleProvider?: FeeRuleProvider,
  ) {}

  calculate(input: { amountMinor: number; currency: CurrencyCode }): FeeBreakdown {
    if (!this.feePolicyProvider) {
      throw new DomainError('Fee policy provider is not configured.', 'INTEGRATION_ERROR');
    }

    const policy = this.feePolicyProvider.getPolicy(input.currency);
    const processorFeeMinor = Math.round((input.amountMinor * policy.processorBasisPoints) / BASIS_POINTS_DENOMINATOR);
    const platformFeeMinor = Math.round((input.amountMinor * policy.platformBasisPoints) / BASIS_POINTS_DENOMINATOR) + policy.flatFeeMinor;
    
    return {
      processorFeeMinor,
      platformFeeMinor,
      partnerFeeMinor: 0,
      totalFeeMinor: processorFeeMinor + platformFeeMinor,
    };
  }

  /**
   * Distributes transaction proceeds according to split config (Email Diagram Alignment)
   */
  generateSplits(
    transactionId: string,
    amount: { amountMinor: number; currency: CurrencyCode },
    fees: FeeBreakdown,
    splitConfig?: PaymentRequest['splitConfig']
  ): TransactionSplit[] {
    const splits: TransactionSplit[] = [];
    const { amountMinor, currency } = amount;

    // 1. Processor Split (Infrastructure cost)
    splits.push({
      id: `split_${transactionId}_proc`,
      transactionId,
      beneficiaryType: 'PROCESSOR',
      beneficiaryId: 'system_processor',
      amountMinor: fees.processorFeeMinor,
      currency,
      description: 'Upstream acquisition fee'
    });

    // 2. Platform Split (ColloPay platform fee)
    splits.push({
      id: `split_${transactionId}_plat`,
      transactionId,
      beneficiaryType: 'PLATFORM',
      beneficiaryId: 'collopay_treasury',
      amountMinor: fees.platformFeeMinor,
      currency,
      description: 'Platform service fee'
    });

    // 3. Settlement Remaining (Net Amount)
    const netProceeds = amountMinor - fees.totalFeeMinor;

    if (splitConfig && splitConfig.type === 'MULTI_MERCHANT') {
      // Split proceeds among multiple merchants (Diagram 2)
      splitConfig.beneficiaries.forEach((ben, i) => {
        const splitAmount = Math.round((netProceeds * ben.shareBps) / BASIS_POINTS_DENOMINATOR);
        splits.push({
          id: `split_${transactionId}_ben_${i}`,
          transactionId,
          beneficiaryType: ben.type,
          beneficiaryId: ben.id,
          amountMinor: splitAmount,
          currency,
          description: `Settlement share (${ben.shareBps / 100}%)`
        });
      });
    } else {
      // Direct remittance to primary merchant (Diagram 1)
      splits.push({
        id: `split_${transactionId}_mch`,
        transactionId,
        beneficiaryType: 'MERCHANT',
        beneficiaryId: 'primary_merchant',
        amountMinor: netProceeds,
        currency,
        description: 'Direct remittance to merchant account'
      });
    }

    return splits;
  }
}