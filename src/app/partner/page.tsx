
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { 
  CreditCard, 
  Zap, 
  BarChart3, 
  Store,
  ArrowRight,
  TrendingUp,
  History
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
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter transactions for Partner P1 (ColloPay Enterprise)
  const partnerTransactions = MOCK_TRANSACTIONS.filter(t => t.partnerId === 'p1').slice(0, 5);
  
  return (
    <DashboardLayout type="partner" title="Partner Control Center">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Monthly Volume" 
          value="$482,900" 
          description="Gross processing volume"
          icon={TrendingUp}
          trend={{ value: 14, isUp: true }}
        />
        <StatCard 
          title="Active Merchants" 
          value="4" 
          description="Processing transactions"
          icon={Store}
        />
        <StatCard 
          title="Success Rate" 
          value="98.2%" 
          description="Last 30 days"
          icon={Zap}
          trend={{ value: 0.5, isUp: true }}
        />
        <StatCard 
          title="Partner Revenue" 
          value="$2,410" 
          description="Estimated commission (MTD)"
          icon={CreditCard}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-semibold">Activity Stream</CardTitle>
              <CardDescription>Latest processing events across your merchant portfolio</CardDescription>
            </div>
            <Link href="/partner/transactions">
              <Button variant="ghost" className="text-accent text-sm font-bold uppercase tracking-widest">
                Ledger <ArrowRight size={14} className="ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-xs uppercase font-bold tracking-wider">Merchant Ref</TableHead>
                  <TableHead className="text-xs uppercase font-bold tracking-wider">Amount</TableHead>
                  <TableHead className="text-xs uppercase font-bold tracking-wider">Status</TableHead>
                  <TableHead className="text-xs uppercase font-bold tracking-wider text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partnerTransactions.map((tx) => (
                  <TableRow key={tx.id} className="group border-b border-muted/10 h-14">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">M-{tx.merchantId}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{tx.partnerTransactionId}</span>
                      </div>
                    </TableCell>
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
                      } className="text-[9px] font-bold uppercase tracking-widest px-2 py-0">
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {mounted ? new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions / Integration */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Integration Sandbox</CardTitle>
              <CardDescription className="text-primary-foreground/70">Test your payment integration in real-time.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/partner/payments/new">
                <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold uppercase tracking-widest">
                  Create Mock Payment
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center">
                <History size={16} className="mr-2" />
                Webhook Deliveries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { event: 'payment.succeeded', status: '200 OK', time: '5m ago' },
                { event: 'payment.failed', status: '200 OK', time: '12m ago' },
                { event: 'refund.processed', status: '500 ERR', time: '1h ago' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-mono text-primary">{log.event}</p>
                    <p className="text-muted-foreground">{log.time}</p>
                  </div>
                  <Badge variant={log.status.includes('OK') ? 'outline' : 'destructive'} className="text-[9px] font-bold">
                    {log.status}
                  </Badge>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">
                View All Delivery Logs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
