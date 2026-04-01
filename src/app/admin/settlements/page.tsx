
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_SETTLEMENTS, MOCK_MERCHANTS } from '@/lib/mock-data';
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { History, Download, Filter, AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function SettlementsPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DashboardLayout type="admin" title="Fund Settlements">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-muted-foreground">Manage the distribution of cleared funds to merchant accounts.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="bg-white border-none shadow-sm">
            <Filter size={16} className="mr-2" /> Filters
          </Button>
          <Button className="bg-primary text-white">
            <Download size={16} className="mr-2" /> Export Report
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <History className="mr-2 text-primary" size={18} />
            Settlement Batches
          </CardTitle>
          <CardDescription>Consolidated batches of processed transactions ready for disbursement.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-xs uppercase font-bold tracking-wider">Reference</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider">Merchant</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider">Amount</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider">Count</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider">Status</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider">Initiated At</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_SETTLEMENTS.map((set) => {
                const merchant = MOCK_MERCHANTS.find(m => m.id === set.merchantId);
                return (
                  <TableRow key={set.id} className="border-b border-muted/20 h-16">
                    <TableCell>
                      <span className="font-mono text-xs font-bold text-primary">{set.id}</span>
                      {set.varianceDetected && (
                        <AlertTriangle size={12} className="inline ml-2 text-destructive animate-pulse" />
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-medium">{merchant?.name}</TableCell>
                    <TableCell className="text-sm font-bold">
                      {mounted ? (set.amount / 100).toLocaleString('en-US', { style: 'currency', currency: set.currency }) : '...'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{set.transactionCount} txns</TableCell>
                    <TableCell>
                      <Badge variant={set.status === 'completed' ? 'default' : 'secondary'} className="text-[10px] font-bold uppercase tracking-widest px-2">
                        {set.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {mounted ? new Date(set.initiatedAt).toLocaleDateString() : '...'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/settlements/${set.id}`}>
                        <Button variant="ghost" size="sm" className="text-accent font-bold uppercase text-[10px] tracking-widest">
                          Forensic <ExternalLink size={12} className="ml-1" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
