
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
import { Input } from '@/components/ui/input';
import { Search, Filter, Store, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MerchantsPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DashboardLayout type="admin" title="Merchant Registry">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input placeholder="Search merchants by name or global ID..." className="pl-10 bg-white border-none shadow-sm h-11" />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="bg-white border-none shadow-sm h-11 px-6 font-bold text-xs uppercase tracking-widest">
              <Filter size={16} className="mr-2" /> Advanced Filters
            </Button>
            <Button className="bg-primary text-white h-11 px-8 font-black text-xs uppercase tracking-widest">Register Merchant</Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border-none overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 border-b border-slate-100">
                <TableRow className="hover:bg-transparent border-none h-14">
                  <TableHead className="w-16"></TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400">Merchant Entity</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400">Industry Vertical</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400">Status</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400">Onboarding Date</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400 text-right pr-8">Forensic</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_MERCHANTS.map((merchant) => (
                  <TableRow key={merchant.id} className="border-b border-slate-50 h-20 hover:bg-slate-50/30 transition-colors">
                    <TableCell className="pl-6">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shadow-inner">
                        <Store size={16} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{merchant.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-tight">Global ID: {merchant.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-600">{merchant.industry}</TableCell>
                    <TableCell>
                      <Badge variant={merchant.status === 'active' ? 'default' : 'secondary'} className="text-[9px] font-black uppercase tracking-widest px-3 py-0.5">
                        {merchant.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-400 font-medium">
                      {mounted ? new Date(merchant.createdAt).toLocaleDateString() : '...'}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Link href={`/admin/merchants/${merchant.id}`}>
                        <Button variant="ghost" size="sm" className="font-black uppercase text-[10px] tracking-widest text-primary hover:bg-primary/5 px-4 h-9">
                          Edit Mapping <ArrowRight size={14} className="ml-1.5" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
