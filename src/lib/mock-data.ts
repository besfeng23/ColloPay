import { Partner, Merchant, Transaction, Processor, Settlement, AuditLog } from './types';

export const MOCK_PARTNERS: Partner[] = [
  { id: 'p1', name: 'Collo Pay', contactEmail: 'ops@collo.com', status: 'active', createdAt: '2024-01-15T10:00:00Z' },
  { id: 'p2', name: 'Vortex Capital', contactEmail: 'partners@vortex.com', status: 'active', createdAt: '2024-02-10T12:00:00Z' },
  { id: 'p3', name: 'Lumina Tech', contactEmail: 'support@lumina.io', status: 'onboarding', createdAt: '2024-03-01T09:00:00Z' },
];

export const MOCK_MERCHANTS: Merchant[] = [
  { id: 'm1', partnerId: 'p1', name: 'Blue Horizon Retail', industry: 'E-commerce', status: 'active', createdAt: '2024-01-20T14:30:00Z' },
  { id: 'm2', partnerId: 'p1', name: 'Summit Dynamics', industry: 'SaaS', status: 'active', createdAt: '2024-01-25T11:20:00Z' },
  { id: 'm3', partnerId: 'p2', name: 'Iron Gate Security', industry: 'Services', status: 'active', createdAt: '2024-02-15T16:45:00Z' },
];

export const MOCK_PROCESSORS: Processor[] = [
  { id: 'proc1', name: 'SpeedyPay', type: 'card', adapterKey: 'speedypay_v1', status: 'active' },
  { id: 'proc2', name: 'GlobalDirect', type: 'bank', adapterKey: 'globaldirect_ach', status: 'active' },
  { id: 'proc3', name: 'BlockRail', type: 'crypto', adapterKey: 'blockrail_eth', status: 'maintenance' },
];

export const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `tx-${1000 + i}`,
  internalId: `cp-${5000 + i}`,
  externalRef: `sp-${Math.random().toString(36).substring(7).toUpperCase()}`,
  partnerId: MOCK_PARTNERS[i % MOCK_PARTNERS.length].id,
  merchantId: MOCK_MERCHANTS[i % MOCK_MERCHANTS.length].id,
  processorId: MOCK_PROCESSORS[0].id,
  amount: Math.floor(Math.random() * 50000) + 1000, // 10.00 to 510.00
  currency: 'USD',
  status: ['succeeded', 'succeeded', 'succeeded', 'failed', 'processing', 'refunded'][Math.floor(Math.random() * 6)] as any,
  paymentMethod: 'visa',
  createdAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  computedFees: {
    platformFee: 15,
    processorFee: 290,
    partnerCut: 50,
    merchantNet: 0, // Calculated below
  }
})).map(tx => ({
  ...tx,
  computedFees: {
    ...tx.computedFees,
    merchantNet: tx.amount - (tx.computedFees.platformFee + tx.computedFees.processorFee + tx.computedFees.partnerCut)
  }
}));

export const MOCK_SETTLEMENTS: Settlement[] = [
  { id: 'set-1', merchantId: 'm1', amount: 450000, currency: 'USD', status: 'completed', initiatedAt: '2024-03-20T08:00:00Z', completedAt: '2024-03-20T14:00:00Z', transactionCount: 125 },
  { id: 'set-2', merchantId: 'm2', amount: 120000, currency: 'USD', status: 'pending', initiatedAt: '2024-03-21T08:00:00Z', transactionCount: 42 },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', userId: 'u1', userEmail: 'admin@collopay.com', action: 'UPDATE_FEE_RULE', resourceType: 'FeeRule', resourceId: 'fr-10', previousValue: { rate: 0.025 }, newValue: { rate: 0.023 }, timestamp: '2024-03-21T10:15:00Z', ipAddress: '192.168.1.1' },
  { id: 'log-2', userId: 'u2', userEmail: 'ops@collopay.com', action: 'SUSPEND_PARTNER', resourceType: 'Partner', resourceId: 'p3', timestamp: '2024-03-21T11:45:00Z', ipAddress: '10.0.0.5' },
];
