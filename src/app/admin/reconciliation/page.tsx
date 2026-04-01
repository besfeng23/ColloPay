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
import { AlertTriangle, Search, ArrowRight, Filter, Scale, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ReconciliationPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const exceptions = MOCK_TRANSACTIONS.filter(t => t.reconStatus === 'mismatch' || t.status === 'failed');

  return (
    <DashboardLayout type="admin" title="Financial Reconciliation">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <div className="h-1 bg-emerald-500"></div>
          <CardHeader className="pb-4">
            <CardDescription className="text-[10px] uppercase tracking-widest font-black text-slate-400">24h Match Rate</CardDescription>
            <CardTitle className="text-3xl font-black text-slate-900">98.4%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
              <CheckCircle2 size={12} className="mr-1" /> HEALTHY PERFORMANCE
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <div className="h-1 bg-rose-500"></div>
          <CardHeader className="pb-4">
            <CardDescription className="text-[10px] uppercase tracking-widest font-black text-slate-400">Pending Exceptions</CardDescription>
            <CardTitle className="text-3xl font-black text-slate-900">{exceptions.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md w-fit">
              <AlertTriangle size={12} className="mr-1" /> MANUAL REVIEW REQUIRED
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <div className="h-1 bg-blue-500"></div>
          <CardHeader className="pb-4">
            <CardDescription className="text-[10px] uppercase tracking-widest font-black text-slate-400">Processor Data Delay</CardDescription>
            <CardTitle className="text-3xl font-black text-slate-900">12</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-fit">
              <Scale size={12} className="mr-1" /> AWAITING FILE INGESTION
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <CardTitle className="text-xl font-black text-slate-900">Manual Review Queue</CardTitle>
              <CardDescription className="text-slate-500 font-medium">Identify and resolve variances between internal ledger and processor reports.</CardDescription>
            </div>
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input placeholder="Filter exceptions..." className="pl-10 h-10 text-sm bg-white border-slate-200" />
              </div>
              <Button variant="outline" className="h-10 border-slate-200 shadow-sm font-bold uppercase text-[10px] tracking-widest px-6 hover:bg-slate-50">
                <Filter size={14} className="mr-2" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="hover:bg-transparent border-none h-12">
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-8">Exception Date</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction Forensic</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Internal Ledger</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Processor Reported</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Variance Type</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right pr-8">Resolution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exceptions.map((tx) => (
                <TableRow key={tx.id} className="border-b border-slate-100 h-20 group hover:bg-slate-50/30 transition-colors">
                  <TableCell className="pl-8">
                    <p className="text-xs font-bold text-slate-900">{mounted ? new Date(tx.createdAt).toLocaleDateString() : '...'}</p>
                    <p className="text-[10px] text-slate-400 font-medium">At {mounted ? new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-black font-mono text-primary group-hover:underline cursor-pointer">{tx.internalId}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Proc: {tx.processorTransactionId || 'Awaiting'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-black text-slate-900">
                    {(tx.amount / 100).toLocaleString('en-US', { style: 'currency', currency: tx.currency })}
                  </TableCell>
                  <TableCell className="text-sm font-black text-rose-600">
                    {tx.reconStatus === 'mismatch' ? '$0.00' : 'Data Missing'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive" className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 shadow-sm shadow-rose-100">
                      Amount Mismatch
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Button variant="ghost" size="sm" className="text-accent text-[10px] font-black uppercase tracking-widest h-9 px-4 hover:bg-accent/10 transition-all">
                      Review forensic <ArrowRight size={14} className="ml-1.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}