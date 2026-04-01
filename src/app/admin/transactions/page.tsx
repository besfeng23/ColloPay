"use client";

import { useState } from 'react';
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
  ChevronRight, 
  MoreVertical,
  ArrowUpDown
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = MOCK_TRANSACTIONS.filter(tx => 
    tx.internalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.externalRef?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout type="admin" title="Transaction Ledger">
      <div className="space-y-4">
        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search by Internal ID or Processor Ref..." 
              className="pl-10 bg-white border-none shadow-sm focus-visible:ring-accent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Button variant="outline" className="bg-white shadow-sm border-none flex-1 md:flex-none">
              <Filter className="mr-2" size={16} /> Filters
            </Button>
            <Button variant="outline" className="bg-white shadow-sm border-none flex-1 md:flex-none">
              <Download className="mr-2" size={16} /> Export
            </Button>
            <Button className="bg-primary text-white shadow-sm flex-1 md:flex-none">
              Create Transaction
            </Button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border-none overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-12"></TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground h-12">
                  <div className="flex items-center cursor-pointer hover:text-foreground">
                    Timestamp <ArrowUpDown size={12} className="ml-1" />
                  </div>
                </TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground h-12">Internal ID</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground h-12">Partner</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground h-12">Amount</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground h-12">Processor</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground h-12">Status</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground h-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="group border-b border-muted/20">
                  <TableCell>
                    <div className="flex justify-center">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        tx.status === 'succeeded' ? "bg-green-500" : tx.status === 'failed' ? "bg-destructive" : "bg-blue-400 animate-pulse"
                      )}></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-muted-foreground">
                    {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-primary">{tx.internalId}</TableCell>
                  <TableCell className="text-sm">Collo Pay</TableCell>
                  <TableCell className="text-sm font-semibold">
                    {(tx.amount / 100).toLocaleString('en-US', { style: 'currency', currency: tx.currency })}
                  </TableCell>
                  <TableCell className="text-xs font-medium uppercase tracking-tight text-muted-foreground">SpeedyPay</TableCell>
                  <TableCell>
                    <Badge variant={
                      tx.status === 'succeeded' ? 'default' : 
                      tx.status === 'failed' ? 'destructive' : 
                      'secondary'
                    } className="text-[10px] font-bold uppercase tracking-widest px-2 py-0">
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>View Webhooks</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Refund Transaction</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
