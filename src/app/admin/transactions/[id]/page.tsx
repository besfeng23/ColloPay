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
  CheckCircle2,
  Activity,
  ArrowRight,
  ShieldCheck,
  Building2,
  ArrowDownCircle,
  Split,
  Wallet
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
  if (!transaction) return <div className="p-8 text-center text-muted-foreground">Transaction not found.</div>;

  const partner = MOCK_PARTNERS.find(p => p.id === transaction.partnerId);
  const merchant = MOCK_MERCHANTS.find(m => m.id === transaction.merchantId);
  const processor = MOCK_PROCESSORS.find(p => p.id === transaction.processorId);

  return (
    <DashboardLayout type="admin" title="Transaction Forensic">
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8 gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500 p-0 hover:bg-transparent">
          <ChevronLeft size={16} className="mr-1" /> Ledger
        </Button>
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-black tracking-tight font-mono text-slate-900">{transaction.internalId}</h2>
          <Badge variant={transaction.status === 'succeeded' ? 'default' : 'destructive'} className="uppercase text-[10px] font-black px-3">
            {transaction.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Email Request Alignment: Settlement Flow Diagram */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/30 border-b p-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center">
                <Split className="mr-2 text-primary" size={18} />
                Settlement Remittance Flow
              </CardTitle>
              <CardDescription className="text-xs">Visualizing direct remittance to merchant account and platform fee extraction.</CardDescription>
            </CardHeader>
            <CardContent className="p-10">
              <div className="flex flex-col items-center justify-center space-y-8">
                {/* Source */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <Activity size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400">Gross Inbound</p>
                    <p className="text-sm font-black text-slate-900">₱{(transaction.amount / 100).toLocaleString()}</p>
                  </div>
                </div>

                <ArrowDownCircle className="text-slate-200" size={24} />

                {/* Processing */}
                <div className="w-full max-w-sm p-4 bg-primary/5 border border-primary/10 rounded-2xl text-center">
                  <p className="text-[10px] font-black uppercase text-primary mb-1">ColloPay Orchestration</p>
                  <p className="text-xs text-slate-600 font-medium">Extracting Platform & Processor Fees</p>
                </div>

                <div className="flex items-center justify-between w-full max-w-md relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-slate-100 -z-10"></div>
                  
                  {/* Platform Split (Diagram 1) */}
                  <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm text-center">
                    <div className="w-8 h-8 bg-accent/10 text-accent rounded-lg flex items-center justify-center mx-auto mb-2">
                      <ShieldCheck size={16} />
                    </div>
                    <p className="text-[9px] font-black uppercase text-slate-400">Platform (10%)</p>
                    <p className="text-xs font-bold text-slate-900">₱{(transaction.computedFees.platformBps / 100).toLocaleString()}</p>
                  </div>

                  {/* Direct Remittance (Diagram 1 & 2) */}
                  <div className="bg-white border border-emerald-100 p-4 rounded-xl shadow-sm text-center scale-110 ring-4 ring-emerald-50">
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Wallet size={16} />
                    </div>
                    <p className="text-[9px] font-black uppercase text-emerald-600">Client Net</p>
                    <p className="text-xs font-bold text-emerald-700">₱{(transaction.computedFees.merchantNet / 100).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b p-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Audit Trail</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                {transaction.timeline?.map((event) => (
                  <div key={event.id} className="relative flex items-start group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-slate-50 shadow-sm z-10 shrink-0">
                      <div className={`w-2.5 h-2.5 rounded-full ${event.status === 'succeeded' ? 'bg-emerald-500' : 'bg-blue-400'}`} />
                    </div>
                    <div className="ml-6 flex-1 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-slate-700">{event.status}</p>
                      <p className="text-xs text-slate-600 font-medium mt-1">{event.note}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-2">{mounted ? new Date(event.timestamp).toLocaleString() : '...'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-8">
          <Card className="border-none shadow-lg bg-[#0F172A] text-white">
            <CardHeader className="p-6">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Gross Amount</span>
                <span className="font-bold">₱{(transaction.amount / 100).toLocaleString()} PHP</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Total Fees</span>
                <span className="text-rose-400 font-bold">-₱{( (transaction.amount - transaction.computedFees.merchantNet) / 100).toLocaleString()}</span>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex flex-col items-center py-4 bg-white/5 rounded-xl">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Direct Remittance Value</p>
                <p className="text-2xl font-black text-emerald-400">₱{(transaction.computedFees.merchantNet / 100).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="p-6 border-b">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Entity Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Building2 size={16} className="text-primary" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Primary Merchant</p>
                  <p className="text-xs font-bold text-slate-900">{merchant?.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldCheck size={16} className="text-primary" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Merchant of Record</p>
                  <p className="text-xs font-bold text-emerald-600">Client Account (Direct)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}