
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_FEE_RULES, MOCK_PARTNERS, MOCK_MERCHANTS } from '@/lib/mock-data';
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
import { Plus, Edit3, CircleDollarSign, ShieldCheck, History, Lock, Info } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FeeRulesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <DashboardLayout type="admin" title="Infrastructure Pricing Engine">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <p className="text-muted-foreground text-sm max-w-xl">
            Configure global, partner-specific, and merchant-override fee structures. 
            All changes are logged in the audit trail and require dual-authorization for production rotation.
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white font-black text-[11px] uppercase tracking-widest h-11 px-8 shadow-lg shadow-primary/20">
              <Plus size={18} className="mr-2" /> Define Fee Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-black uppercase tracking-tight">New Infrastructure Pricing Rule</DialogTitle>
              <DialogDescription className="text-xs font-medium">
                Identify the scope and parameters for this financial rule. Changes require secondary signing.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Rule Scope</Label>
                  <Select defaultValue="partner">
                    <SelectTrigger className="h-10 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global System</SelectItem>
                      <SelectItem value="partner">Partner Specific</SelectItem>
                      <SelectItem value="merchant">Merchant Override</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Target Entity</Label>
                  <Input placeholder="Search ID..." className="h-10 text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Fixed Fee (PHP Centavos)</Label>
                  <Input defaultValue="1500" type="number" className="h-10 text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Basis Points (bps)</Label>
                  <Input defaultValue="290" type="number" className="h-10 text-xs" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest">Effective Date</Label>
                <Input type="date" className="h-10 text-xs" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full bg-primary text-white font-black uppercase tracking-widest h-11 text-[10px]">
                Stage Rule for Approval
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <CircleDollarSign size={18} />
              </div>
              <div>
                <CardTitle className="text-base font-black tracking-tight">Active Fee Configurations</CardTitle>
                <CardDescription className="text-xs font-medium">Dynamic pricing logic currently enforced at orchestration runtime</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border-emerald-100">
              Precision Ledger Enabled
            </Badge>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/20">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8 h-12">Rule ID / Scope</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Partner / Merchant</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Fixed Fee</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Bps Fee (%)</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Effective From</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-8 h-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_FEE_RULES.map((rule) => {
                  const partner = MOCK_PARTNERS.find(p => p.id === rule.partnerId);
                  const merchant = MOCK_MERCHANTS.find(m => m.id === rule.merchantId);
                  return (
                    <TableRow key={rule.id} className="border-b border-slate-50 h-20 hover:bg-slate-50/30 transition-colors">
                      <TableCell className="pl-8">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold font-mono text-primary">{rule.id}</span>
                          <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">
                            {rule.merchantId ? 'Merchant Override' : 'Partner Default'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900">{partner?.name || 'System'}</span>
                          {merchant && <span className="text-[10px] text-slate-400 font-medium">For: {merchant.name}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-slate-900">
                        ₱{(rule.fixedFee / 100).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-slate-900">
                        {(rule.percentageFee / 100).toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-xs text-slate-400 font-medium">
                        {mounted ? new Date(rule.effectiveFrom).toLocaleDateString('en-PH') : '...'}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-primary">
                            <History size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-primary">
                            <Edit3 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Security / Compliance Note */}
        <div className="bg-[#0F172A] rounded-2xl p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden border border-white/5">
          <div className="space-y-2 relative z-10">
            <div className="flex items-center space-x-3 text-accent mb-2">
              <Lock size={20} />
              <h4 className="text-sm font-black uppercase tracking-widest">Dual-Authorization Enforcement</h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-2xl font-medium">
              Platform economics rules are classified as sensitive infrastructure. All modifications must be cryptographically signed by a secondary authorizer (Finance Ops) before deployment to the live orchestration engine.
            </p>
          </div>
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest h-11 px-8 text-[10px] shrink-0 relative z-10">
            View Approval Queue
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
