
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_WEBHOOKS, MOCK_PROCESSORS } from '@/lib/mock-data';
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
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Webhook, RefreshCw, Eye, Search, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function WebhookLogsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <DashboardLayout type="admin" title="Network Webhook Forensic">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-none shadow-sm bg-white p-5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">24h Volume</p>
          <p className="text-2xl font-black text-slate-900">42,840</p>
        </Card>
        <Card className="border-none shadow-sm bg-white p-5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Success Rate</p>
          <p className="text-2xl font-black text-emerald-600">99.94%</p>
        </Card>
        <Card className="border-none shadow-sm bg-white p-5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Failures</p>
          <p className="text-2xl font-black text-rose-600">26</p>
        </Card>
        <Card className="border-none shadow-sm bg-white p-5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Latency</p>
          <p className="text-2xl font-black text-blue-600">14ms</p>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input placeholder="Search by event ID or correlation..." className="pl-10 h-11 border-none bg-white shadow-sm" />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="bg-white border-none shadow-sm h-11 px-6 font-bold text-xs uppercase tracking-widest">
            <Filter size={14} className="mr-2" /> Filters
          </Button>
          <Button className="bg-primary text-white h-11 px-6 font-bold text-xs uppercase tracking-widest">
            <RefreshCw size={14} className="mr-2" /> Force Replay
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/20 border-b">
              <TableRow className="hover:bg-transparent border-none h-14">
                <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8">Event ID</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Source Processor</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Event Type</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Processing Status</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Retries</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-8">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_WEBHOOKS.map((wh) => {
                const processor = MOCK_PROCESSORS.find(p => p.id === wh.processorId);
                return (
                  <TableRow key={wh.id} className="border-b border-slate-50 h-20 hover:bg-slate-50/30 transition-colors group">
                    <TableCell className="pl-8">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold font-mono text-primary group-hover:underline cursor-pointer">{wh.id}</span>
                        <span className="text-[9px] text-slate-400 font-medium">Ref: {wh.correlationId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-700">{processor?.name}</TableCell>
                    <TableCell className="text-xs font-bold text-slate-900">
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 text-[9px] font-black px-2 uppercase border-slate-100">
                        {wh.payload.event || 'unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {wh.processingStatus === 'completed' ? (
                          <CheckCircle2 size={14} className="text-emerald-500 mr-2" />
                        ) : (
                          <AlertCircle size={14} className="text-rose-500 mr-2" />
                        )}
                        <span className="text-xs font-black uppercase text-slate-700 tracking-tighter">{wh.processingStatus}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-400">{wh.retryCount}</TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex flex-col items-end">
                        <span className="text-[11px] font-bold text-slate-500">
                          {mounted ? new Date(wh.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                        </span>
                        <Link href={`/admin/webhooks/${wh.id}`}>
                          <Button variant="ghost" size="sm" className="h-6 text-[10px] font-black text-primary p-0 mt-1 uppercase tracking-widest hover:bg-transparent">
                            Forensic <Eye size={12} className="ml-1" />
                          </Button>
                        </Link>
                      </div>
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
