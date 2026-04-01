import { Partner, Merchant, Transaction, Processor, Settlement, AuditLog, FeeRule, WebhookEvent, TransactionStatus, ReconStatus, APIKey } from './types';

export const MOCK_PARTNERS: Partner[] = [
  { id: 'p1', name: 'ColloPay Enterprise', contactEmail: 'ops@collo.com', status: 'active', createdAt: '2024-01-15T10:00:00Z' },
  { id: 'p2', name: 'Vortex Capital', contactEmail: 'partners@vortex.com', status: 'active', createdAt: '2024-02-10T12:00:00Z' },
];

export const MOCK_MERCHANTS: Merchant[] = [
  { id: 'm1', partnerId: 'p1', name: 'Blue Horizon Retail', industry: 'E-commerce', status: 'active', createdAt: '2024-01-20T14:30:00Z' },
  { id: 'm2', partnerId: 'p1', name: 'Summit Dynamics', industry: 'SaaS', status: 'active', createdAt: '2024-01-25T11:20:00Z' },
  { id: 'm3', partnerId: 'p2', name: 'Iron Gate Security', industry: 'Services', status: 'active', createdAt: '2024-02-15T16:45:00Z' },
  { id: 'm4', partnerId: 'p1', name: 'Lumina Tech Labs', industry: 'Software', status: 'active', createdAt: '2024-03-01T09:00:00Z' },
  { id: 'm5', partnerId: 'p2', name: 'Global Logistics', industry: 'Transportation', status: 'under_review', createdAt: '2024-03-05T10:00:00Z' },
  { id: 'm6', partnerId: 'p1', name: 'Natura Wellness', industry: 'Healthcare', status: 'active', createdAt: '2024-03-10T15:30:00Z' },
];

export const MOCK_PROCESSORS: Processor[] = [
  { id: 'proc1', name: 'SpeedyPay', type: 'card', adapterKey: 'speedypay_v1', status: 'active' },
  { id: 'proc2', name: 'GlobalDirect', type: 'bank', adapterKey: 'globaldirect_ach', status: 'active' },
];

export const MOCK_FEE_RULES: FeeRule[] = [
  { id: 'fr1', partnerId: 'p1', fixedFee: 15, percentageFee: 290, effectiveFrom: '2024-01-01T00:00:00Z', status: 'active' },
  { id: 'fr2', partnerId: 'p1', merchantId: 'm2', fixedFee: 10, percentageFee: 250, effectiveFrom: '2024-01-01T00:00:00Z', status: 'active' },
  { id: 'fr3', partnerId: 'p2', fixedFee: 25, percentageFee: 310, effectiveFrom: '2024-02-01T00:00:00Z', status: 'active' },
];

export const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 40 }).map((_, i) => {
  const statusList: TransactionStatus[] = ['succeeded', 'succeeded', 'succeeded', 'failed', 'processing', 'reversed', 'refunded'];
  const reconStatusList: ReconStatus[] = ['matched', 'matched', 'mismatch', 'pending', 'matched'];
  
  const status = statusList[i % statusList.length];
  const reconStatus = reconStatusList[i % reconStatusList.length];
  
  const baseDate = new Date('2024-03-01T12:00:00Z').getTime();
  const createdAt = new Date(baseDate + (i * 3600000 * 4)).toISOString();
  
  return {
    id: `tx-${2000 + i}`,
    internalId: `cp-${6000 + i}`,
    partnerTransactionId: `ptr-${100000 + i}`,
    processorTransactionId: `proc-${200000 + i}`,
    idempotencyKey: `idemp-${300000 + i}`,
    correlationId: `corr-${400000 + i}`,
    partnerId: MOCK_PARTNERS[i % MOCK_PARTNERS.length].id,
    merchantId: MOCK_MERCHANTS[i % MOCK_MERCHANTS.length].id,
    processorId: MOCK_PROCESSORS[0].id,
    amount: 15000 + (i * 1250), 
    currency: 'USD',
    status,
    reconStatus,
    paymentMethod: 'visa',
    createdAt,
    updatedAt: createdAt,
    computedFees: {
      platformFixed: 15,
      platformBps: 290,
      partnerCut: 50,
      processorFee: 250,
      merchantNet: (15000 + (i * 1250)) - 605 
    },
    timeline: [
      { id: `e1-${i}`, status: 'pending', timestamp: createdAt, note: 'Request initiated via API' },
      { id: `e2-${i}`, status: 'processing', timestamp: createdAt, note: 'Dispatched to SpeedyPay Adapter' },
      { id: `e3-${i}`, status: status, timestamp: createdAt, note: `Processor response: ${status}` }
    ]
  };
});

export const MOCK_WEBHOOKS: WebhookEvent[] = [
  { id: 'wh-1', correlationId: MOCK_TRANSACTIONS[0].correlationId!, processorId: 'proc1', payload: { event: 'payment.success', amount: 15000 }, receivedAt: '2024-03-21T09:00:00Z', processingStatus: 'completed', retryCount: 0 },
  { id: 'wh-2', correlationId: 'unknown-corr', processorId: 'proc1', payload: { event: 'payment.failed' }, receivedAt: '2024-03-21T09:15:00Z', processingStatus: 'failed', retryCount: 3, lastError: 'Transaction record not found in internal ledger' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', userId: 'u1', userEmail: 'admin@collopay.com', action: 'UPDATE_FEE_RULE', resourceType: 'FeeRule', resourceId: 'fr1', previousValue: { percentageFee: 300 }, newValue: { percentageFee: 290 }, timestamp: '2024-03-21T10:15:00Z', ipAddress: '192.168.1.1' },
  { id: 'log-2', userId: 'u1', userEmail: 'admin@collopay.com', action: 'REVOKE_API_KEY', resourceType: 'APIKey', resourceId: 'ak-99', previousValue: { status: 'active' }, newValue: { status: 'revoked' }, timestamp: '2024-03-21T11:20:00Z', ipAddress: '192.168.1.1' },
];

export const MOCK_SETTLEMENTS: Settlement[] = [
  { id: 'set-1', merchantId: 'm1', amount: 845000, currency: 'USD', status: 'completed', initiatedAt: '2024-03-20T08:00:00Z', completedAt: '2024-03-20T14:00:00Z', transactionCount: 142, varianceDetected: false },
  { id: 'set-2', merchantId: 'm2', amount: 215000, currency: 'USD', status: 'pending', initiatedAt: '2024-03-21T08:00:00Z', transactionCount: 38, varianceDetected: true, reconNote: 'Awaiting webhook confirmation for 1 terminal transaction' },
];

export const MOCK_API_KEYS: APIKey[] = [
  { id: 'ak-1', name: 'Production Main', ownerId: 'p1', ownerType: 'partner', keyPrefix: 'cp_live_pk_8f...', status: 'active', createdAt: '2024-01-20T10:00:00Z', lastUsedAt: '2024-03-21T15:30:00Z' },
  { id: 'ak-2', name: 'Sandbox Test', ownerId: 'p1', ownerType: 'partner', keyPrefix: 'cp_test_pk_2a...', status: 'active', createdAt: '2024-01-20T10:05:00Z', lastUsedAt: '2024-03-21T14:10:00Z' },
];
