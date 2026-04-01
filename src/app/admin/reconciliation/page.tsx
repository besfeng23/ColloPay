
"use client";

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
import { AlertTriangle, CheckCircle2, Search, ArrowRight, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ReconciliationPage() {
  const exceptions = MOCK_TRANSACTIONS.filter(t => t.reconStatus === 'mismatch' || t.status === 'failed');

  return (
    <DashboardLayout type="admin" title="Reconciliation Center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-widest font-bold">Matched Rate</CardDescription>
            <CardTitle className="text-2xl font-bold text-green-600">98.4%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Last 24 hours activity</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-widest font-bold">Unresolved Variances</CardDescription>
            <CardTitle className="text-2xl font-bold text-destructive">{exceptions.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Requires manual intervention</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-widest font-bold">Awaiting Processor Data</CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-500">12</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Pending file uploads/webhooks</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Manual Review Queue</CardTitle>
              <CardDescription>Transactions where internal ledger differs from processor reporting.</CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="relative w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search exceptions..." className="pl-10 h-9 text-xs border-none bg-muted/30" />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter size={14} className="mr-2" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-xs font-bold uppercase">Exception Date</TableHead>
                <TableHead className="text-xs font-bold uppercase">Transaction ID</TableHead>
                <TableHead className="text-xs font-bold uppercase">Internal Amount</TableHead>
                <TableHead className="text-xs font-bold uppercase">Processor Amount</TableHead>
                <TableHead className="text-xs font-bold uppercase">Variance</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">Resolution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exceptions.map((tx) => (
                <TableRow key={tx.id} className="border-b border-muted/20">
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold font-mono">{tx.internalId}</span>
                      <span className="text-[10px] text-muted-foreground">Processor: {tx.processorTransactionId || 'Awaiting'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {(tx.amount / 100).toLocaleString('en-US', { style: 'currency', currency: tx.currency })}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-destructive">
                    {tx.reconStatus === 'mismatch' ? '$0.00' : 'Awaiting...'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive" className="text-[10px] uppercase font-bold px-1.5 py-0">
                      Amount Mismatch
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-accent text-xs font-bold uppercase tracking-widest h-8">
                      Resolve <ArrowRight size={14} className="ml-1" />
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
