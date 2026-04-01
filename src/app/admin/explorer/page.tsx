
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_TRANSACTIONS } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Terminal, 
  Database, 
  ShieldCheck, 
  ArrowRight, 
  Fingerprint,
  Globe,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function TraceExplorerPage() {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  const results = query ? MOCK_TRANSACTIONS.filter(tx => 
    tx.internalId.toLowerCase().includes(query.toLowerCase()) ||
    tx.partnerTransactionId?.toLowerCase().includes(query.toLowerCase()) ||
    tx.idempotencyKey?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5) : [];

  return (
    <DashboardLayout type="admin" title="Global Trace Explorer">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4 py-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Globe size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cross-Institutional Ledger Search</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            Perform forensic lookups across all partners, merchants, and environments using unique identifiers or encrypted metadata.
          </p>
        </div>

        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={24} />
          <Input 
            placeholder="Search by Trace ID, Partner Ref, Idempotency Key, or Masked PII..." 
            className="h-16 pl-14 pr-32 bg-white border-none shadow-2xl rounded-2xl text-lg font-medium focus-visible:ring-primary/20"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-2">
            <Button variant="outline" className="h-10 border-slate-200 text-[10px] font-black uppercase tracking-widest">
              <Filter size={14} className="mr-2" /> All Envs
            </Button>
          </div>
        </div>

        {query && results.length > 0 ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Forensic Matches Found ({results.length})</h4>
            {results.map((tx) => (
              <Card key={tx.id} className="border-none shadow-sm hover:shadow-md transition-all group bg-white overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Fingerprint size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="font-mono text-sm font-bold text-slate-900">{tx.internalId}</span>
                        <Badge variant="outline" className="text-[8px] font-black uppercase bg-slate-50">PROD-LEDGER</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-400 font-medium">
                        <span className="flex items-center"><Clock size={12} className="mr-1" /> {mounted ? new Date(tx.createdAt).toLocaleDateString() : '...'}</span>
                        <span className="flex items-center capitalize"><Database size={12} className="mr-1" /> {tx.paymentMethod}</span>
                        <span className="truncate">Ref: {tx.partnerTransactionId}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-black text-slate-900">₱{(tx.amount / 100).toLocaleString()}</p>
                      <Badge variant={tx.status === 'succeeded' ? 'default' : 'destructive'} className="text-[9px] font-black uppercase h-5">
                        {tx.status}
                      </Badge>
                    </div>
                    <Link href={`/admin/transactions/${tx.id}`}>
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 group-hover:text-primary">
                        <ArrowRight size={20} />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : query && (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="bg-white p-4 rounded-2xl w-fit mx-auto mb-4 shadow-sm">
              <Search size={32} className="text-slate-300" />
            </div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">No Trace Detected</h4>
            <p className="text-xs text-slate-400 font-medium mt-1">The provided identifier was not found in the global index.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
          <div className="p-6 bg-slate-50 rounded-2xl space-y-3">
            <ShieldCheck size={20} className="text-primary" />
            <h5 className="text-xs font-black uppercase tracking-widest text-slate-900">Encrypted Metadata</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Search results include matches found within encrypted metadata fields if you possess the required decryption scope.
            </p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl space-y-3">
            <Terminal size={20} className="text-accent" />
            <h5 className="text-xs font-black uppercase tracking-widest text-slate-900">Idempotency Sync</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Lookups automatically correlate duplicate requests via the distributed idempotency lock layer.
            </p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl space-y-3">
            <Fingerprint size={20} className="text-emerald-600" />
            <h5 className="text-xs font-black uppercase tracking-widest text-slate-900">Audit Linkage</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Every search operation is recorded in the forensic audit trail with IP-based geolocation and session IDs.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
