
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
import { MOCK_TRANSACTIONS, MOCK_AUDIT_LOGS } from '@/lib/mock-data';
import Link from 'next/link';

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const recentTransactions = MOCK_TRANSACTIONS.slice(0, 5);
  
  return (
    <DashboardLayout type="admin" title="Platform Overview">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Partners" 
          value="12" 
          description="Across 3 regions"
          icon={Users}
          trend={{ value: 8, isUp: true }}
        />
        <StatCard 
          title="Total Merchants" 
          value="1,482" 
          description="45 pending review"
          icon={Store}
          trend={{ value: 12, isUp: true }}
        />
        <StatCard 
          title="Daily Volume" 
          value="$1.2M" 
          description="Processed last 24h"
          icon={CreditCard}
          trend={{ value: 5, isUp: true }}
        />
        <StatCard 
          title="Platform Fees" 
          value="$14,280" 
          description="Net platform revenue (MTD)"
          icon={CircleDollarSign}
          trend={{ value: 3, isUp: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-semibold">Live Transaction Stream</CardTitle>
              <CardDescription>Real-time visibility into global payment flows</CardDescription>
            </div>
            <Link href="/admin/transactions" className="text-accent hover:underline text-sm font-medium flex items-center">
              View All <ArrowRight size={14} className="ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Internal ID</TableHead>
                  <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Merchant</TableHead>
                  <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Status</TableHead>
                  <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((tx) => (
                  <TableRow key={tx.id} className="group">
                    <TableCell className="font-mono text-xs">{tx.internalId}</TableCell>
                    <TableCell className="text-sm font-medium">Merchant {tx.merchantId}</TableCell>
                    <TableCell className="text-sm font-semibold">
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
                      } className="text-[10px] font-bold uppercase tracking-widest px-2 py-0">
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
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
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <ShieldCheck size={20} className="mr-2 text-primary" />
              Critical Events
            </CardTitle>
            <CardDescription>Sensitive operations monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {MOCK_AUDIT_LOGS.map((log) => (
              <div key={log.id} className="flex space-x-3">
                <div className="shrink-0 w-1 h-10 bg-accent/20 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">{log.action}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">{log.userEmail}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-bold">
                    {mounted ? new Date(log.timestamp).toLocaleString() : '...'}
                  </p>
                </div>
              </div>
            ))}
            <Link href="/admin/audit" className="block text-center text-xs font-semibold py-2 bg-muted rounded-md text-muted-foreground hover:bg-muted/80 transition-colors uppercase tracking-widest mt-4">
              View Audit History
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
