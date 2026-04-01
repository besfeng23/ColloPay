"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_TRANSACTIONS, MOCK_PARTNERS, MOCK_MERCHANTS, MOCK_PROCESSORS } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Clock, 
  CreditCard, 
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const transaction = MOCK_TRANSACTIONS.find(t => t.id === params.id);
  
  if (!transaction) return (
    <div className="p-8 text-center text-muted-foreground">Transaction record not found.</div>
  );

  const partner = MOCK_PARTNERS.find(p => p.id === transaction.partnerId);
  const merchant = MOCK_MERCHANTS.find(m => m.id === transaction.merchantId);
  const processor = MOCK_PROCESSORS.find(p => p.id === transaction.processorId);

  return (
    <DashboardLayout type="admin" title="Transaction Forensic">
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 lg:mb-8 gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500 hover:bg-slate-100 p-0 sm:px-3">
          <ChevronLeft size={16} className="mr-1" /> Back to Ledger
        </Button>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight font-mono text-slate-900 truncate max-w-[200px] sm:max-w-none">
            {transaction.internalId}
          </h2>
          <Badge variant={transaction.status === 'succeeded' ? 'default' : 'destructive'} className="uppercase text-[9px] sm:text-[10px] font-black tracking-widest px-3 py-0.5">
            {transaction.status}
          </Badge>
          {transaction.reconStatus === 'matched' && (
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
              <CheckCircle2 size={12} />
              <span className="hidden xs:inline">Reconciled</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50/50 border-b p-4 sm:p-6">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Payment Lifecycle</CardTitle>
                <CardDescription className="text-xs">Canonical record of this financial event</CardDescription>
              </div>
              <div className="text-left sm:text-right mt-2 sm:mt-0">
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  {mounted ? (transaction.amount / 100).toLocaleString('en-PH', { style: 'currency', currency: transaction.currency }) : '...'}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Gross Transaction Amount</p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-0 divide-y xs:divide-y-0 xs:divide-x divide-slate-100">
                <div className="p-4 sm:p-6 space-y-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Method</p>
                  <p className="text-sm font-bold text-slate-900 flex items-center capitalize">
                    <CreditCard size={14} className="mr-2 text-primary" /> {transaction.paymentMethod}
                  </p>
                </div>
                <div className="p-4 sm:p-6 space-y-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Currency</p>
                  <p className="text-sm font-bold text-slate-900">{transaction.currency}</p>
                </div>
                <div className="p-4 sm:p-6 space-y-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Initiated</p>
                  <p className="text-sm font-bold text-slate-900">{mounted ? new Date(transaction.createdAt).toLocaleDateString() : '...'}</p>
                </div>
                <div className="p-4 sm:p-6 space-y-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Last Update</p>
                  <p className="text-sm font-bold text-slate-900">{mounted ? new Date(transaction.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}</p>
                </div>
              </div>

              <div className="p-4 sm:p-8 bg-slate-50/20 border-t">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center">
                  <ShieldCheck size={14} className="mr-2" /> Reference Identification Trace
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Partner Ref</span>
                    <span className="font-mono text-[11px] font-bold bg-white px-2 py-1 rounded border shadow-sm truncate max-w-[120px]">{transaction.partnerTransactionId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Processor ID</span>
                    <span className="font-mono text-[11px] font-bold bg-white px-2 py-1 rounded border shadow-sm truncate max-w-[120px]">{transaction.processorTransactionId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Idempotency</span>
                    <span className="font-mono text-[10px] font-bold text-slate-400 truncate max-w-[120px]">{transaction.idempotencyKey || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Correlation</span>
                    <span className="font-mono text-[10px] font-bold text-slate-400 truncate max-w-[120px]">{transaction.correlationId || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b p-4 sm:p-6">
              <CardTitle className="text-base font-bold flex items-center">
                <Clock className="mr-2 text-accent" size={18} />
                Audit Trail & State Transitions
              </CardTitle>
              <CardDescription className="text-xs">Immutable sequence of events for this transaction</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-8">
              <div className="relative space-y-6 sm:space-y-8 before:absolute before:inset-0 before:ml-[18px] sm:before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                {transaction.timeline?.map((event) => (
                  <div key={event.id} className="relative flex items-start group">
                    <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-slate-50 shadow-sm z-10 shrink-0 group-hover:scale-110 transition-transform">
                      <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                        event.status === 'succeeded' ? 'bg-emerald-500' :
                        event.status === 'failed' ? 'bg-rose-500' :
                        event.status === 'processing' ? 'bg-blue-400 animate-pulse' :
                        'bg-slate-300'
                      }`} />
                    </div>
                    <div className="ml-4 sm:ml-6 flex-1 bg-slate-50/50 p-3 sm:p-4 rounded-xl border border-slate-100 group-hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1">
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-700">{event.status}</span>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold">
                          {mounted ? new Date(event.timestamp).toLocaleString() : '...'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium">{event.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-6 lg:space-y-8">
          {/* Parties involved */}
          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <div className="h-1 bg-accent"></div>
            <CardHeader className="p-4 sm:p-6 pb-2">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Integrated Entities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              <div className="space-y-1.5">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Enterprise Partner</p>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 truncate pr-2">{partner?.name}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-accent shrink-0"><ExternalLink size={14} /></Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Merchant Entity</p>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 truncate pr-2">{merchant?.name}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-accent shrink-0"><ExternalLink size={14} /></Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Acquiring Processor</p>
                <div className="flex flex-col space-y-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-accent">{processor?.name}</span>
                    <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest bg-white h-4">Live</Badge>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{processor?.adapterKey}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fee Analysis */}
          <Card className="border-none shadow-lg bg-[#0F172A] text-white overflow-hidden">
            <CardHeader className="p-4 sm:p-6 pb-4">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                <Activity size={14} className="mr-2" /> Financial Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-slate-400 font-medium">Platform Service Fee</span>
                <span className="font-bold">{(transaction.computedFees.platformFixed / 100 + transaction.computedFees.platformBps / 100).toFixed(2)} PHP</span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-slate-400 font-medium">Partner Commission</span>
                <span className="font-bold">{(transaction.computedFees.partnerCut / 100).toFixed(2)} PHP</span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-slate-400 font-medium">Upstream Cost</span>
                <span className="font-bold">{(transaction.computedFees.processorFee / 100).toFixed(2)} PHP</span>
              </div>
              <Separator className="bg-slate-800" />
              <div className="flex flex-col items-center py-4 bg-white/5 rounded-xl">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Merchant Net Disbursement</p>
                <p className="text-2xl sm:text-3xl font-black font-mono tracking-tighter">
                  {(transaction.computedFees.merchantNet / 100).toLocaleString('en-PH', { style: 'currency', currency: transaction.currency })}
                </p>
              </div>
            </CardContent>
            <CardFooter className="bg-white/5 p-3 sm:p-4">
              <Button variant="ghost" className="w-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/10 transition-all">
                View Fee Rule Configuration
              </Button>
            </CardFooter>
          </Card>

          {/* Actions */}
          <div className="flex flex-col space-y-3">
            <Button className="w-full bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest h-11 shadow-lg shadow-accent/20 text-[11px]">
              <RefreshCw size={16} className="mr-2" /> Force Re-Reconcile
            </Button>
            <Button variant="outline" className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 font-black uppercase tracking-widest h-11 text-[11px]">
              Initiate Refund / Reversal
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
