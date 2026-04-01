import { Partner, Merchant, Transaction, Processor, Settlement, AuditLog, FeeRule, WebhookEvent, TransactionStatus, ReconStatus, APIKey } from './types';

// Deterministic recent timestamps
const now = new Date();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

export const MOCK_PARTNERS: Partner[] = [
  { id: 'p_ent_01', name: 'Global Finance Systems', contactEmail: 'compliance@gfs-global.com', status: 'active', createdAt: daysAgo(120) },
  { id: 'p_ent_02', name: 'Vantage Payment Group', contactEmail: 'ops@vantagepay.io', status: 'active', createdAt: daysAgo(95) },
];

export const MOCK_MERCHANTS: Merchant[] = [
  { id: 'm_8821', partnerId: 'p_ent_01', name: 'Stratosphere Retail', industry: 'Enterprise E-commerce', status: 'active', createdAt: daysAgo(60) },
  { id: 'm_9932', partnerId: 'p_ent_01', name: 'Novus SaaS Platform', industry: 'Software Subscriptions', status: 'active', createdAt: daysAgo(45) },
];

export const MOCK_PROCESSORS: Processor[] = [
  { id: 'proc_sp_v1', name: 'SpeedyPay V1', type: 'card', adapterKey: 'speedypay_pci_v1', status: 'active' },
  { id: 'proc_gd_ach', name: 'GlobalDirect ACH', type: 'bank', adapterKey: 'globaldirect_ach_v2', status: 'active' },
];

export const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 25 }).map((_, i) => {
  const statusList: TransactionStatus[] = ['succeeded', 'succeeded', 'failed', 'processing'];
  const status = statusList[i % statusList.length];
  const createdAt = minutesAgo(i * 45 + 10);
  const baseAmount = 1500000 + (i * 50000); // Realistic PHP amounts
  
  // Create Split Data for Diagram 1 (10% Platform) and Diagram 2 (Multi-Merchant)
  const isSplit = i % 5 === 0;
  const platformFee = Math.round(baseAmount * 0.1); // 10% Platform fee per email diagram
  const netAmount = baseAmount - platformFee - 5000; // Deduct processor costs too

  return {
    id: `tx_sys_${10000 + i}`,
    internalId: `CP-${50000 + i}`,
    partnerTransactionId: `EXT-${200000 + i}`,
    processorTransactionId: `AUTH-${300000 + i}`,
    idempotencyKey: `IDEM-${400000 + i}`,
    correlationId: `TRACE-${500000 + i}`,
    partnerId: MOCK_PARTNERS[i % MOCK_PARTNERS.length].id,
    merchantId: MOCK_MERCHANTS[i % MOCK_MERCHANTS.length].id,
    processorId: MOCK_PROCESSORS[i % 2].id,
    amount: baseAmount, 
    currency: 'PHP',
    status,
    reconStatus: 'matched',
    paymentMethod: i % 2 === 0 ? 'visa' : 'mastercard',
    createdAt,
    updatedAt: createdAt,
    computedFees: {
      platformFixed: 0,
      platformBps: 1000, // 10%
      partnerCut: Math.round(baseAmount * 0.005),
      processorFee: 5000,
      merchantNet: netAmount
    },
    // Remittance manifest align with diagrams
    timeline: [
      { id: `ev_01_${i}`, status: 'pending', timestamp: createdAt, note: 'Ingested via Partner API' },
      { id: `ev_03_${i}`, status: status, timestamp: minutesAgo(i * 45 + 7), note: 'Remittance scheduled to client account' }
    ]
  };
});

export const MOCK_WEBHOOKS: WebhookEvent[] = [
  { id: 'wh_ev_01', correlationId: MOCK_TRANSACTIONS[0].correlationId!, processorId: 'proc_sp_v1', payload: { event: 'payment.capture.succeeded' }, receivedAt: minutesAgo(5), processingStatus: 'completed', retryCount: 0 },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'audit_881', userId: 'usr_ops_01', userEmail: 'm.thorne@collopay.com', action: 'ENABLE_DIRECT_REMITTANCE', resourceType: 'Merchant', resourceId: 'm_8821', timestamp: minutesAgo(45), ipAddress: '10.0.42.12' },
];

export const MOCK_SETTLEMENTS: Settlement[] = [
  { id: 'set_bt_1002', merchantId: 'm_8821', amount: 248500000, currency: 'PHP', status: 'completed', initiatedAt: daysAgo(1), completedAt: hoursAgo(4), transactionCount: 1422, varianceDetected: false },
];

export const MOCK_API_KEYS: APIKey[] = [
  { id: 'ak_prod_01', name: 'GFS-Production-Direct', ownerId: 'p_ent_01', ownerType: 'partner', keyPrefix: 'CP_LIVE_8F...', status: 'active', createdAt: daysAgo(120), lastUsedAt: minutesAgo(2) },
];