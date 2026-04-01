
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_MERCHANTS, MOCK_PARTNERS, MOCK_TRANSACTIONS, MOCK_PROCESSORS } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, 
  Store, 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  TrendingUp, 
  Activity,
  Settings,
  ArrowRight,
  ExternalLink,
  Lock,
  Plus
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export default function MerchantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const merchant = MOCK_MERCHANTS.find(m => m.id === params.id);
  if (!merchant) return <div className="p-8 text-center text-muted-foreground">Merchant entity not found.</div>;

  const partner = MOCK_PARTNERS.find(p => p.id === merchant.partnerId);
  const recentTransactions = MOCK_TRANSACTIONS.filter(t => t.merchantId === merchant.id).slice(0, 5);

  const handleUpdateRouting = () => {
    toast({
      title: "Routing Configuration Updated",
      description: "Priority changes have been committed to the adaptive routing engine.",
    });
  };

  return (
    <DashboardLayout type="admin" title="Merchant Forensic">
      <div className="flex items-center mb-8 space-x-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500">
          <ChevronLeft size={16} className="mr-1" /> Registry
        </Button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <Store size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">{merchant.name}</h2>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Global ID: {merchant.id}</p>
          </div>
          <Badge variant={merchant.status === 'active' ? 'default' : 'secondary'} className="uppercase text-[10px] font-black px-3">
            {merchant.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Core Intelligence */}
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Portfolio Parent</p>
                <div className="flex items-center text-sm font-bold text-slate-900">
                  <Building2 size={14} className="mr-2 text-primary" /> {partner?.name}
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Industry Vertical</p>
                <div className="flex items-center text-sm font-bold text-slate-900">
                  <Activity size={14} className="mr-2 text-accent" /> {merchant.industry}
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Compliance Tier</p>
                <div className="flex items-center text-sm font-bold text-emerald-600">
                  <ShieldCheck size={14} className="mr-2" /> Tier 1 Verified
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="bg-transparent border-b border-slate-200 rounded-none w-full justify-start h-12 p-0 space-x-8">
              <TabsTrigger value="activity" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 h-12 text-xs font-black uppercase tracking-widest">Operational Activity</TabsTrigger>
              <TabsTrigger value="routing" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 h-12 text-xs font-black uppercase tracking-widest">Processor Routing</TabsTrigger>
              <TabsTrigger value="fees" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 h-12 text-xs font-black uppercase tracking-widest">Economic Rules</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="pt-6">
              <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/30 border-b p-6">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Recent Transactional History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/20">
                      <TableRow>
                        <TableHead className="text-[10px] font-black uppercase pl-8">Internal ID</TableHead>
                        <TableHead className="text-[10px] font-black uppercase">Amount</TableHead>
                        <TableHead className="text-[10px] font-black uppercase">Status</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-right pr-8">Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTransactions.map((tx) => (
                        <TableRow key={tx.id} className="h-16 hover:bg-slate-50/50 transition-colors">
                          <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{tx.internalId}</TableCell>
                          <TableCell className="text-sm font-black">
                            {(tx.amount / 100).toLocaleString('en-PH', { style: 'currency', currency: tx.currency })}
                          </TableCell>
                          <TableCell>
                            <Badge variant={tx.status === 'succeeded' ? 'default' : 'destructive'} className="text-[9px] uppercase font-black">
                              {tx.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-8 text-xs text-slate-400 font-medium">
                            {mounted ? new Date(tx.createdAt).toLocaleString('en-PH') : '...'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="bg-slate-50/30 p-4 justify-center">
                  <Link href="/admin/transactions">
                    <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-400 hover:text-primary">
                      View Full Merchant Ledger <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="routing" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_PROCESSORS.slice(0, 2).map((proc) => (
                  <Card key={proc.id} className="border-none shadow-sm bg-white">
                    <CardHeader className="p-6 pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">{proc.name}</CardTitle>
                          <CardDescription className="text-xs">{proc.adapterKey}</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase tracking-widest">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-2 space-y-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">Routing Priority</span>
                        <span className="font-bold text-slate-900">Primary (100)</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">Failover Protocol</span>
                        <span className="font-bold text-slate-900">Standard</span>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-slate-50/30 p-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-full text-[10px] font-black uppercase tracking-widest text-primary">
                            Configure Adaptive Routing
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-lg font-black uppercase tracking-tight">Adaptive Routing Rule</DialogTitle>
                            <DialogDescription className="text-xs">
                              Modify the orchestration priority for <strong>{proc.name}</strong> for this merchant.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest">Priority Weight (1-1000)</Label>
                              <Input type="number" defaultValue="100" className="h-10 text-xs font-bold" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest">Failover Scenario</Label>
                              <Select defaultValue="next">
                                <SelectTrigger className="h-10 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="next">Try Next Highest Priority</SelectItem>
                                  <SelectItem value="reject">Reject Immediately</SelectItem>
                                  <SelectItem value="manual">Flag for Manual Approval</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleUpdateRouting} className="w-full bg-primary text-white font-black uppercase tracking-widest h-11 text-[10px]">
                              Apply Rule Change
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}
                
                <Card className="border-none shadow-sm bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 space-y-4">
                  <div className="p-3 bg-white rounded-full shadow-sm text-slate-300">
                    <Plus size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black uppercase text-slate-400">Map Additional Processor</p>
                    <p className="text-[10px] text-slate-400 font-medium">Expand redundancy for this merchant</p>
                  </div>
                  <Button variant="outline" className="h-9 px-6 text-[9px] font-black uppercase border-slate-200">Start Mapping</Button>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="fees" className="pt-6">
              <Card className="border-none shadow-sm bg-white overflow-hidden">
                <div className="p-6 bg-amber-50 border-b border-amber-100 flex items-start space-x-4">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <Lock size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-900">Active Merchant Overrides</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      This merchant has specific economic rules that override the standard partner commission structure.
                    </p>
                  </div>
                </div>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="pl-8 py-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Fixed</p>
                        <p className="text-sm font-bold text-slate-900">₱8.00 per transaction</p>
                      </TableCell>
                      <TableCell className="py-6 text-right pr-8">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Basis Points</p>
                        <p className="text-sm font-bold text-slate-900">2.20% (220 bps)</p>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Operational Constraints */}
        <div className="space-y-8">
          <Card className="border-none shadow-lg bg-[#0F172A] text-white">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                <TrendingUp size={14} className="mr-2" /> Commercial Health
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-6">
              <div>
                <p className="text-2xl font-black text-white">₱2,442,840.00</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">30D Processing Volume</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-bold text-emerald-400">99.92%</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Auth Rate</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-rose-400">0.02%</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Refund Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="p-6 pb-2 border-b">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Entity Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date Boarded</p>
                <p className="text-xs font-bold text-slate-900">{mounted ? new Date(merchant.createdAt).toLocaleDateString('en-PH') : '...'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Settlement Rail</p>
                <p className="text-xs font-bold text-slate-900">PESONet (Next Day)</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">KYC Status</p>
                <Badge className="bg-emerald-50 text-emerald-700 border-none text-[8px] font-black uppercase tracking-widest">Full Approval</Badge>
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest border-slate-200">
                <Settings size={14} className="mr-2" /> Merchant Settings
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
