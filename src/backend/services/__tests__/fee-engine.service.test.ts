import test from 'node:test';
import assert from 'node:assert/strict';
import { FeeEngineService, type FeePolicyProvider } from '../fee-engine.service';

const provider: FeePolicyProvider = {
  getPolicy: () => ({
    processorBasisPoints: 250,
    platformBasisPoints: 100,
    flatFeeMinor: 25,
  }),
};

test('FeeEngineService calculates deterministic fee breakdown', () => {
  const service = new FeeEngineService(provider);

  const result = service.calculate({ amountMinor: 10_000, currency: 'USD' });

  assert.deepEqual(result, {
    processorFeeMinor: 250,
    platformFeeMinor: 125,
    partnerFeeMinor: 0,
    totalFeeMinor: 375,
  });
});

test('FeeEngineService rejects invalid non-positive amount', () => {
  const service = new FeeEngineService(provider);

  assert.throws(() => service.calculate({ amountMinor: 0, currency: 'USD' }));
});
