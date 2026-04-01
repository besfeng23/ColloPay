"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MOCK_MERCHANTS } from '@/lib/mock-data';
import { Zap, CreditCard, ShieldCheck, Loader2, CheckCircle2, Terminal, Split } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function CreatePaymentPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [splitType, setSplitConfig] = useState('direct');
  
  const partnerMerchants = MOCK_MERCHANTS.filter(m => m.partnerId === 'p_ent_01');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast({
        title: "Split Payment Initialized",
        description: `Remittance scheduled via ${splitType === 'split' ? 'Multi-Merchant Logic' : 'Direct Remittance'}.`,
      });
    }, 1500);
  };

  if (success) {
    return (
      <DashboardLayout type="partner" title="Sandbox Results">
        <div className="max-w-3xl mx-auto py-12">
          <Card className="border-none shadow-2xl bg-white p-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-100 mx-auto">
              <CheckCircle2 size={44} />
            </div>
            <CardTitle className="text-2xl font-black text-slate-900 mb-2">Transaction Dispatched</CardTitle>
            <CardDescription className="max-w-md mx-auto font-medium text-slate-500 mb-8">
              Procedural split applied. Funds are being routed to the Merchant of Record directly.
            </CardDescription>
            
            <div className="bg-[#0F172A] p-6 rounded-2xl font-mono text-xs text-left text-slate-300 shadow-inner overflow-x-auto mb-8">
              <pre>
{`{
  "status": "success",
  "data": {
    "id": "tx-sandbox-992",
    "remittance_strategy": "${splitType.toUpperCase()}",
    "platform_fee": "10%",
    "net_settlement_currency": "PHP",
    "direct_remittance": true
  }
}`}
              </pre>
            </div>

            <div className="flex space-x-4">
              <Button onClick={() => setSuccess(false)} className="flex-1 bg-primary text-white font-black uppercase tracking-widest h-12 shadow-lg shadow-primary/20">
                New Request
              </Button>
              <Button variant="outline" onClick={() => window.history.back()} className="flex-1 border-slate-200 font-black uppercase tracking-widest h-12">
                Exit Sandbox
              </Button>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="partner" title="API Sandbox">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-black text-slate-900 flex items-center tracking-tight">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-accent/20">
              <Zap className="text-white fill-white" size={20} />
            </div>
            Simulate Split Remittance
          </h2>
          <p className="text-slate-500 font-medium mt-2">Test Direct Remittance and Platform Fee extraction logic as requested by your client.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Request Payload Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-700">Client (Merchant of Record)</Label>
                  <Select required>
                    <SelectTrigger className="bg-slate-50 border-slate-200 h-11 text-sm">
                      <SelectValue placeholder="Select Destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {partnerMerchants.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-700">Gross Amount (PHP)</Label>
                  <Input type="number" defaultValue="50000" className="bg-slate-50 border-slate-200 h-11 text-sm font-bold" required />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-700">Settlement Strategy (Email Alignment)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setSplitConfig('direct')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${splitType === 'direct' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Wallet size={18} className={splitType === 'direct' ? 'text-primary' : 'text-slate-400'} />
                      <div className={`w-4 h-4 rounded-full border-2 ${splitType === 'direct' ? 'border-primary bg-primary' : 'border-slate-200'}`} />
                    </div>
                    <p className="text-xs font-black uppercase text-slate-900">Direct Remittance</p>
                    <p className="text-[10px] text-slate-500 font-medium">10% Platform fee + 90% Net to client account</p>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSplitConfig('split')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${splitType === 'split' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Split size={18} className={splitType === 'split' ? 'text-primary' : 'text-slate-400'} />
                      <div className={`w-4 h-4 rounded-full border-2 ${splitType === 'split' ? 'border-primary bg-primary' : 'border-slate-200'}`} />
                    </div>
                    <p className="text-xs font-black uppercase text-slate-900">Multi-Merchant Split</p>
                    <p className="text-[10px] text-slate-500 font-medium">Split 30/30/30 across multiple sub-merchants</p>
                  </button>
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck size={14} className="mr-2 text-accent" />
                  Direct Remittance Verified
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  This transaction will be processed with the client as the **Merchant of Record**. Funds will bypass platform treasury and settle directly into the configured bank rail.
                </p>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t p-8 flex justify-end">
              <Button type="submit" disabled={loading} className="bg-primary text-white font-black uppercase tracking-widest h-12 px-10 shadow-xl shadow-primary/20">
                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <CreditCard size={18} className="mr-2" />}
                Initialize Settlement
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <div className="bg-[#0F172A] rounded-2xl p-6 text-white space-y-4 shadow-xl">
              <div className="flex items-center space-x-3 text-accent">
                <Terminal size={20} />
                <h4 className="text-sm font-black uppercase tracking-widest">API Spec</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Use the <code className="text-accent">split_config</code> object in your POST request to define direct remittance ratios.
              </p>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}