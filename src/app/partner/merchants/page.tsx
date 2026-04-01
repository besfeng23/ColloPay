
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_MERCHANTS } from '@/lib/mock-data';
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
import { Store, Plus, ArrowUpRight, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function PartnerMerchantsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const partnerMerchants = MOCK_MERCHANTS.filter(m => m.partnerId === 'p_ent_01');

  return (
    <DashboardLayout type="partner" title="Managed Merchant Portfolio">
      <div className="flex justify-between items-center mb-8">
        <p className="text-muted-foreground text-sm">Active business entities within your ecosystem hierarchy.</p>
        <Button className="bg-primary text-white font-black text-[11px] uppercase tracking-widest h-10 px-6">
          <Plus size={16} className="mr-2" /> Board New Merchant
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b p-6">
            <CardTitle className="text-base font-black flex items-center">
              <Store className="mr-2 text-primary" size={18} />
              Merchant Directory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/20">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8 h-12">Entity Name / ID</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Industry</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">30D Volume</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-8 h-12">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partnerMerchants.map((merchant) => (
                  <TableRow key={merchant.id} className="border-b border-slate-50 h-20 hover:bg-slate-50/30 transition-colors">
                    <TableCell className="pl-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{merchant.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-tight">M-{merchant.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-600">{merchant.industry}</TableCell>
                    <TableCell>
                      <Badge variant={merchant.status === 'active' ? 'default' : 'secondary'} className="text-[9px] font-black uppercase tracking-widest px-3 py-0.5">
                        {merchant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-xs font-bold text-slate-900">
                        $12,420.00 <ArrowUpRight size={12} className="ml-1 text-emerald-500" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Button variant="ghost" size="sm" className="font-black uppercase text-[10px] tracking-widest text-primary hover:bg-primary/5 h-9">
                        Forensic <Activity size={14} className="ml-1.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
