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
  Wallet,
  AlertTriangle,
  Info
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

  const merchant = MOCK_MERCHANTS.find(m => m.id === transaction.merchantId);

  return (
    <DashboardLayout type="admin" title="Transaction Forensic">
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8 gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500 p-0 hover:bg-transparent">
          <ChevronLeft size={16} className="mr-1" /> Ledger
        </Button>
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-black tracking-tight font-mono text-slate-900">{transaction.internalId}</h2>
          <Badge variant={transaction.status === 'succeeded' ? 'default' : transaction.status === 'failed' ? 'destructive' : 'secondary'} className="uppercase text-[10px] font-black px-3">
            {transaction.status}
          </Badge>
          {transaction.reconStatus === 'mismatch' && (
            <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-600 text-[10px] font-black uppercase">
              <AlertTriangle size={10} className="mr-1" /> Reconciliation Variance
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Visual Remittance Flow Diagram */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/30 border-b p-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center">
                    <Split className="mr-2 text-primary" size={18} />
                    Settlement Remittance Flow
                  </CardTitle>
                  <CardDescription className="text-xs">Direct remittance to merchant account with 10% platform fee extraction</CardDescription>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[9px] font-black uppercase">Direct Remittance</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-10">
              <div className="flex flex-col items-center justify-center space-y-8">
                {/* Source Inbound */}
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200 shadow-inner">
                    <Activity size={28} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase text-slate-400">Gross Inbound (Customer)</p>
                    <p className="text-xl font-black text-slate-900">₱{(transaction.amount / 100).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-1">
                  <ArrowDownCircle className="text-primary/30" size={32} />
                  <span className="text-[9px] font-black text-primary/40 uppercase">Orchestration</span>
                </div>

                {/* Processing Logic */}
                <div className="w-full max-w-sm p-5 bg-primary/5 border border-primary/10 rounded-2xl text-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-0.5 rounded-full border border-primary/10 shadow-sm">
                    <ShieldCheck className="text-primary" size={14} />
                  </div>
                  <p className="text-[10px] font-black uppercase text-primary mb-1">ColloPay Gateway Split Logic</p>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Merchant of Record: <strong>{merchant?.name}</strong> <br />
                    Platform Strategy: <strong>10% Flat Bps</strong>
                  </p>
                </div>

                {/* Final Distribution */}
                <div className="flex items-center justify-between w-full max-w-md relative pt-4">
                  <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-px bg-slate-100 -z-10"></div>
                  
                  {/* Platform Split */}
                  <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-center w-40">
                    <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                      <CreditCard size={20} />
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Platform Cut (10%)</p>
                    <p className="text-sm font-black text-slate-900">₱{( (transaction.amount * 0.1) / 100).toLocaleString()}</p>
                  </div>

                  {/* Direct Remittance */}
                  <div className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-md text-center w-44 scale-110 ring-8 ring-emerald-50 relative">
                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                      <CheckCircle2 size={12} />
                    </div>
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                      <Wallet size={20} />
                    </div>
                    <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Client Net (Remit)</p>
                    <p className="text-base font-black text-emerald-700">₱{(transaction.computedFees.merchantNet / 100).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/30 p-4 border-t flex items-center justify-center space-x-2">
              <Info size={14} className="text-slate-400" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Remittance scheduled for InstaPay Batch #1042-A</p>
            </CardFooter>
          </Card>

          {/* Audit Timeline */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b p-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Forensic Audit Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                {transaction.timeline?.map((event) => (
                  <div key={event.id} className="relative flex items-start group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-slate-50 shadow-sm z-10 shrink-0">
                      <div className={`w-2.5 h-2.5 rounded-full ${event.status === 'succeeded' ? 'bg-emerald-500' : 'bg-blue-400'}`} />
                    </div>
                    <div className="ml-6 flex-1 bg-slate-50/50 p-4 rounded-xl border border-slate-100 transition-colors group-hover:bg-slate-50">
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
          <Card className="border-none shadow-lg bg-[#0F172A] text-white overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <ShieldCheck size={100} />
            </div>
            <CardHeader className="p-6 relative z-10">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Financial Integrity Summary</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4 relative z-10">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Gross Amount</span>
                <span className="font-bold">₱{(transaction.amount / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Platform Fee (10%)</span>
                <span className="text-rose-400 font-bold">-₱{( (transaction.amount * 0.1) / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Network/Proc Cost</span>
                <span className="text-rose-400 font-bold">-₱{(transaction.computedFees.processorFee / 100).toLocaleString()}</span>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex flex-col items-center py-5 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Direct Remittance Value</p>
                <p className="text-3xl font-black text-emerald-400">₱{(transaction.computedFees.merchantNet / 100).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-6 border-b bg-slate-50/30">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Merchant of Record</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Building2 size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{merchant?.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Entity ID: {transaction.merchantId}</p>
                </div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center space-x-2 text-emerald-700 mb-1">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-black uppercase">Direct Settlement Verified</span>
                </div>
                <p className="text-[10px] text-emerald-600 leading-relaxed">Funds are cleared directly to the configured settlement account, bypassing platform treasury.</p>
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t bg-slate-50/30">
              <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest border-slate-200">
                View Merchant Ledger
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
