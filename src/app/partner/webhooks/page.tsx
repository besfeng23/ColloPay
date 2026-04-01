
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_WEBHOOKS } from '@/lib/mock-data';
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
import { Webhook, RefreshCw, Eye, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function PartnerWebhooksPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <DashboardLayout type="partner" title="Event Delivery Logs">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card className="border-none shadow-sm bg-white p-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Success Rate (24h)</p>
          <p className="text-3xl font-black text-emerald-600">99.98%</p>
        </Card>
        <Card className="border-none shadow-sm bg-white p-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Average Latency</p>
          <p className="text-3xl font-black text-slate-900">142ms</p>
        </Card>
        <Card className="border-none shadow-sm bg-white p-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Deliveries</p>
          <p className="text-3xl font-black text-blue-600">4,821</p>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/20 border-b">
              <TableRow className="hover:bg-transparent h-14">
                <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8">Event Signature</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Callback Type</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">HTTP Result</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Latency</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-8">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_WEBHOOKS.map((wh) => (
                <TableRow key={wh.id} className="border-b border-slate-50 h-20 hover:bg-slate-50/30 transition-colors group">
                  <TableCell className="pl-8">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold font-mono text-primary truncate max-w-[120px]">{wh.id}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Ref: {wh.correlationId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 text-[9px] font-black px-2 uppercase">
                      {wh.payload.event || 'PAYMENT_AUTH'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {wh.processingStatus === 'completed' ? (
                        <CheckCircle2 size={14} className="text-emerald-500 mr-2" />
                      ) : (
                        <AlertCircle size={14} className="text-rose-500 mr-2" />
                      )}
                      <span className="text-xs font-black uppercase text-slate-700 tracking-tighter">
                        {wh.processingStatus === 'completed' ? '200 OK' : '500 ERR'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-slate-400">124ms</TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] font-bold text-slate-500">
                        {mounted ? new Date(wh.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                      </span>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] font-black text-primary p-0 mt-1 uppercase tracking-widest">
                        Forensic <Eye size={12} className="ml-1" />
                      </Button>
                    </div>
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
