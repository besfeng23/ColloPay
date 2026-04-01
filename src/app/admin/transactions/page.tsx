
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_TRANSACTIONS, MOCK_MERCHANTS } from '@/lib/mock-data';
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
  AlertCircle,
  Eye,
  ArrowRight,
  Clock,
  Split,
  ShieldCheck,
  ChevronRight,
  CreditCard
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTransactions = MOCK_TRANSACTIONS.filter(tx => 
    tx.internalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.partnerTransactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.processorTransactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTx = MOCK_TRANSACTIONS.find(t => t.id === selectedTxId);
  const merchant = selectedTx ? MOCK_MERCHANTS.find(m => m.id === selectedTx.merchantId) : null;

  return (
    <DashboardLayout type="admin" title="Global Transaction Ledger">
      <div className="space-y-4">
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
                    <TableRow 
                      key={tx.id} 
                      className="group border-b border-muted/20 hover:bg-muted/5 transition-colors cursor-pointer"
                      onClick={() => setSelectedTxId(tx.id)}
                    >
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
                        {mounted ? new Date(tx.createdAt).toLocaleString('en-PH', { dateStyle: 'short', timeStyle: 'short' }) : '...'}
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
                          ? (tx.amount / 100).toLocaleString('en-PH', { style: 'currency', currency: tx.currency })
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
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
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

      {/* Quick View Drawer */}
      <Sheet open={!!selectedTxId} onOpenChange={(open) => !open && setSelectedTxId(null)}>
        <SheetContent className="w-full sm:max-w-xl p-0 overflow-y-auto">
          {selectedTx && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-8 bg-slate-50 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <SheetTitle className="text-xl font-black font-mono text-slate-900">{selectedTx.internalId}</SheetTitle>
                    <SheetDescription className="text-xs font-medium uppercase tracking-widest mt-1">
                      Partner Ref: {selectedTx.partnerTransactionId}
                    </SheetDescription>
                  </div>
                  <Badge variant={selectedTx.status === 'succeeded' ? 'default' : 'destructive'} className="uppercase text-[10px] font-black px-3">
                    {selectedTx.status}
                  </Badge>
                </div>
              </SheetHeader>

              <div className="p-8 space-y-10">
                {/* Executive Summary */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gross Inbound</p>
                    <p className="text-xl font-black text-slate-900">₱{(selectedTx.amount / 100).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Settlement Rail</p>
                    <p className="text-sm font-bold text-slate-700 flex items-center">
                      <CreditCard size={14} className="mr-2 text-primary" /> PESONet Direct
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Remittance Detail */}
                <div className="space-y-4">
                  <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Split size={14} className="mr-2" /> Remittance Distribution
                  </div>
                  <div className="bg-[#0F172A] rounded-xl p-5 space-y-3 font-mono text-[11px]">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-400">Merchant Net (90%)</span>
                      <span className="text-emerald-400 font-bold">₱{(selectedTx.computedFees.merchantNet / 100).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-400">Platform Fee (10%)</span>
                      <span className="text-rose-400">₱{((selectedTx.amount * 0.1) / 100).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white/40 pt-1">
                      <span>Forensic Check</span>
                      <span className="text-emerald-500">VERIFIED</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Snippet */}
                <div className="space-y-4">
                  <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Clock size={14} className="mr-2" /> Recent Lifecycle Events
                  </div>
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:h-full before:w-0.5 before:bg-slate-100">
                    {selectedTx.timeline?.slice(0, 2).map((event) => (
                      <div key={event.id} className="relative pl-8">
                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-200 shadow-sm" />
                        <p className="text-[10px] font-black uppercase text-slate-700">{event.status}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{event.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Entity Intel */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Merchant of Record</p>
                      <p className="text-xs font-bold text-slate-900">{merchant?.name || `M-${selectedTx.merchantId}`}</p>
                    </div>
                  </div>
                  <Link href={`/admin/merchants/${selectedTx.merchantId}`}>
                    <Button variant="ghost" size="sm" className="text-primary p-0 h-auto hover:bg-transparent">
                      <ChevronRight size={18} />
                    </Button>
                  </Link>
                </div>
              </div>

              <SheetFooter className="p-8 border-t mt-auto">
                <Link href={`/admin/transactions/${selectedTx.id}`} className="w-full">
                  <Button className="w-full bg-primary text-white font-black uppercase tracking-widest h-12 shadow-lg shadow-primary/20">
                    View Full Forensic Trace <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
