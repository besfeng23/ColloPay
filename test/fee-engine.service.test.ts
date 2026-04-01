import { describe, expect, it } from 'vitest';
import { FeeEngineService } from '../src/backend/application/services/fee-engine.service';

describe('FeeEngineService', () => {
  const service = new FeeEngineService({
    percentageByPaymentMethod: {
      card: 0.03,
      bank_transfer: 0.01,
      wallet: 0.02
    },
    fixedFeeByCurrency: {
      USD: 0.3,
      EUR: 0.3,
      GBP: 0.2
    },
    processorMarkupPercentage: 0.65
  });

  it('calculates deterministic fee breakdown', () => {
    const fee = service.calculate({ amount: 100, currency: 'USD' }, 'card');

    expect(fee.percentageFee).toBe(3);
    expect(fee.fixedFee).toBe(0.3);
    expect(fee.totalFee).toBe(3.3);
    expect(fee.netAmount).toBe(96.7);
  });
});
