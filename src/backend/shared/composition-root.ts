import { FeeEngineService } from '../application/services/fee-engine.service';
import { IdempotencyService } from '../application/services/idempotency.service';
import { TransactionStatusService } from '../application/services/transaction-status.service';
import { TransactionOrchestrationService } from '../application/services/transaction-orchestration.service';
import { WebhookProcessingService } from '../application/services/webhook-processing.service';
import { SpeedyPayAdapter } from '../infrastructure/adapters/processors/speedypay/speedypay.adapter';
import {
  InMemoryIdempotencyStore,
  InMemoryStatusTransitionRepository,
  InMemoryTransactionRepository,
  InMemoryWebhookEventRepository
} from '../infrastructure/repositories/in-memory.repositories';
import { ConsoleAuditLogger } from '../infrastructure/logging/console-audit.logger';

export const buildServices = () => {
  const transactionRepository = new InMemoryTransactionRepository();
  const transitionRepository = new InMemoryStatusTransitionRepository();
  const idempotencyStore = new InMemoryIdempotencyStore();
  const webhookRepository = new InMemoryWebhookEventRepository();
  const auditLogger = new ConsoleAuditLogger();

  const adapters = new Map([
    [
      'speedypay',
      new SpeedyPayAdapter(
        {
          post: async () => ({ id: `spd_${Math.random().toString(36).slice(2)}`, status: 'processing' })
        },
        'replace-me'
      )
    ]
  ]);

  const feeEngine = new FeeEngineService({
    percentageByPaymentMethod: {
      card: 0.029,
      bank_transfer: 0.01,
      wallet: 0.019
    },
    fixedFeeByCurrency: {
      USD: 0.3,
      EUR: 0.29,
      GBP: 0.25
    },
    processorMarkupPercentage: 0.7
  });

  const idempotency = new IdempotencyService(idempotencyStore);
  const statusService = new TransactionStatusService(transactionRepository, transitionRepository, auditLogger);

  return {
    feeEngine,
    statusService,
    transactionOrchestration: new TransactionOrchestrationService(
      transactionRepository,
      adapters,
      feeEngine,
      idempotency,
      statusService,
      auditLogger
    ),
    webhookProcessing: new WebhookProcessingService(
      adapters,
      transactionRepository,
      webhookRepository,
      statusService,
      auditLogger
    )
  };
};
