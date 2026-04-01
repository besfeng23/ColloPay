import type { SpeedyPayClient } from './speedypay-adapter';
import type {
  SpeedyPayCreatePaymentRequest,
  SpeedyPayCreatePaymentResponse,
  SpeedyPayPaymentStatusResponse,
} from './speedypay-types';

export class MockSpeedyPayClient implements SpeedyPayClient {
  private readonly responses = new Map<string, SpeedyPayPaymentStatusResponse>();

  async createPayment(payload: SpeedyPayCreatePaymentRequest): Promise<SpeedyPayCreatePaymentResponse> {
    const transactionId = `mock_sp_${payload.partnerReference}`;
    const initialStatus: SpeedyPayPaymentStatusResponse = {
      transactionId,
      status: 'AUTHORIZED',
      processorCode: 'MOCK_OK',
      processorMessage: 'Mock payment authorized',
    };

    this.responses.set(transactionId, initialStatus);
    return {
      transactionId,
      status: 'AUTHORIZED',
      processorCode: initialStatus.processorCode,
      processorMessage: initialStatus.processorMessage,
    };
  }

  async queryStatus(transactionId: string): Promise<SpeedyPayPaymentStatusResponse> {
    return (
      this.responses.get(transactionId) ?? {
        transactionId,
        status: 'PENDING',
        processorCode: 'MOCK_PENDING',
      }
    );
  }

  async verifyWebhookSignature(signature: string | undefined): Promise<boolean> {
    return signature === 'mock-valid-signature';
  }
}
