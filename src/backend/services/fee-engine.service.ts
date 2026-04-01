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
  /** Higher values win when specificity is tied. */
  priority?: number;
  /** Mark global safety-net rules so caller can emit warnings. */
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

function assertSafeMinorAmount(value: number, field: string): void {
  if (!Number.isInteger(value) || !Number.isSafeInteger(value) || value < 0) {
    throw new DomainError(`${field} must be a non-negative safe integer in minor units.`, 'VALIDATION_ERROR', { value });
  }
}

function toEpoch(date: string, field: string): number {
  const epoch = Date.parse(date);
  if (Number.isNaN(epoch)) {
    throw new DomainError(`${field} is not a valid ISO date string.`, 'VALIDATION_ERROR', { value: date });
  }

  return epoch;
}

function computeComponent(component: FeeComponentRule | undefined, amountMinor: number): { feeMinor: number; detail: string } {
  if (!component) {
    return { feeMinor: 0, detail: 'not configured (0)' };
  }

  const basisPoints = component.basisPoints ?? 0;
  const fixedMinor = component.fixedMinor ?? 0;

  assertSafeMinorAmount(fixedMinor, 'Fee fixedMinor');

  if (!Number.isInteger(basisPoints) || !Number.isSafeInteger(basisPoints) || basisPoints < 0) {
    throw new DomainError('Fee basisPoints must be a non-negative safe integer.', 'VALIDATION_ERROR', { basisPoints });
  }

  let computed = Math.round((amountMinor * basisPoints) / BASIS_POINTS_DENOMINATOR) + fixedMinor;

  if (component.minMinor !== undefined) {
    assertSafeMinorAmount(component.minMinor, 'Fee minMinor');
    computed = Math.max(computed, component.minMinor);
  }

  if (component.maxMinor !== undefined) {
    assertSafeMinorAmount(component.maxMinor, 'Fee maxMinor');
    computed = Math.min(computed, component.maxMinor);
  }

  if (!Number.isSafeInteger(computed) || computed < 0) {
    throw new DomainError('Computed fee is outside safe money bounds.', 'VALIDATION_ERROR', { computed });
  }

  return {
    feeMinor: computed,
    detail: `${basisPoints}bps + ${fixedMinor} minor => ${computed}`,
  };
}

function specificityScore(rule: FeeRuleDefinition): number {
  if (rule.merchantId) {
    return 3;
  }

  if (rule.partnerId) {
    return 2;
  }

  return 1;
}

function transactionTypeScore(rule: FeeRuleDefinition, inputType?: string): number {
  if (!rule.transactionType) {
    return 1;
  }

  return rule.transactionType === inputType ? 2 : 0;
}

export class FeeEngineService {
  constructor(
    private readonly feePolicyProvider?: FeePolicyProvider,
    private readonly feeRuleProvider?: FeeRuleProvider,
  ) {}

