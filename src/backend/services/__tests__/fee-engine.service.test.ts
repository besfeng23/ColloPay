import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FeeEngineService,
  type FeePolicyProvider,
  type FeeRuleDefinition,
  type FeeRuleProvider,
} from '../fee-engine.service';

const legacyProvider: FeePolicyProvider = {
  getPolicy: () => ({
    processorBasisPoints: 250,
    platformBasisPoints: 100,
    flatFeeMinor: 25,
  }),
};

const feeRules: FeeRuleDefinition[] = [
  {
    id: 'rule-global-default',
    currency: 'USD',
    ruleType: 'HYBRID',
    platformFee: { basisPoints: 150, fixedMinor: 10 },
    processorFee: { basisPoints: 220 },
    effectiveFrom: '2025-01-01T00:00:00.000Z',
    priority: 1,
    isFallback: true,
  },
  {
    id: 'rule-partner-p1',
    currency: 'USD',
    partnerId: 'p1',
    ruleType: 'PERCENTAGE',
    platformFee: { basisPoints: 120 },
    processorFee: { basisPoints: 200 },
    effectiveFrom: '2025-01-01T00:00:00.000Z',
    priority: 5,
  },
  {
    id: 'rule-merchant-m1-fixed',
    currency: 'USD',
    partnerId: 'p1',
    merchantId: 'm1',
    ruleType: 'FIXED',
    platformFee: { fixedMinor: 99 },
    processorFee: { fixedMinor: 25 },
    effectiveFrom: '2025-01-01T00:00:00.000Z',
    priority: 10,
  },
  {
    id: 'rule-merchant-m1-sale',
    currency: 'USD',
    partnerId: 'p1',
    merchantId: 'm1',
    transactionType: 'SALE',
    ruleType: 'HYBRID',
    platformFee: { basisPoints: 100, fixedMinor: 20 },
    processorFee: { basisPoints: 150 },
    effectiveFrom: '2025-01-01T00:00:00.000Z',
    priority: 7,
  },
  {
    id: 'rule-partner-p1-future',
    currency: 'USD',
    partnerId: 'p1',
    ruleType: 'PERCENTAGE',
    platformFee: { basisPoints: 50 },
    effectiveFrom: '2027-01-01T00:00:00.000Z',
  },
];

const ruleProvider: FeeRuleProvider = {
  listRules: () => feeRules,
};

test('FeeEngineService calculates deterministic fee breakdown (legacy)', () => {
  const service = new FeeEngineService(legacyProvider);

  const result = service.calculate({ amountMinor: 10_000, currency: 'USD' });

  assert.deepEqual(result, {
    processorFeeMinor: 250,
    platformFeeMinor: 125,
    partnerFeeMinor: 0,
    totalFeeMinor: 375,
  });
});

test('FeeEngineService compute picks merchant override over partner and global rules', () => {
  const service = new FeeEngineService(undefined, ruleProvider);

  const result = service.compute({
    partnerId: 'p1',
    merchantId: 'm1',
    amountMinor: 10_000,
    currency: 'USD',
    transactionDate: '2026-03-01T00:00:00.000Z',
  });

  assert.equal(result.matchedFeeRuleId, 'rule-merchant-m1-fixed');
  assert.equal(result.platformFeeMinor, 99);
  assert.equal(result.processorFeeMinor, 25);
  assert.equal(result.netMerchantAmountMinor, 9_876);
  assert.equal(result.warnings.length, 0);
});

test('FeeEngineService compute prioritizes transaction-type specific rule when matching', () => {
  const service = new FeeEngineService(undefined, ruleProvider);

  const result = service.compute({
    partnerId: 'p1',
    merchantId: 'm1',
    amountMinor: 10_000,
    currency: 'USD',
    transactionDate: '2026-03-01T00:00:00.000Z',
    transactionType: 'SALE',
  });

  assert.equal(result.matchedFeeRuleId, 'rule-merchant-m1-sale');
  assert.equal(result.platformFeeMinor, 120);
  assert.equal(result.processorFeeMinor, 150);
  assert.equal(result.netMerchantAmountMinor, 9_730);
  assert.match(result.feeBreakdownExplanation.join(' '), /Rule 'rule-merchant-m1-sale' matched/);
});

test('FeeEngineService compute falls back to global rule with warning', () => {
  const service = new FeeEngineService(undefined, ruleProvider);

  const result = service.compute({
    partnerId: 'p9',
    merchantId: 'm9',
    amountMinor: 10_000,
    currency: 'USD',
    transactionDate: '2026-03-01T00:00:00.000Z',
  });

  assert.equal(result.matchedFeeRuleId, 'rule-global-default');
  assert.equal(result.platformFeeMinor, 160);
  assert.equal(result.processorFeeMinor, 220);
  assert.equal(result.netMerchantAmountMinor, 9_620);
  assert.equal(result.warnings.length, 1);
});

test('FeeEngineService compute respects effective date ranges', () => {
  const service = new FeeEngineService(undefined, {
    listRules: () => [
      {
        id: 'expired',
        currency: 'USD',
        ruleType: 'FIXED',
        platformFee: { fixedMinor: 100 },
        effectiveFrom: '2025-01-01T00:00:00.000Z',
        effectiveTo: '2025-12-31T23:59:59.000Z',
      },
    ],
  });

  assert.throws(() =>
    service.compute({
      partnerId: 'p1',
      merchantId: 'm1',
      amountMinor: 10_000,
      currency: 'USD',
      transactionDate: '2026-03-01T00:00:00.000Z',
    }),
  );
});

test('FeeEngineService rejects invalid non-positive amount', () => {
  const service = new FeeEngineService(legacyProvider);

  assert.throws(() => service.calculate({ amountMinor: 0, currency: 'USD' }));
});
