"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { 
  CreditCard, 
  Zap, 
  Store,
  ArrowRight,
  TrendingUp,
  History,
  Activity,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
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
import { MOCK_TRANSACTIONS } from '@/lib/mock-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PartnerDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const partnerTransactions = MOCK_TRANSACTIONS.filter(t => t.partnerId === 'p1').slice(0, 5);
  
  return (
    <DashboardLayout type="partner" title="Partner Control Center">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Monthly Volume" 
          value="$482,900" 
          description="Processing volume (MTD)"
          icon={TrendingUp}
          trend={{ value: 14.2, isUp: true }}
        />
        <StatCard 
          title="Active Merchants" 
          value="4" 
          description="Connected storefronts"
          icon={Store}
        />
        <StatCard 
          title="API Success Rate" 
          value="99.98%" 
          description="Gateway health"
          icon={ShieldCheck}
          className="border-emerald-100 bg-emerald-50/30"
        />
        <StatCard 
          title="Est. Commission" 
          value="$2,410" 
          description="Revenue share (MTD)"
          icon={CreditCard}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/30 border-b p-6">
            <div>
              <CardTitle className="text-base font-black text-slate-900">Activity Stream</CardTitle>
              <CardDescription className="text-xs font-medium text-slate-500">Latest processing events across your portfolio</CardDescription>
            </div>
            <Link href="/partner/transactions">
              <Button variant="outline" className="h-9 border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest px-4 hover:bg-slate-50">
                Full Ledger <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/20">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8 h-12">Merchant / Ref</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Amount</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-8 h-12">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partnerTransactions.map((tx) => (
                  <TableRow key={tx.id} className="group border-b border-slate-50 h-16 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">Merchant {tx.merchantId}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-bold tracking-tight">{tx.partnerTransactionId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-black text-slate-900">
                      {mounted ? (tx.amount / 100).toLocaleString('en-US', { style: 'currency', currency: tx.currency }) : '...'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={tx.status === 'succeeded' ? 'default' : 'destructive'} className="text-[9px] font-black uppercase tracking-widest px-2 py-0">
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8 text-[11px] font-bold text-slate-500">
                      {mounted ? new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Integration Utilities */}
        <div className="space-y-8">
          <Card className="border-none shadow-lg bg-[#0F172A] text-white overflow-hidden">
            <CardHeader className="p-6">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-accent/30">
                <Zap size={20} className="text-white fill-white" />
              </div>
              <CardTitle className="text-lg font-black tracking-tight">Integration Sandbox</CardTitle>
              <CardDescription className="text-slate-400 text-xs font-medium">Test your server-to-server payment flow in real-time.</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Link href="/partner/payments/new">
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black uppercase tracking-widest text-[11px] h-11 transition-all">
                  Launch Sandbox UI
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-6 border-b">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                <History size={16} className="mr-2 text-primary" />
                Live Webhook Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {[
                  { event: 'payment.succeeded', status: '200 OK', time: '5m ago' },
                  { event: 'payment.failed', status: '200 OK', time: '12m ago' },
                  { event: 'refund.processed', status: '500 ERR', time: '1h ago' },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-mono text-[11px] font-black text-primary">{log.event}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{log.time}</p>
                    </div>
                    <Badge variant={log.status.includes('OK') ? 'outline' : 'destructive'} className="text-[9px] font-black px-1.5 py-0">
                      {log.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 border-t rounded-none hover:bg-slate-50">
                View All Delivery Logs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}