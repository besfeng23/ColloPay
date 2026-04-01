
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
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
import { ClipboardCheck, CheckCircle2, XCircle, ShieldAlert, User, Clock, ArrowRight, Eye, Key, CircleDollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const MOCK_APPROVALS = [
  { id: 'req_9912', type: 'FEE_RULE_UPDATE', requester: 'm.thorne@collopay.com', target: 'fr_strat_override', description: 'Decrease fixed fee to ₱8.00 for Stratosphere Retail', status: 'PENDING', createdAt: '2h ago' },
  { id: 'req_9913', type: 'API_KEY_ROTATION', requester: 's.chen@collopay.com', target: 'ak_prod_01', description: 'Emergency rotation of GFS Production Key', status: 'PENDING', createdAt: '4h ago' },
  { id: 'req_9914', type: 'KMS_KEY_ROTATION', requester: 'admin_root', target: 'kms_master_prod', description: 'Scheduled quarterly rotation of KMS master key', status: 'PENDING', createdAt: '1d ago' },
];

export default function ApprovalQueuePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleApprove = (id: string) => {
    toast({
      title: "Operation Authorized",
      description: `Cryptographic signature applied to request ${id}. Deployment initialized.`,
    });
  };

  return (
    <DashboardLayout type="admin" title="Dual-Auth Governance Queue">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <p className="text-muted-foreground text-sm max-w-xl">
            Review and authorize security-sensitive platform operations. All entries require secondary verification to commit to the Global Ledger.
          </p>
        </div>
        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10 shadow-sm">
          <ShieldAlert size={14} className="mr-2" />
          Enforcement Mode: STRICT
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <ClipboardCheck size={18} />
              </div>
              <div>
                <CardTitle className="text-base font-black tracking-tight">Pending Authorizations</CardTitle>
                <CardDescription className="text-xs font-medium">Operations awaiting administrative second-signing</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/20">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8 h-12">Request ID / Type</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Operator</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Intent / Target</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Age</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-8 h-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_APPROVALS.map((req) => (
                  <TableRow key={req.id} className="border-b border-slate-50 h-24 hover:bg-slate-50/30 transition-colors">
                    <TableCell className="pl-8">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-bold text-primary">{req.id}</span>
                        <div className="flex items-center mt-1">
                          {req.type === 'FEE_RULE_UPDATE' ? <CircleDollarSign size={12} className="mr-1.5 text-slate-400" /> : <Key size={12} className="mr-1.5 text-slate-400" />}
                          <span className="text-[9px] font-black uppercase tracking-tighter text-slate-900">{req.type.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                          <User size={14} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{req.requester.split('@')[0]}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-xs font-medium text-slate-600 leading-relaxed">{req.description}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Target: {req.target}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase">
                        <Clock size={12} className="mr-1.5" /> {req.createdAt}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary"><Eye size={16} /></Button>
                        <Button onClick={() => handleApprove(req.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[9px] tracking-widest h-9 px-4">
                          <CheckCircle2 size={14} className="mr-1.5" /> Approve
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-rose-400 hover:bg-rose-50 hover:text-rose-600"><XCircle size={16} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="bg-[#0F172A] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden border border-white/5">
          <div className="space-y-2 relative z-10">
            <h4 className="text-sm font-black uppercase tracking-widest text-accent">Cryptographic Signing Guardrail</h4>
            <p className="text-slate-400 text-xs leading-relaxed max-w-2xl font-medium">
              Sensitive operations are locked by default. Approvals generate an ephemeral signing key associated with your session ID, which is then verified against the platform's root CA before execution.
            </p>
          </div>
          <div className="flex space-x-3 shrink-0 relative z-10">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest h-11 px-8 text-[10px]">
              View Signing Logs
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
