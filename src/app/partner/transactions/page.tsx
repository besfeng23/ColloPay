"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_TRANSACTIONS } from '@/lib/mock-data';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download, ArrowRight, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function PartnerTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter for transactions belonging to the demo partner 'p_ent_01'
  const partnerTransactions = MOCK_TRANSACTIONS.filter(tx => 
    tx.partnerId === 'p_ent_01' && (
      tx.internalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.partnerTransactionId?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <DashboardLayout type="partner" title="Portfolio Ledger">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search by ID or Order Ref..." 
              className="pl-10 bg-white border-none shadow-sm h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="bg-white border-none shadow-sm h-11 px-6 font-bold text-xs uppercase tracking-widest">
              <Filter size={16} className="mr-2" /> Filters
            </Button>
            <Button className="bg-primary text-white h-11 px-8 font-black text-xs uppercase tracking-widest">
              <Download size={16} className="mr-2" /> Export CSV
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border-none overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 border-b border-slate-100">
                <TableRow className="hover:bg-transparent border-none h-14">
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400 pl-8">Order Ref / ID</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400">Merchant</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400">Method</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400">Amount</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400">Status</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400 text-right pr-8">Forensic</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partnerTransactions.map((tx) => (
                  <TableRow key={tx.id} className="border-b border-slate-50 h-20 hover:bg-slate-50/30 transition-colors">
                    <TableCell className="pl-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{tx.partnerTransactionId}</span>
                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-tight">Collo ID: {tx.internalId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-600">Merchant {tx.merchantId}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-xs text-slate-500">
                        <CreditCard size={14} className="mr-2 text-slate-300" /> {tx.paymentMethod}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-black text-slate-900">
                      {mounted 
                        ? (tx.amount / 100).toLocaleString('en-PH', { style: 'currency', currency: tx.currency })
                        : '...'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant={tx.status === 'succeeded' ? 'default' : 'destructive'} className="text-[9px] font-black uppercase tracking-widest px-3 py-0.5">
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Link href={`/partner/transactions/${tx.id}`}>
                        <Button variant="ghost" size="sm" className="font-black uppercase text-[10px] tracking-widest text-primary hover:bg-primary/5 px-4 h-9">
                          Trace <ArrowRight size={14} className="ml-1.5" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
