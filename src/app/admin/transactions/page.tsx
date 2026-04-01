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
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical,
  ArrowUpDown,
  AlertCircle
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTransactions = MOCK_TRANSACTIONS.filter(tx => 
    tx.internalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.partnerTransactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.processorTransactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout type="admin" title="Global Transaction Ledger">
      <div className="space-y-4">
        {/* Advanced Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search by ID, Partner Ref, or Processor..." 
              className="pl-10 bg-white border-none shadow-sm focus-visible:ring-accent h-11 sm:h-10 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="flex-1 lg:flex-none bg-white shadow-sm border-none h-11 sm:h-10 text-xs font-bold uppercase tracking-wider">
              <Filter className="mr-2" size={16} /> Filters
            </Button>
            <Button variant="outline" className="flex-1 lg:flex-none bg-white shadow-sm border-none h-11 sm:h-10 text-xs font-bold uppercase tracking-wider">
              <Download className="mr-2" size={16} /> Export
            </Button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border-none overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="w-12 text-center h-12">Recon</TableHead>
                    <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground h-12">
                      <div className="flex items-center cursor-pointer hover:text-foreground">
                        Timestamp <ArrowUpDown size={12} className="ml-1" />
                      </div>
                    </TableHead>
                    <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground h-12">Collo ID / Partner Ref</TableHead>
                    <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground h-12">Merchant</TableHead>
                    <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground h-12">Gross Amount</TableHead>
                    <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground h-12">Status</TableHead>
                    <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground h-12 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.id} className="group border-b border-muted/20 hover:bg-muted/5 transition-colors">
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {tx.reconStatus === 'matched' ? (
                            <div className="w-2 h-2 rounded-full bg-green-500" title="Matched" />
                          ) : tx.reconStatus === 'mismatch' ? (
                            <AlertCircle className="w-4 h-4 text-destructive" title="Variance Detected" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" title="Pending Recon" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                        {mounted ? new Date(tx.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '...'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-bold text-primary">{tx.internalId}</span>
                          <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                            Ref: {tx.partnerTransactionId || 'N/A'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">M-{tx.merchantId}</TableCell>
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
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/transactions/${tx.id}`}>View Full Forensic</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>View Webhook Trace</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Initiate Refund</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