  /**
   * Legacy breakdown for existing orchestration paths.
   */
  calculate(input: { amountMinor: number; currency: CurrencyCode }): FeeBreakdown {
    if (!this.feePolicyProvider) {
      throw new DomainError('Fee policy provider is not configured for legacy calculate().', 'INTEGRATION_ERROR');
    }

    if (input.amountMinor <= 0) {
      throw new DomainError('Cannot calculate fees on non-positive transaction amount.', 'VALIDATION_ERROR');
    }

    const policy = this.feePolicyProvider.getPolicy(input.currency);
    const processorFeeMinor = Math.round((input.amountMinor * policy.processorBasisPoints) / BASIS_POINTS_DENOMINATOR);
    const platformFeeMinor = Math.round((input.amountMinor * policy.platformBasisPoints) / BASIS_POINTS_DENOMINATOR) + policy.flatFeeMinor;
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

  compute(input: FeeComputationInput): FeeCalculationResult {
    if (!this.feeRuleProvider) {
      throw new DomainError('Fee rule provider is not configured for compute().', 'INTEGRATION_ERROR');
    }

    assertSafeMinorAmount(input.amountMinor, 'Transaction amountMinor');
    if (input.amountMinor <= 0) {
      throw new DomainError('Cannot calculate fees on non-positive transaction amount.', 'VALIDATION_ERROR');
    }

    const txEpoch = toEpoch(input.transactionDate, 'transactionDate');

    const eligibleRules = this.feeRuleProvider
      .listRules(input.currency)
      .filter((rule) => rule.currency === input.currency)
      .filter((rule) => {
        if (rule.merchantId && rule.merchantId !== input.merchantId) {
          return false;
        }

        if (rule.partnerId && rule.partnerId !== input.partnerId) {
          return false;
        }

        if (rule.transactionType && rule.transactionType !== input.transactionType) {
          return false;
        }

        const from = toEpoch(rule.effectiveFrom, `rule(${rule.id}).effectiveFrom`);
        const to = rule.effectiveTo ? toEpoch(rule.effectiveTo, `rule(${rule.id}).effectiveTo`) : Number.POSITIVE_INFINITY;
        return txEpoch >= from && txEpoch <= to;
      });

    if (eligibleRules.length === 0) {
      throw new DomainError('No active fee rule matched transaction attributes.', 'VALIDATION_ERROR', {
        input,
      });
    }

    const rankedRules = [...eligibleRules].sort((a, b) => {
      const bySpecificity = specificityScore(b) - specificityScore(a);
      if (bySpecificity !== 0) {
        return bySpecificity;
      }

      const byTxType = transactionTypeScore(b, input.transactionType) - transactionTypeScore(a, input.transactionType);
      if (byTxType !== 0) {
        return byTxType;
      }

      const byPriority = (b.priority ?? 0) - (a.priority ?? 0);
      if (byPriority !== 0) {
        return byPriority;
      }

      const byEffectiveFrom = toEpoch(b.effectiveFrom, `rule(${b.id}).effectiveFrom`) - toEpoch(a.effectiveFrom, `rule(${a.id}).effectiveFrom`);
      if (byEffectiveFrom !== 0) {
        return byEffectiveFrom;
      }

      const byCreatedAt = toEpoch(b.createdAt ?? b.effectiveFrom, `rule(${b.id}).createdAt`) -
        toEpoch(a.createdAt ?? a.effectiveFrom, `rule(${a.id}).createdAt`);
      if (byCreatedAt !== 0) {
        return byCreatedAt;
      }

      return a.id.localeCompare(b.id);
    });

    const selectedRule = rankedRules[0];

    const platform = computeComponent(selectedRule.platformFee, input.amountMinor);
    const processor = computeComponent(selectedRule.processorFee, input.amountMinor);

    const totalFeeMinor = platform.feeMinor + processor.feeMinor;

    if (!Number.isSafeInteger(totalFeeMinor) || totalFeeMinor >= input.amountMinor) {
      throw new DomainError('Fee stack is invalid: net amount would be zero or negative.', 'VALIDATION_ERROR', {
        selectedRule,
        input,
      });
    }

    const warnings: string[] = [];
    if (selectedRule.isFallback || (!selectedRule.partnerId && !selectedRule.merchantId)) {
      warnings.push(`Fallback/default fee rule '${selectedRule.id}' was applied.`);
    }

    return {
      matchedFeeRuleId: selectedRule.id,
      grossAmountMinor: input.amountMinor,
      platformFeeMinor: platform.feeMinor,
      processorFeeMinor: processor.feeMinor,
      netMerchantAmountMinor: input.amountMinor - totalFeeMinor,
      feeBreakdownExplanation: [
        `Rule '${selectedRule.id}' matched (type=${selectedRule.ruleType}, priority=${selectedRule.priority ?? 0}).`,
        `Platform fee: ${platform.detail}.`,
        `Processor fee: ${processor.detail}.`,
        `Net amount: ${input.amountMinor} - ${totalFeeMinor} = ${input.amountMinor - totalFeeMinor}.`,
      ],
      warnings,
    };
  }
}
