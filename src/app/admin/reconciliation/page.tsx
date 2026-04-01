"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_TRANSACTIONS } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Search, ArrowRight, Filter, Scale, CheckCircle2, FileWarning, Clock, ShieldAlert } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function ReconciliationPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const exceptions = MOCK_TRANSACTIONS.filter(t => t.reconStatus === 'mismatch' || t.status === 'failed').slice(0, 8);

  return (
    <DashboardLayout type="admin" title="Financial Reconciliation Center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <div className="h-1 bg-emerald-500"></div>
          <CardHeader className="pb-4">
            <CardDescription className="text-[10px] uppercase tracking-widest font-black text-slate-400">Match Accuracy (24h)</CardDescription>
            <CardTitle className="text-3xl font-black text-slate-900">99.82%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit border border-emerald-100">
              <CheckCircle2 size={12} className="mr-1" /> WITHIN SLO PARAMETERS
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <div className="h-1 bg-rose-500"></div>
          <CardHeader className="pb-4">
            <CardDescription className="text-[10px] uppercase tracking-widest font-black text-slate-400">Active Exceptions</CardDescription>
            <CardTitle className="text-3xl font-black text-slate-900">{exceptions.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md w-fit border border-rose-100">
              <AlertTriangle size={12} className="mr-1" /> IMMEDIATE REVIEW REQ
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <div className="h-1 bg-blue-500"></div>
          <CardHeader className="pb-4">
            <CardDescription className="text-[10px] uppercase tracking-widest font-black text-slate-400">Aging Backlog (gt 48h)</CardDescription>
            <CardTitle className="text-3xl font-black text-slate-900">2</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-fit border border-blue-100">
              <Clock size={12} className="mr-1" /> ESCALATION RISK
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative md:w-96">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Filter exceptions (Trace, Amount, Variance)..." className="pl-10 h-11 border-none bg-white shadow-sm text-sm" />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="bg-white border-slate-200 h-11 px-6 font-bold text-[10px] uppercase tracking-widest">
            <Filter size={14} className="mr-2" /> All Processors
          </Button>
          <Button className="bg-primary text-white h-11 px-8 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">
            Resolve Selected
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Manual Investigation Queue</CardTitle>
            <CardDescription className="text-xs">Identified financial variances requiring forensic auditor intervention</CardDescription>
          </div>
          <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
            <ShieldAlert size={14} className="mr-2" />
            Dual-Auth Mode Active
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-8 h-12">Forensic ID / Trace</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-12">Internal Ledger</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-12">Processor Ledger</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-12">Variance Type</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-12">Aging</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right pr-8 h-12">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exceptions.map((tx, idx) => (
                <TableRow key={tx.id} className="border-b border-slate-50 h-20 group hover:bg-slate-50/30 transition-colors">
                  <TableCell className="pl-8">
                    <div className="flex flex-col">
                      <span className="text-xs font-black font-mono text-primary group-hover:underline cursor-pointer">{tx.internalId}</span>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">
                        Proc: {tx.processorTransactionId || 'Awaiting File'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-black text-slate-900">
                    ₱{(tx.amount / 100).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm font-black text-rose-600">
                    {idx % 3 === 0 ? '₱0.00' : 'Null Reference'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-rose-200 bg-rose-50 text-rose-700`}>
                      {idx % 3 === 0 ? 'Amount Mismatch' : 'Missing Callback'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{idx * 2 + 1}h ago</span>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Link href={`/admin/transactions/${tx.id}`}>
                      <Button variant="ghost" size="sm" className="text-primary text-[10px] font-black uppercase tracking-widest h-9 px-4 hover:bg-primary/5 transition-all">
                        Investigate <ArrowRight size={14} className="ml-1.5" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-8 bg-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-white/5">
        <div className="space-y-2">
          <h4 className="text-sm font-black uppercase tracking-widest text-accent">Automated Resolution Engine</h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl font-medium">
            The platform will automatically attempt to resolve "Missing Callback" exceptions via direct processor API status queries every 15 minutes. High-value mismatches (> ₱50,000) are locked for mandatory manual review.
          </p>
        </div>
        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest h-11 px-8 text-[10px] shrink-0">
          Configure Matching Rules
        </Button>
      </div>
    </DashboardLayout>
  );
}
