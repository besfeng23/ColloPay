
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_PARTNERS, MOCK_MERCHANTS, MOCK_TRANSACTIONS } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Building2, 
  Users, 
  Mail, 
  Calendar, 
  Key, 
  Activity,
  ArrowUpRight,
  Store,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

export default function PartnerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const partner = MOCK_PARTNERS.find(p => p.id === params.id);
  if (!partner) return <div className="p-8 text-center text-muted-foreground">Partner entity not found.</div>;

  const partnerMerchants = MOCK_MERCHANTS.filter(m => m.partnerId === partner.id);
  const partnerVolume = MOCK_TRANSACTIONS.filter(t => t.partnerId === partner.id).reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <DashboardLayout type="admin" title="Partner Forensic">
      <div className="flex items-center mb-8 space-x-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500">
          <ChevronLeft size={16} className="mr-1" /> Ecosystem
        </Button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">{partner.name}</h2>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Partner ID: {partner.id}</p>
          </div>
          <Badge variant={partner.status === 'active' ? 'default' : 'secondary'} className="uppercase text-[10px] font-black px-3">
            {partner.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Executive Portfolio KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Portfolio Processing</p>
                    <p className="text-2xl font-black text-slate-900">
                      {mounted ? (partnerVolume / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '...'}
                    </p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                    <Activity size={18} />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-[10px] font-bold text-emerald-600">
                  <ArrowUpRight size={14} className="mr-1" /> 12.4% vs prev. month
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Merchant Roster</p>
                    <p className="text-2xl font-black text-slate-900">{partnerMerchants.length}</p>
                  </div>
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                    <Store size={18} />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-tighter">4 awaiting forensic verification</p>
              </CardContent>
            </Card>
          </div>

          {/* Managed Merchants Table */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/30 border-b p-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Managed Merchant Registry</CardTitle>
              <CardDescription className="text-xs">Active business entities under this partner's orchestration</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/20">
                  <TableRow>
                    <TableHead className="text-[10px] font-black uppercase pl-8 h-12">Entity Name</TableHead>
                    <TableHead className="text-[10px] font-black uppercase h-12">Industry</TableHead>
                    <TableHead className="text-[10px] font-black uppercase h-12">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-right pr-8 h-12">Forensic</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partnerMerchants.map((merchant) => (
                    <TableRow key={merchant.id} className="h-16 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="pl-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{merchant.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">M-{merchant.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-600">{merchant.industry}</TableCell>
                      <TableCell>
                        <Badge variant={merchant.status === 'active' ? 'default' : 'secondary'} className="text-[9px] uppercase font-black px-2">
                          {merchant.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Link href={`/admin/merchants/${merchant.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                            <ExternalLink size={14} />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Intelligence */}
        <div className="space-y-8">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-6 pb-2 border-b">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Communication & Access</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-start space-x-3">
                <Mail size={16} className="text-primary mt-0.5" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Primary Contact</p>
                  <p className="text-xs font-bold text-slate-900">{partner.contactEmail}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar size={16} className="text-primary mt-0.5" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Enterprise Tenure</p>
                  <p className="text-xs font-bold text-slate-900">Since {mounted ? new Date(partner.createdAt).toLocaleDateString() : '...'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Key size={16} className="text-primary mt-0.5" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Credentials</p>
                  <p className="text-xs font-bold text-slate-900">2 Production Keys</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t bg-slate-50/30">
              <Button className="w-full bg-primary text-white font-black uppercase tracking-widest h-10 text-[10px]">
                Provision Staging Key
              </Button>
            </CardFooter>
          </Card>

          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <ShieldAlert size={20} />
              <h4 className="text-sm font-black uppercase tracking-widest">Risk Guardrail</h4>
            </div>
            <p className="text-[11px] text-rose-700 leading-relaxed font-medium">
              Enterprise volume exceeds standard insurance caps. Review secondary treasury reserve levels before next settlement cycle.
            </p>
            <Button variant="outline" className="w-full border-rose-200 text-rose-600 hover:bg-rose-100 font-black uppercase tracking-widest h-9 text-[9px]">
              Conduct Periodic Audit
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
