
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_TRANSACTIONS, MOCK_PARTNERS, MOCK_MERCHANTS, MOCK_PROCESSORS } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Clock, 
  Shield, 
  CreditCard, 
  Webhook, 
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const transaction = MOCK_TRANSACTIONS.find(t => t.id === params.id);
  
  if (!transaction) return null;

  const partner = MOCK_PARTNERS.find(p => p.id === transaction.partnerId);
  const merchant = MOCK_MERCHANTS.find(m => m.id === transaction.merchantId);
  const processor = MOCK_PROCESSORS.find(p => p.id === transaction.processorId);

  return (
    <DashboardLayout type="admin" title="Transaction Forensic">
      <div className="flex items-center mb-6 space-x-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground">
          <ChevronLeft size={16} className="mr-1" /> Back
        </Button>
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold tracking-tight font-mono">{transaction.internalId}</h2>
          <Badge variant={transaction.status === 'succeeded' ? 'default' : 'destructive'} className="uppercase text-[10px] tracking-widest px-3">
            {transaction.status}
          </Badge>
          {transaction.reconStatus === 'matched' && (
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 uppercase text-[10px] font-bold">
              <CheckCircle2 size={12} className="mr-1" /> Reconciled
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Payment Lifecycle</CardTitle>
                <CardDescription>Canonical record of this payment event</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {mounted ? (transaction.amount / 100).toLocaleString('en-US', { style: 'currency', currency: transaction.currency }) : '...'}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Gross Amount</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-muted/20">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Method</p>
                  <p className="text-sm font-medium flex items-center capitalize">
                    <CreditCard size={14} className="mr-2 text-primary" /> {transaction.paymentMethod}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Currency</p>
                  <p className="text-sm font-medium">{transaction.currency}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Created At</p>
                  <p className="text-sm font-medium">{mounted ? new Date(transaction.createdAt).toLocaleString() : '...'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Updated At</p>
                  <p className="text-sm font-medium">{mounted ? new Date(transaction.updatedAt).toLocaleString() : '...'}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Reference Identifiers</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Partner Reference</span>
                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{transaction.partnerTransactionId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Processor Reference</span>
                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{transaction.processorTransactionId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Idempotency Key</span>
                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded truncate max-w-[150px]">{transaction.idempotencyKey || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Correlation ID</span>
                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded truncate max-w-[150px]">{transaction.correlationId || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 text-accent" size={18} />
                Audit Timeline
              </CardTitle>
              <CardDescription>Immutable history of transaction state transitions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
                {transaction.timeline?.map((event, idx) => (
                  <div key={event.id} className="relative flex items-center justify-between md:justify-start">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-white shadow-sm z-10 shrink-0">
                      <div className={`w-2 h-2 rounded-full ${
                        event.status === 'succeeded' ? 'bg-green-500' :
                        event.status === 'failed' ? 'bg-red-500' :
                        'bg-blue-400'
                      }`} />
                    </div>
                    <div className="ml-4 md:ml-6 flex-1 bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold uppercase tracking-wider">{event.status}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {mounted ? new Date(event.timestamp).toLocaleTimeString() : '...'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{event.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-8">
          {/* Parties involved */}
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="p-1 bg-accent/10"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Entities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Partner</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{partner?.name}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6"><ExternalLink size={12} /></Button>
                </div>
              </div>
              <Separator className="opacity-50" />
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Merchant</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{merchant?.name}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6"><ExternalLink size={12} /></Button>
                </div>
              </div>
              <Separator className="opacity-50" />
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Processor</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-accent">{processor?.name}</span>
                  <Badge variant="outline" className="text-[9px] uppercase font-bold">Adapter: {processor?.adapterKey}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fee Analysis */}
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70">Fee Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70">Platform Fee</span>
                <span className="font-bold">{(transaction.computedFees.platformFixed / 100 + transaction.computedFees.platformBps / 100).toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70">Partner Share</span>
                <span className="font-bold">{(transaction.computedFees.partnerCut / 100).toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70">Processor Cost</span>
                <span className="font-bold">{(transaction.computedFees.processorFee / 100).toFixed(2)} USD</span>
              </div>
              <Separator className="bg-primary-foreground/20" />
              <div className="flex justify-between items-center text-lg pt-2">
                <span className="font-bold">Merchant Net</span>
                <span className="font-bold font-mono">{(transaction.computedFees.merchantNet / 100).toLocaleString('en-US', { style: 'currency', currency: transaction.currency })}</span>
              </div>
            </CardContent>
            <CardFooter className="bg-white/10 px-6 py-3 flex justify-center">
              <Button variant="ghost" className="text-xs text-primary-foreground font-bold uppercase tracking-widest w-full hover:bg-white/20">
                View Fee Rule Config
              </Button>
            </CardFooter>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button className="w-full bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-widest">
              <RefreshCw size={16} className="mr-2" /> Force Re-Reconcile
            </Button>
            <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10 font-bold uppercase tracking-widest">
              Initiate Refund
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { CardFooter } from '@/components/ui/card';
