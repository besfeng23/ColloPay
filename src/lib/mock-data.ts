import { Partner, Merchant, Transaction, Processor, Settlement, AuditLog, FeeRule, WebhookEvent, TransactionStatus, ReconStatus, APIKey } from './types';

// Deterministic recent timestamps
const now = new Date();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

export const MOCK_PARTNERS: Partner[] = [
  { id: 'p_ent_01', name: 'Global Finance Systems', contactEmail: 'compliance@gfs-global.com', status: 'active', createdAt: daysAgo(120) },
  { id: 'p_ent_02', name: 'Vantage Payment Group', contactEmail: 'ops@vantagepay.io', status: 'active', createdAt: daysAgo(95) },
  { id: 'p_ent_03', name: 'Apex Treasury Solutions', contactEmail: 'security@apextreasury.com', status: 'onboarding', createdAt: daysAgo(2) },
];

export const MOCK_MERCHANTS: Merchant[] = [
  { id: 'm_8821', partnerId: 'p_ent_01', name: 'Stratosphere Retail', industry: 'Enterprise E-commerce', status: 'active', createdAt: daysAgo(60) },
  { id: 'm_9932', partnerId: 'p_ent_01', name: 'Novus SaaS Platform', industry: 'Software Subscriptions', status: 'active', createdAt: daysAgo(45) },
  { id: 'm_4412', partnerId: 'p_ent_02', name: 'IronClad Security Services', industry: 'Professional Services', status: 'active', createdAt: daysAgo(30) },
  { id: 'm_7721', partnerId: 'p_ent_01', name: 'Lumina Digital Media', industry: 'Digital Content', status: 'active', createdAt: daysAgo(15) },
  { id: 'm_1102', partnerId: 'p_ent_02', name: 'Global Logistics Hub', industry: 'Logistics', status: 'under_review', createdAt: daysAgo(5) },
  { id: 'm_5592', partnerId: 'p_ent_01', name: 'Nexus Health Systems', industry: 'Healthcare', status: 'active', createdAt: daysAgo(20) },
];

export const MOCK_PROCESSORS: Processor[] = [
  { id: 'proc_sp_v1', name: 'SpeedyPay V1', type: 'card', adapterKey: 'speedypay_pci_v1', status: 'active' },
  { id: 'proc_gd_ach', name: 'GlobalDirect ACH', type: 'bank', adapterKey: 'globaldirect_ach_v2', status: 'active' },
  { id: 'proc_wire_intl', name: 'Intl Wire Gateway', type: 'bank', adapterKey: 'swift_direct_v1', status: 'maintenance' },
];

export const MOCK_FEE_RULES: FeeRule[] = [
  { id: 'fr_std_01', partnerId: 'p_ent_01', fixedFee: 1500, percentageFee: 290, effectiveFrom: daysAgo(180), status: 'active' },
  { id: 'fr_mch_01', partnerId: 'p_ent_01', merchantId: 'm_9932', fixedFee: 800, percentageFee: 220, effectiveFrom: daysAgo(30), status: 'active' },
  { id: 'fr_vnt_01', partnerId: 'p_ent_02', fixedFee: 2500, percentageFee: 310, effectiveFrom: daysAgo(100), status: 'active' },
];

export const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 50 }).map((_, i) => {
  const statusList: TransactionStatus[] = ['succeeded', 'succeeded', 'succeeded', 'succeeded', 'failed', 'processing', 'reversed', 'refunded'];
  const reconStatusList: ReconStatus[] = ['matched', 'matched', 'matched', 'mismatch', 'pending', 'matched'];
  
  const status = statusList[i % statusList.length];
  const reconStatus = reconStatusList[i % reconStatusList.length];
  
  // Distribute transactions across the last 48 hours
  const createdAt = minutesAgo(i * 45 + 10);
  
  // Scale amounts for PHP realism (e.g., 5,000 PHP to 150,000 PHP)
  const baseAmount = 500000 + (i * 125500); 
  
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
    reconStatus,
    paymentMethod: i % 3 === 0 ? 'mastercard' : 'visa',
    createdAt,
    updatedAt: createdAt,
    computedFees: {
      platformFixed: 1500, // 15 PHP
      platformBps: 290,
      partnerCut: Math.round(baseAmount * 0.001),
      processorFee: Math.round(baseAmount * 0.02),
      merchantNet: baseAmount - Math.round(baseAmount * 0.03)
    },
    timeline: [
      { id: `ev_01_${i}`, status: 'pending', timestamp: createdAt, note: 'Ingested via Partner API (v2.1)' },
      { id: `ev_02_${i}`, status: 'processing', timestamp: minutesAgo(i * 45 + 8), note: `Route matched to ${MOCK_PROCESSORS[i % 2].name}` },
      { id: `ev_03_${i}`, status: status, timestamp: minutesAgo(i * 45 + 7), note: `Processor Handshake: ${status === 'succeeded' ? 'APPROVAL_AUTHORIZED' : 'HARD_DECLINE'}` }
    ]
  };
});

