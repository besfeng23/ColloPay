"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_TRANSACTIONS } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Clock, 
  CreditCard, 
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Activity,
  Receipt
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function PartnerTransactionDetailPage() {
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

  return (
    <DashboardLayout type="partner" title="Transaction Forensic">
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8 gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500 p-0">
          <ChevronLeft size={16} className="mr-1" /> Ledger Registry
        </Button>
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">{transaction.partnerTransactionId}</h2>
          <Badge variant={transaction.status === 'succeeded' ? 'default' : 'destructive'} className="uppercase text-[10px] font-black tracking-widest px-3">
            {transaction.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Financial Intel */}
          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50/30 border-b p-6">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Settlement Breakdown</CardTitle>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-slate-900">
                  {mounted ? (transaction.amount / 100).toLocaleString('en-PH', { style: 'currency', currency: transaction.currency }) : '...'}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Gross Transaction Value</p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                <div className="p-6">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Commission Share</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {mounted ? (transaction.computedFees.partnerCut / 100).toLocaleString('en-PH', { style: 'currency', currency: transaction.currency }) : '...'}
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Merchant Net</p>
                  <p className="text-lg font-bold text-slate-900">
                    {mounted ? (transaction.computedFees.merchantNet / 100).toLocaleString('en-PH', { style: 'currency', currency: transaction.currency }) : '...'}
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Method</p>
                  <p className="text-lg font-bold text-slate-900 flex items-center capitalize">
                    <CreditCard size={16} className="mr-2 text-primary" /> {transaction.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="p-8 bg-slate-50/20 border-t space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                  <ShieldCheck size={14} className="mr-2" /> Identification Trace
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ColloPay Trace ID</p>
                    <p className="font-mono text-xs font-bold text-primary">{transaction.internalId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Idempotency Key</p>
                    <p className="font-mono text-xs text-slate-500 truncate">{transaction.idempotencyKey}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/30 border-b p-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center">
                <Clock className="mr-2 text-accent" size={18} />
                Audit Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                {transaction.timeline?.map((event) => (
                  <div key={event.id} className="relative flex items-start group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-slate-50 shadow-sm z-10 shrink-0">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        event.status === 'succeeded' ? 'bg-emerald-500' :
                        event.status === 'failed' ? 'bg-rose-500' :
                        'bg-blue-400 animate-pulse'
                      }`} />
                    </div>
                    <div className="ml-6 flex-1 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{event.status}</span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {mounted ? new Date(event.timestamp).toLocaleString('en-PH') : '...'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{event.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-lg bg-[#0F172A] text-white">
            <CardHeader className="p-6">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                <Activity size={14} className="mr-2" /> Webhook Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Delivery Status</span>
                <span className="text-emerald-400 font-black">SUCCESS (200)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Latency</span>
                <span className="font-black">124ms</span>
              </div>
              <Separator className="bg-slate-800" />
              <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/10 h-10">
                View Raw Callback <ArrowRight size={14} className="ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="p-6 border-b">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Entity Context</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Merchant ID</p>
                <p className="text-xs font-bold text-slate-900">{transaction.merchantId}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Settlement Rail</p>
                <p className="text-xs font-bold text-slate-900">PESONet Next-Day</p>
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t bg-slate-50/30">
              <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest h-10 border-slate-200">
                Download PDF Receipt <Receipt size={14} className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
