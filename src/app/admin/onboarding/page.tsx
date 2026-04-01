
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
import { UserPlus, ShieldAlert, FileCheck, CheckCircle2, XCircle, ArrowRight, Building2, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

const MOCK_QUEUE = [
  { id: 'app_9921', name: 'Zodiac Digital', type: 'Partner', tier: 'Enterprise', risk: 'Low', status: 'Pending Review', submittedAt: '2h ago' },
  { id: 'app_9922', name: 'Luna E-com', type: 'Merchant', tier: 'Standard', risk: 'Medium', status: 'KYC Verified', submittedAt: '5h ago' },
  { id: 'app_9923', name: 'Nova Logistics', type: 'Merchant', tier: 'High Volume', risk: 'Medium', status: 'Awaiting Documents', submittedAt: '1d ago' },
  { id: 'app_9924', name: 'Apex FinTech', type: 'Partner', tier: 'Strategic', risk: 'Low', status: 'Pending Review', submittedAt: '2d ago' },
];

export default function OnboardingQueuePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <DashboardLayout type="admin" title="Institutional Onboarding">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <p className="text-muted-foreground text-sm max-w-xl">
            Manage the application lifecycle for new ecosystem partners and business entities. All approvals require dual-auth signing.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="bg-white border-slate-200 text-[10px] font-black uppercase h-10 px-6">
            <Filter size={14} className="mr-2" /> All Tiers
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-none shadow-sm bg-white p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <UserPlus size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Applications</p>
            <p className="text-2xl font-black text-slate-900">12</p>
          </div>
        </Card>
        <Card className="border-none shadow-sm bg-white p-6 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Forensic</p>
            <p className="text-2xl font-black text-slate-900">4</p>
          </div>
        </Card>
        <Card className="border-none shadow-sm bg-white p-6 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FileCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Approved (Today)</p>
            <p className="text-2xl font-black text-slate-900">8</p>
          </div>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b p-6">
          <CardTitle className="text-sm font-black uppercase tracking-widest">Application Registry</CardTitle>
          <CardDescription className="text-xs">Queue of institutional entities awaiting platform orchestration access</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/20">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-[10px] font-black uppercase pl-8 h-12">Entity Name / ID</TableHead>
                <TableHead className="text-[10px] font-black uppercase h-12">Type / Tier</TableHead>
                <TableHead className="text-[10px] font-black uppercase h-12">Risk Profile</TableHead>
                <TableHead className="text-[10px] font-black uppercase h-12">Current Status</TableHead>
                <TableHead className="text-[10px] font-black uppercase h-12">Submitted</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-right pr-8 h-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_QUEUE.map((app) => (
                <TableRow key={app.id} className="border-b border-slate-50 h-20 hover:bg-slate-50/30 transition-colors">
                  <TableCell className="pl-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shadow-inner">
                        <Building2 size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{app.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">{app.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{app.type}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{app.tier}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "text-[9px] font-black uppercase px-2",
                      app.risk === 'Low' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                    )}>
                      {app.risk} Risk
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-xs font-bold text-slate-600">
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full mr-2",
                        app.status.includes('Review') ? "bg-blue-400" : "bg-emerald-400"
                      )} />
                      {app.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-400 font-medium">
                    {app.submittedAt}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Button variant="ghost" size="sm" className="font-black uppercase text-[10px] tracking-widest text-primary hover:bg-primary/5 px-4 h-9">
                      Review <ArrowRight size={14} className="ml-1.5" />
                    </Button>
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
