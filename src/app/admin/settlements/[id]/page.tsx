
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_SETTLEMENTS, MOCK_MERCHANTS, MOCK_TRANSACTIONS } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  History, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Scale,
  Receipt,
  Building2,
  Calendar,
  Clock
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

export default function SettlementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const settlement = MOCK_SETTLEMENTS.find(s => s.id === params.id);
  if (!settlement) return <div className="p-8 text-center text-muted-foreground">Settlement batch not found.</div>;

  const merchant = MOCK_MERCHANTS.find(m => m.id === settlement.merchantId);
  const includedTransactions = MOCK_TRANSACTIONS.filter(t => t.merchantId === merchant?.id).slice(0, 8);

  return (
    <DashboardLayout type="admin" title="Settlement Forensic">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500 p-0">
            <ChevronLeft size={16} className="mr-1" /> All Batches
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Scale size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900">{settlement.id}</h2>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Merchant: {merchant?.name}</p>
            </div>
            <Badge variant={settlement.status === 'completed' ? 'default' : 'secondary'} className="uppercase text-[10px] font-black">
              {settlement.status}
            </Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="bg-white border-slate-200 h-10 text-[10px] font-black uppercase tracking-widest px-6">
            <Download size={14} className="mr-2" /> Export Ledger
          </Button>
          <Button className="bg-primary text-white h-10 text-[10px] font-black uppercase tracking-widest px-8 shadow-lg shadow-primary/20">
            Re-Verify Batch
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Financial Reconciliation Summary */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/30 border-b p-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Funding Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                <div className="p-6">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Gross Batch Value</p>
                  <p className="text-xl font-black text-slate-900">
                    {mounted ? (settlement.amount / 100).toLocaleString('en-US', { style: 'currency', currency: settlement.currency }) : '...'}
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee Deductions</p>
                  <p className="text-xl font-black text-rose-600">
                    {mounted ? (- (settlement.amount * 0.025) / 100).toLocaleString('en-US', { style: 'currency', currency: settlement.currency }) : '...'}
                  </p>
                </div>
                <div className="p-6 bg-slate-50/50">
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Net Disbursement</p>
                  <p className="text-xl font-black text-primary">
                    {mounted ? ((settlement.amount * 0.975) / 100).toLocaleString('en-US', { style: 'currency', currency: settlement.currency }) : '...'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Included Transactions */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/30 border-b p-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Transaction Manifest</CardTitle>
              <CardDescription className="text-xs">Consolidated records forming this settlement batch</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/20">
                  <TableRow>
                    <TableHead className="text-[10px] font-black uppercase pl-8 h-12">Trace ID</TableHead>
                    <TableHead className="text-[10px] font-black uppercase h-12">Processor Ref</TableHead>
                    <TableHead className="text-[10px] font-black uppercase h-12">Amount</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-right pr-8 h-12">Forensic</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {includedTransactions.map((tx) => (
                    <TableRow key={tx.id} className="h-16 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{tx.internalId}</TableCell>
                      <TableCell className="font-mono text-[10px] text-slate-400">{tx.processorTransactionId}</TableCell>
                      <TableCell className="text-sm font-black text-slate-900">
                        {(tx.amount / 100).toLocaleString('en-US', { style: 'currency', currency: tx.currency })}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Link href={`/admin/transactions/${tx.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                            <ExternalLink size={14} />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="p-4 border-t bg-slate-50/30 justify-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End of Manifest • {settlement.transactionCount} entries consolidated</p>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Status & Timing */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <div className={`h-1 ${settlement.varianceDetected ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
            <CardHeader className="p-6 pb-2 border-b">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Lifecycle Intel</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-start space-x-3">
                <Calendar size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Generation Time</p>
                  <p className="text-xs font-bold text-slate-900">{mounted ? new Date(settlement.initiatedAt).toLocaleString() : '...'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Verification Status</p>
                  <p className="text-xs font-bold text-emerald-600">Reconciled & Locked</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Building2 size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Bank rail</p>
                  <p className="text-xs font-bold text-slate-900">Fedwire (Direct)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variance Warning */}
          {settlement.varianceDetected && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-3 text-rose-600">
                <AlertTriangle size={20} className="animate-pulse" />
                <h4 className="text-sm font-black uppercase tracking-widest">Variance Detected</h4>
              </div>
              <p className="text-[11px] text-rose-700 leading-relaxed font-medium">
                {settlement.reconNote || "Internal ledger mismatch vs processor settlement file. Manual review required to unlock disbursement."}
              </p>
              <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest h-10 text-[10px] shadow-lg shadow-rose-100">
                Initiate Manual Review
              </Button>
            </div>
          )}

          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-6 pb-2 border-b bg-slate-50/30">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Audit Documentation</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-all text-left group">
                <div className="flex items-center space-x-3">
                  <Receipt size={16} className="text-slate-400 group-hover:text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Generation Log</span>
                </div>
                <ArrowRight size={14} className="text-slate-300" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-all text-left group">
                <div className="flex items-center space-x-3">
                  <ShieldCheck size={16} className="text-slate-400 group-hover:text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Cryptographic Seal</span>
                </div>
                <ArrowRight size={14} className="text-slate-300" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
