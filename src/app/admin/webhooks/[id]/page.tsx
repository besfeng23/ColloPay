
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_WEBHOOKS, MOCK_PROCESSORS, MOCK_TRANSACTIONS } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Webhook, 
  RefreshCw, 
  Terminal, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function WebhookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const webhook = MOCK_WEBHOOKS.find(w => w.id === params.id);
  if (!webhook) return <div className="p-8 text-center text-muted-foreground">Webhook event not found.</div>;

  const processor = MOCK_PROCESSORS.find(p => p.id === webhook.processorId);
  const transaction = MOCK_TRANSACTIONS.find(t => t.correlationId === webhook.correlationId);

  return (
    <DashboardLayout type="admin" title="Webhook Forensic">
      <div className="flex items-center mb-8 space-x-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500 p-0">
          <ChevronLeft size={16} className="mr-1" /> Event Logs
        </Button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <Webhook size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900">{webhook.id}</h2>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Processor: {processor?.name}</p>
          </div>
          <Badge variant={webhook.processingStatus === 'completed' ? 'default' : 'destructive'} className="uppercase text-[10px] font-black">
            {webhook.processingStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Payload Inspection */}
          <Card className="border-none shadow-sm bg-[#0F172A] text-white overflow-hidden">
            <CardHeader className="border-b border-white/5 p-6 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <Terminal size={18} className="text-accent" />
                <CardTitle className="text-sm font-black uppercase tracking-widest">Inbound JSON Payload</CardTitle>
              </div>
              <Badge variant="outline" className="border-white/10 text-white/40 text-[8px] font-black uppercase">READ ONLY</Badge>
            </CardHeader>
            <CardContent className="p-6">
              <pre className="font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                {JSON.stringify(webhook.payload, null, 2)}
              </pre>
            </CardContent>
            <CardFooter className="bg-white/5 p-4 flex justify-between items-center">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Forensic Integrity Check: SIGNED & VERIFIED</p>
              <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white">
                Copy Raw Stream
              </Button>
            </CardFooter>
          </Card>

          {/* Correlation Context */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/30 border-b p-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Platform Correlation</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {transaction ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                      <Activity size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correlated Transaction</p>
                      <p className="text-sm font-bold text-slate-900">{transaction.internalId}</p>
                    </div>
                  </div>
                  <Link href={`/admin/transactions/${transaction.id}`}>
                    <Button className="bg-primary text-white text-[10px] font-black uppercase tracking-widest h-10 px-6">
                      View Forensic Trace <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 flex items-start space-x-4">
                  <AlertCircle className="text-amber-600 shrink-0" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-amber-900">Missing Correlation</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      No internal transaction record matches the incoming correlation ID ({webhook.correlationId}). 
                      This event has been flagged for manual investigation.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Operational Sidebar */}
        <div className="space-y-8">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-6 pb-2 border-b bg-slate-50/30">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Ingestion Intel</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-start space-x-3">
                <Clock size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Received At</p>
                  <p className="text-xs font-bold text-slate-900">{mounted ? new Date(webhook.receivedAt).toLocaleString() : '...'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ShieldCheck size={16} className="text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Signature Logic</p>
                  <p className="text-xs font-bold text-slate-900">HMAC-SHA256 (Valid)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Activity size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Retry Cycle</p>
                  <p className="text-xs font-bold text-slate-900">Attempt {webhook.retryCount + 1} of 5</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t bg-slate-50/30">
              <Button className="w-full bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest h-10 text-[10px] shadow-lg shadow-accent/20">
                <RefreshCw size={14} className="mr-2" /> Force State Replay
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-6 pb-2 border-b bg-slate-50/30">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Failure Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {webhook.lastError ? (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-rose-600">Error Exception Recorded:</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono">
                    {webhook.lastError}
                  </p>
                </div>
              ) : (
                <div className="flex items-center text-emerald-600 text-xs font-bold">
                  <CheckCircle2 size={16} className="mr-2" /> No errors in ingestion cycle
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
