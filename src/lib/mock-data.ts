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
  { id: 'm_1022', partnerId: 'p_ent_02', name: 'Aeon Logistics', industry: 'Logistics & Supply Chain', status: 'active', createdAt: daysAgo(30) },
  { id: 'm_4451', partnerId: 'p_ent_02', name: 'Titan Energy', industry: 'Utility Infrastructure', status: 'active', createdAt: daysAgo(15) },
];

export const MOCK_PROCESSORS: Processor[] = [
  { id: 'proc_sp_v1', name: 'SpeedyPay V1', type: 'card', adapterKey: 'speedypay_pci_v1', status: 'active' },
  { id: 'proc_gd_ach', name: 'GlobalDirect ACH', type: 'bank', adapterKey: 'globaldirect_ach_v2', status: 'active' },
];

export const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 30 }).map((_, i) => {
  const statusList: TransactionStatus[] = ['succeeded', 'succeeded', 'failed', 'processing', 'reversed', 'refunded'];
  const status = statusList[i % statusList.length];
  const createdAt = minutesAgo(i * 45 + 10);
  const baseAmount = 1500000 + (i * 50000); 
  
  // Scenarios for client email alignment
  const isDirectRemittance = i % 2 === 0;
  const platformBps = 1000; // 10%
  const platformFee = Math.round(baseAmount * (platformBps / 10000));
  const processorFee = 5000; // Fixed processor cost
  const netAmount = baseAmount - platformFee - processorFee;

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
    reconStatus: i % 7 === 0 ? 'mismatch' : 'matched',
    paymentMethod: i % 2 === 0 ? 'visa' : 'mastercard',
    createdAt,
    updatedAt: createdAt,
    computedFees: {
      platformFixed: 0,
      platformBps: platformBps,
      partnerCut: Math.round(baseAmount * 0.005),
      processorFee: processorFee,
      merchantNet: netAmount
    },
    timeline: [
      { id: `ev_01_${i}`, status: 'pending', timestamp: createdAt, note: 'Ingested via Partner API (Direct Remittance)' },
      { id: `ev_02_${i}`, status: 'processing', timestamp: minutesAgo(i * 45 + 8), note: 'Authorized via SpeedyPay V1' },
      { id: `ev_03_${i}`, status: status, timestamp: minutesAgo(i * 45 + 7), note: 'Status transition complete. Funds locked for settlement.' }
    ]
  };
});

export const MOCK_WEBHOOKS: WebhookEvent[] = [
  { id: 'wh_ev_01', correlationId: MOCK_TRANSACTIONS[0].correlationId!, processorId: 'proc_sp_v1', payload: { event: 'payment.capture.succeeded', trace_id: 'TRACE-500000' }, receivedAt: minutesAgo(5), processingStatus: 'completed', retryCount: 0 },
  { id: 'wh_ev_02', correlationId: MOCK_TRANSACTIONS[2].correlationId!, processorId: 'proc_sp_v1', payload: { event: 'payment.auth.failed', error_code: 'insufficient_funds' }, receivedAt: minutesAgo(12), processingStatus: 'completed', retryCount: 0 },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'audit_881', userId: 'usr_ops_01', userEmail: 'm.thorne@collopay.com', action: 'ENABLE_DIRECT_REMITTANCE', resourceType: 'Merchant', resourceId: 'm_8821', timestamp: minutesAgo(45), ipAddress: '10.0.42.12' },
  { id: 'audit_882', userId: 'usr_ops_01', userEmail: 'm.thorne@collopay.com', action: 'UPDATE_FEE_RULE', resourceType: 'FeeRule', resourceId: 'fr_9921', timestamp: minutesAgo(120), ipAddress: '10.0.42.12', previousValue: { platformBps: 200 }, newValue: { platformBps: 250 } },
];

export const MOCK_SETTLEMENTS: Settlement[] = [
  { id: 'set_bt_1002', merchantId: 'm_8821', amount: 248500000, currency: 'PHP', status: 'completed', initiatedAt: daysAgo(1), completedAt: hoursAgo(4), transactionCount: 1422, varianceDetected: false },
  { id: 'set_bt_1003', merchantId: 'm_9932', amount: 12240000, currency: 'PHP', status: 'pending', initiatedAt: hoursAgo(2), transactionCount: 88, varianceDetected: true, reconNote: 'Internal ledger total exceeds processor settlement file by ₱1,200.00' },
];

export const MOCK_API_KEYS: APIKey[] = [
  { id: 'ak_prod_01', name: 'GFS-Production-Direct', ownerId: 'p_ent_01', ownerType: 'partner', keyPrefix: 'CP_LIVE_8F...', status: 'active', createdAt: daysAgo(120), lastUsedAt: minutesAgo(2) },
  { id: 'ak_prod_02', name: 'Vantage-Ops-Ledger', ownerId: 'p_ent_02', ownerType: 'partner', keyPrefix: 'CP_LIVE_4A...', status: 'active', createdAt: daysAgo(40), lastUsedAt: hoursAgo(1) },
];

export const MOCK_FEE_RULES: FeeRule[] = [
  { id: 'fr_global_def', partnerId: 'system', fixedFee: 1500, percentageFee: 290, effectiveFrom: daysAgo(365), status: 'active' },
  { id: 'fr_gfs_override', partnerId: 'p_ent_01', fixedFee: 1000, percentageFee: 250, effectiveFrom: daysAgo(90), status: 'active' },
  { id: 'fr_strat_override', partnerId: 'p_ent_01', merchantId: 'm_8821', fixedFee: 800, percentageFee: 220, effectiveFrom: daysAgo(30), status: 'active' },
];
