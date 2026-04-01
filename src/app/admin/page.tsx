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
  Activity
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

  const recentTransactions = MOCK_TRANSACTIONS.slice(0, 8);
  
  return (
    <DashboardLayout type="admin" title="Platform Intelligence">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Partners" 
          value="12" 
          description="Enterprise integrators"
          icon={Users}
          trend={{ value: 8.4, isUp: true }}
        />
        <StatCard 
          title="Total Merchants" 
          value="1,482" 
          description="45 pending onboarding"
          icon={Store}
          trend={{ value: 12.1, isUp: true }}
        />
        <StatCard 
          title="24h Gross Volume" 
          value="$1.2M" 
          description="Processed globally"
          icon={CreditCard}
          trend={{ value: 5.2, isUp: true }}
        />
        <StatCard 
          title="Net Platform Revenue" 
          value="$14,280" 
          description="Aggregated fees (MTD)"
          icon={CircleDollarSign}
          trend={{ value: 3.8, isUp: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/30 border-b p-6">
            <div>
              <CardTitle className="text-base font-black text-slate-900">Live Transaction Stream</CardTitle>
              <CardDescription className="text-xs font-medium text-slate-500">Real-time visibility into global financial flows</CardDescription>
            </div>
            <Link href="/admin/transactions" className="text-accent hover:underline text-[11px] font-black uppercase tracking-widest flex items-center">
              View All Ledger <ArrowRight size={14} className="ml-1.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/20">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8 h-12">Forensic ID</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Merchant</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Gross Amount</TableHead>
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

        {/* Security / Audit Log */}
        <div className="space-y-8">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/30 border-b p-6">
              <CardTitle className="text-base font-black text-slate-900 flex items-center">
                <ShieldCheck size={18} className="mr-2 text-primary" />
                Critical Security Events
              </CardTitle>
              <CardDescription className="text-xs font-medium text-slate-500">Sensitive system operations monitoring</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {MOCK_AUDIT_LOGS.map((log) => (
                <div key={log.id} className="flex space-x-3 group">
                  <div className="shrink-0 w-1.5 h-10 bg-slate-100 rounded-full group-hover:bg-accent transition-colors"></div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{log.action}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-full font-bold">{log.userEmail}</p>
                    <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest font-black">
                      {mounted ? new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '...'}
                    </p>
                  </div>
                </div>
              ))}
              <Link href="/admin/audit" className="block text-center text-[10px] font-black py-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-primary transition-all uppercase tracking-widest mt-4">
                View Immutable Audit History
              </Link>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-accent text-white overflow-hidden">
            <CardHeader className="p-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center">
                <Activity size={16} className="mr-2" />
                Processor Health
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white/70">SpeedyPay V1</span>
                <Badge className="bg-white text-accent text-[9px] font-black tracking-widest">ACTIVE</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white/70">GlobalDirect ACH</span>
                <Badge className="bg-white text-accent text-[9px] font-black tracking-widest">ACTIVE</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}