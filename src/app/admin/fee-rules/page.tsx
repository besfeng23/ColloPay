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
import { Plus, Edit3, CircleDollarSign, ShieldCheck, History, Lock } from 'lucide-react';
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
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-muted-foreground text-sm max-w-xl">
            Configure global, partner-specific, and merchant-override fee structures. 
            All changes are logged in the audit trail and require dual-authorization for production rotation.
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white font-black text-[11px] uppercase tracking-widest h-10 px-6">
              <Plus size={16} className="mr-2" /> Define Fee Rule
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
          <CardHeader className="bg-slate-50/50 border-b p-6">
            <CardTitle className="text-base font-black flex items-center">
              <CircleDollarSign className="mr-2 text-primary" size={18} />
              Active Fee Configurations
            </CardTitle>
            <CardDescription className="text-xs">Dynamic pricing logic currently enforced at orchestration runtime</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
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
                    <TableRow key={rule.id} className="border-b border-slate-50 h-16 hover:bg-slate-50/30 transition-colors">
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
        <div className="bg-slate-900 rounded-2xl p-6 text-white flex items-start space-x-4 shadow-xl">
          <div className="bg-primary/20 p-3 rounded-xl text-primary shrink-0">
            <Lock size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-1">Dual-Authorization Enforcement</h4>
            <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">
              Platform economics rules are classified as sensitive infrastructure. All modifications must be cryptographically signed by a secondary authorizer (Finance Ops) before deployment to the live orchestration engine.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
