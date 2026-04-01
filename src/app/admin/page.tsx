"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { 
  Users, 
  Store, 
  CreditCard, 
  CircleDollarSign,
  ArrowRight,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Scale,
  ArrowUpRight,
  Webhook
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
import { MOCK_TRANSACTIONS, MOCK_AUDIT_LOGS } from '@/lib/mock-data';
import Link from 'next/link';

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const recentTransactions = MOCK_TRANSACTIONS.slice(0, 6);
  
  return (
    <DashboardLayout type="admin" title="Platform Intelligence Overview">
      {/* Critical Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-[11px] font-black text-amber-800 uppercase tracking-widest">Reconciliation</p>
              <p className="text-xs font-bold text-amber-600">8 unresolved exceptions</p>
            </div>
          </div>
          <Link href="/admin/reconciliation" className="text-amber-800 hover:underline">
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <Activity size={18} />
            </div>
            <div>
              <p className="text-[11px] font-black text-emerald-800 uppercase tracking-widest">Processor Health</p>
              <p className="text-xs font-bold text-emerald-600">All systems operational</p>
            </div>
          </div>
          <Badge className="bg-emerald-500 text-white border-none text-[9px]">99.98%</Badge>
        </div>

        <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <Scale size={18} />
            </div>
            <div>
              <p className="text-[11px] font-black text-blue-800 uppercase tracking-widest">Settlement</p>
              <p className="text-xs font-bold text-blue-600">2 batches awaiting approval</p>
            </div>
          </div>
          <Link href="/admin/settlements" className="text-blue-800 hover:underline">
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          title="Daily Gross Volume" 
          value="$2.84M" 
          description="Across 14k transactions"
          icon={CreditCard}
          trend={{ value: 12.4, isUp: true }}
        />
        <StatCard 
          title="Net Platform Margin" 
          value="$38,420" 
          description="Estimated fee revenue"
          icon={CircleDollarSign}
          trend={{ value: 4.1, isUp: true }}
        />
        <StatCard 
          title="Pending Exceptions" 
          value="12" 
          description="Forensic review required"
          icon={AlertTriangle}
          className="border-rose-100"
        />
        <StatCard 
          title="Onboarding Queue" 
          value="4" 
          description="New partner applications"
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Real-time Ledger Preview */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50/30 border-b p-4 sm:p-6 gap-4">
            <div>
              <CardTitle className="text-base font-black text-slate-900">Live Infrastructure Stream</CardTitle>
              <CardDescription className="text-xs font-medium text-slate-500">Real-time visibility into global financial flows</CardDescription>
            </div>
            <Link href="/admin/transactions" className="text-primary hover:underline text-[11px] font-black uppercase tracking-widest flex items-center">
              View Global Ledger <ArrowRight size={14} className="ml-1.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/20">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8 h-12">ColloPay Trace</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Merchant Entity</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Amount</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-8 h-12">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((tx) => (
                  <TableRow key={tx.id} className="group border-b border-slate-50 h-14 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-8 font-mono text-[11px] font-bold text-primary">{tx.internalId}</TableCell>
                    <TableCell className="text-xs font-bold text-slate-700">M-{tx.merchantId}</TableCell>
                    <TableCell className="text-xs font-black text-slate-900">
                      {mounted 
                        ? (tx.amount / 100).toLocaleString('en-US', { style: 'currency', currency: tx.currency })
                        : '...'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        tx.status === 'succeeded' ? 'default' : 
                        tx.status === 'failed' ? 'destructive' : 
                        'secondary'
                      } className="text-[9px] font-black uppercase tracking-widest px-2 py-0">
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8 text-[11px] font-bold text-slate-400">
                      {mounted 
                        ? new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '...'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Operational Sidebars */}
        <div className="space-y-6 sm:space-y-8">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/30 border-b p-4 sm:p-6">
              <CardTitle className="text-base font-black text-slate-900 flex items-center">
                <ShieldCheck size={18} className="mr-2 text-primary" />
                Security Audit
              </CardTitle>
              <CardDescription className="text-xs font-medium text-slate-500">Sensitive system operations log</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-5">
              {MOCK_AUDIT_LOGS.slice(0, 3).map((log) => (
                <div key={log.id} className="flex space-x-3 group">
                  <div className="shrink-0 w-1 h-8 bg-slate-100 rounded-full group-hover:bg-accent transition-colors"></div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight truncate">{log.action}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-full font-bold">{log.userEmail}</p>
                  </div>
                </div>
              ))}
              <Link href="/admin/audit" className="block text-center text-[10px] font-black py-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-primary transition-all uppercase tracking-widest mt-2">
                View Immutable History
              </Link>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-[#0F172A] text-white overflow-hidden">
            <CardHeader className="p-4 sm:p-6 pb-2">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                <Webhook size={16} className="mr-2" />
                Network Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white/70">Ingestion Latency</span>
                <span className="text-xs font-black text-emerald-400">12ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white/70">Success Rate (24h)</span>
                <span className="text-xs font-black text-white">99.94%</span>
              </div>
              <Link href="/admin/webhooks">
                <Button className="w-full mt-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest h-9">
                  Delivery Forensic Ledger
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
