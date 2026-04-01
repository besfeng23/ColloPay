
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
import { ShieldCheck, History, User, Terminal, ArrowRight, Download, Lock, Search } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

export default function AuditTrailPage() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => setMounted(true), []);

  return (
    <DashboardLayout type="admin" title="Immutable Compliance Ledger">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <p className="text-muted-foreground text-sm max-w-xl">
            Institutional-grade, cryptographically-anchored record of all sensitive platform operations. 
            All entries are signed and non-repudiable.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="bg-white border-slate-200 h-10 px-6 font-black text-[10px] uppercase tracking-widest">
            <Download size={14} className="mr-2" /> Export CSV (Full History)
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search by Operator, Action, or Resource ID..." 
            className="pl-10 h-11 bg-white border-none shadow-sm text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b p-6">
            <CardTitle className="text-base font-black flex items-center">
              <ShieldCheck className="mr-2 text-primary" size={18} />
              Forensic Audit Stream
            </CardTitle>
            <CardDescription className="text-xs">Immutable sequence of security-sensitive events</CardDescription>
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
                  <TableRow key={log.id} className="border-b border-slate-50 h-20 hover:bg-slate-50/30 transition-colors group">
                    <TableCell className="pl-8">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                        <div className="flex items-center mt-1.5 space-x-1.5">
                          <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest py-0 h-4 bg-slate-50 border-slate-200">VERIFIED</Badge>
                          <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest py-0 h-4 bg-emerald-50 text-emerald-700 border-emerald-100">SIGNED</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2.5">
                        <Avatar className="h-7 w-7 ring-2 ring-slate-100">
                          <AvatarFallback className="text-[9px] font-black bg-primary text-white">MT</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900">{log.userEmail.split('@')[0]}</span>
                          <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Ops Role</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{log.resourceType}</span>
                        <span className="text-[10px] font-mono font-bold text-primary">{log.resourceId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[10px] font-mono font-bold text-slate-400">{log.ipAddress}</TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex flex-col items-end">
                        <span className="text-[11px] font-bold text-slate-900">
                          {mounted ? new Date(log.timestamp).toLocaleDateString() : '...'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-black uppercase">
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

        <div className="bg-[#0F172A] rounded-2xl p-6 text-white flex items-start space-x-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Lock size={120} />
          </div>
          <div className="bg-primary/20 p-3.5 rounded-xl text-primary shrink-0">
            <Lock size={24} />
          </div>
          <div className="relative z-10">
            <h4 className="text-sm font-black uppercase tracking-widest mb-1.5">Chain-of-Custody Integrity</h4>
            <p className="text-slate-400 text-xs leading-relaxed max-w-3xl font-medium">
              This ledger is anchored using SHA-256 hashing. Any attempt to modify historic audit records will invalidate the cryptographic signature of the block, triggering an immediate security alert to the Global Compliance Team.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
