
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_PARTNERS } from '@/lib/mock-data';
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
import { 
  Plus, 
  Mail, 
  Calendar,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function PartnersPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <DashboardLayout type="admin" title="Partner Ecosystem">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground text-sm">Manage enterprise relationships and platform integrators.</p>
        <Button className="bg-primary text-white font-black text-xs uppercase tracking-widest px-6 h-10">
          <Plus size={18} className="mr-2" /> Onboard New Partner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {MOCK_PARTNERS.map((partner) => (
          <Card key={partner.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 bg-white">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center font-black text-lg group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-inner">
                    {partner.name.charAt(0)}
                  </div>
                  <Badge variant={partner.status === 'active' ? 'default' : 'secondary'} className="uppercase text-[9px] tracking-widest font-black px-3">
                    {partner.status}
                  </Badge>
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">{partner.name}</h3>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center text-xs text-slate-500 font-medium">
                    <Mail size={14} className="mr-2 text-slate-300" /> {partner.contactEmail}
                  </div>
                  <div className="flex items-center text-xs text-slate-500 font-medium">
                    <Calendar size={14} className="mr-2 text-slate-300" /> Onboarded {mounted ? new Date(partner.createdAt).toLocaleDateString() : '...'}
                  </div>
                </div>
              </div>
              <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">ID: {partner.id}</span>
                <Link href={`/admin/partners/${partner.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5">
                    Manage Forensic <ExternalLink size={12} className="ml-1.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
