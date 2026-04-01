"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_AUDIT_LOGS } from '@/lib/mock-data';
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
import { ShieldCheck, History, User, Terminal, ArrowRight, Download } from 'lucide-react';

export default function AuditTrailPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <DashboardLayout type="admin" title="Immutable Compliance Ledger">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-muted-foreground text-sm">
            Cryptographically-anchored record of all sensitive platform operations.
          </p>
        </div>
        <Button variant="outline" className="bg-white border-none shadow-sm h-10 px-6 font-bold text-xs uppercase tracking-widest">
          <Download size={14} className="mr-2" /> Export CSV
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b p-6">
          <CardTitle className="text-base font-black flex items-center">
            <ShieldCheck className="mr-2 text-primary" size={18} />
            Forensic Audit Stream
          </CardTitle>
          <CardDescription className="text-xs">Security-sensitive actions and configuration mutations</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/20">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8 h-12">Action / Intent</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Operator Entity</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Target Resource</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Origin (IP)</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-8 h-12">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_AUDIT_LOGS.map((log) => (
                <TableRow key={log.id} className="border-b border-slate-50 h-20 hover:bg-slate-50/30 transition-colors">
                  <TableCell className="pl-8">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{log.action}</span>
                      <div className="flex items-center mt-1 space-x-1">
                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest py-0 h-4 bg-slate-50">STAGED</Badge>
                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest py-0 h-4 bg-emerald-50 text-emerald-700 border-emerald-100">SIGNED</Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[8px] font-bold bg-slate-100 text-slate-600">MT</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">{log.userEmail.split('@')[0]}</span>
                        <span className="text-[9px] text-slate-400 font-medium">Ops Role</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-700">{log.resourceType}</span>
                      <span className="text-[9px] font-mono text-primary">{log.resourceId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[10px] font-mono text-slate-400">{log.ipAddress}</TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] font-bold text-slate-900">
                        {mounted ? new Date(log.timestamp).toLocaleDateString() : '...'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {mounted ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                      </span>
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

// Inline imports for local components
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
