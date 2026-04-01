
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_API_KEYS, MOCK_PARTNERS } from '@/lib/mock-data';
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
import { Plus, Key, Copy, Trash2, Eye, ShieldAlert, Lock, Terminal, RefreshCw, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function APIKeysPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = (prefix: string) => {
    navigator.clipboard.writeText(prefix);
    toast({
      title: "Fragment Copied",
      description: "The API key fragment has been copied to your clipboard.",
    });
  };

  const handleRotate = () => {
    toast({
      title: "Rotation Initialized",
      description: "A dual-auth request has been sent to Finance Ops.",
    });
  };

  return (
    <DashboardLayout type="admin" title="Infrastructure Credentials">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <p className="text-muted-foreground text-sm max-w-xl">
            Manage institutional authentication tokens for ecosystem partners and internal orchestration services.
          </p>
          <div className="flex items-center mt-3 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 max-w-fit">
            <ShieldAlert size={14} className="mr-2" />
            Secrets are hashed with salt. We only store and display fragments for auditing.
          </div>
        </div>
        <Button className="bg-primary text-white font-black text-[11px] uppercase tracking-widest h-11 px-8 shadow-lg shadow-primary/20">
          <Plus size={18} className="mr-2" /> Provision Credential
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Terminal size={18} />
              </div>
              <div>
                <CardTitle className="text-base font-black tracking-tight">Active API Credentials</CardTitle>
                <CardDescription className="text-xs font-medium">Authentication tokens currently authorized for Global Ledger ingestion</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/20">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8 h-12">Label / Owner</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Key Fragment</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Environment</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Last Ingestion</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-8 h-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_API_KEYS.map((key) => {
                  const partner = MOCK_PARTNERS.find(p => p.id === key.ownerId);
                  return (
                    <TableRow key={key.id} className="border-b border-slate-50 h-20 hover:bg-slate-50/30 transition-colors">
                      <TableCell className="pl-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{key.name}</span>
                          <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                            {partner?.name || 'Internal Service'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 font-mono text-[11px] font-bold text-primary bg-slate-100 px-2 py-1 rounded w-fit">
                          <span>{key.keyPrefix}</span>
                          <button onClick={() => handleCopy(key.keyPrefix)} className="text-slate-400 hover:text-primary p-1"><Copy size={12} /></button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={key.status === 'active' ? 'default' : 'secondary'} className="text-[9px] font-black uppercase tracking-widest px-3 py-0.5">
                          {key.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-slate-200 bg-white">
                          Production
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-[11px] font-bold text-slate-500">
                          <Clock size={12} className="mr-1.5 text-slate-300" />
                          {mounted && key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={handleRotate} className="h-8 w-8 text-slate-400 hover:text-primary"><RefreshCw size={14} /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary"><Eye size={14} /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-rose-50"><Trash2 size={14} /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="bg-[#0F172A] rounded-2xl p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden border border-white/5">
          <div className="space-y-2 relative z-10">
            <div className="flex items-center space-x-3 text-accent mb-2">
              <Lock size={20} />
              <h4 className="text-sm font-black uppercase tracking-widest">Rotation Compliance Policy</h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-2xl font-medium">
              Enterprise security standards require rotation of production secrets every 90 days. Credentials approaching expiration are flagged for manual remediation. 
              <br className="mb-2" />
              <strong>Current Posture:</strong> <span className="text-emerald-400 font-black">All Keys Compliant</span>
            </p>
          </div>
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest h-11 px-8 text-[10px] shrink-0 relative z-10">
            View Rotation Schedule
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