export const MOCK_WEBHOOKS: WebhookEvent[] = [
  { id: 'wh_ev_01', correlationId: MOCK_TRANSACTIONS[0].correlationId!, processorId: 'proc_sp_v1', payload: { event: 'payment.capture.succeeded', traceId: 'tr_9912' }, receivedAt: minutesAgo(5), processingStatus: 'completed', retryCount: 0 },
  { id: 'wh_ev_02', correlationId: 'unknown_ref_001', processorId: 'proc_sp_v1', payload: { event: 'payment.failed', reason: 'insufficient_funds' }, receivedAt: minutesAgo(12), processingStatus: 'failed', retryCount: 3, lastError: 'Non-deterministic correlation: missing target forensic record' },
  { id: 'wh_ev_03', correlationId: MOCK_TRANSACTIONS[1].correlationId!, processorId: 'proc_gd_ach', payload: { event: 'ach.settlement.confirmed' }, receivedAt: hoursAgo(1), processingStatus: 'completed', retryCount: 0 },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'audit_881', userId: 'usr_ops_01', userEmail: 'm.thorne@collopay.com', action: 'RECALIBRATE_FEE_RULE', resourceType: 'FeeRule', resourceId: 'fr_std_01', previousValue: { percentageFee: 300 }, newValue: { percentageFee: 290 }, timestamp: minutesAgo(45), ipAddress: '10.0.42.12' },
  { id: 'audit_882', userId: 'usr_ops_01', userEmail: 'm.thorne@collopay.com', action: 'ROTATE_API_CREDENTIAL', resourceType: 'APIKey', resourceId: 'ak_prod_01', previousValue: { status: 'active' }, newValue: { status: 'rotated' }, timestamp: hoursAgo(3), ipAddress: '10.0.42.12' },
  { id: 'audit_883', userId: 'usr_admin_09', userEmail: 's.chen@collopay.com', action: 'APPROVE_SETTLEMENT_BATCH', resourceType: 'Settlement', resourceId: 'set_batch_991', previousValue: { status: 'pending' }, newValue: { status: 'completed' }, timestamp: hoursAgo(6), ipAddress: '10.0.8.44' },
];

export const MOCK_SETTLEMENTS: Settlement[] = [
  { id: 'set_bt_1002', merchantId: 'm_8821', amount: 248500000, currency: 'PHP', status: 'completed', initiatedAt: daysAgo(1), completedAt: hoursAgo(4), transactionCount: 1422, varianceDetected: false },
  { id: 'set_bt_1003', merchantId: 'm_9932', amount: 112400000, currency: 'PHP', status: 'pending', initiatedAt: hoursAgo(2), transactionCount: 385, varianceDetected: true, reconNote: 'Variance check: 2 transactions flagged for amount mismatch vs processor report' },
];

export const MOCK_API_KEYS: APIKey[] = [
  { id: 'ak_prod_01', name: 'GFS-Production-Direct', ownerId: 'p_ent_01', ownerType: 'partner', keyPrefix: 'CP_LIVE_8F...', status: 'active', createdAt: daysAgo(120), lastUsedAt: minutesAgo(2) },
  { id: 'ak_test_01', name: 'GFS-Sandbox-Testing', ownerId: 'p_ent_01', ownerType: 'partner', keyPrefix: 'CP_TEST_2A...', status: 'active', createdAt: daysAgo(120), lastUsedAt: hoursAgo(1) },
];
