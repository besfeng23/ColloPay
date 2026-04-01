"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MOCK_MERCHANTS } from '@/lib/mock-data';
import { Zap, CreditCard, ShieldCheck, Loader2, CheckCircle2, Terminal, Code2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function CreatePaymentPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const partnerMerchants = MOCK_MERCHANTS.filter(m => m.partnerId === 'p1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast({
        title: "Mock Transaction Initialized",
        description: "Transaction cp-sandbox-992 has been successfully dispatched to the acquirer.",
      });
    }, 1500);
  };

  if (success) {
    return (
      <DashboardLayout type="partner" title="Sandbox Results">
        <div className="max-w-3xl mx-auto py-12">
          <Card className="border-none shadow-2xl bg-white p-8">
            <div className="flex flex-col items-center text-center mb-12">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-100">
                <CheckCircle2 size={44} />
              </div>
              <CardTitle className="text-2xl font-black text-slate-900 mb-2">Transaction Dispatched</CardTitle>
              <CardDescription className="max-w-md font-medium text-slate-500">
                The payment request was validated and sent to the acquiring processor. 
                Webhook notifications will be delivered to your endpoint.
              </CardDescription>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                <Terminal size={14} className="text-primary" />
                <span>API Response Payload</span>
              </div>
              <div className="bg-[#0F172A] p-6 rounded-2xl font-mono text-xs text-slate-300 shadow-inner">
                <pre className="overflow-x-auto">
{`{
  "status": "success",
  "data": {
    "id": "tx-sandbox-992",
    "internalId": "cp-sandbox-992",
    "lifecycle_status": "processing",
    "correlation_id": "corr-sandbox-abc-9921",
    "amount": 15000,
    "currency": "USD",
    "processor": "SPEEDYPAY_V1"
  }
}`}
                </pre>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-12">
              <Button onClick={() => setSuccess(false)} className="bg-primary text-white font-black uppercase tracking-widest h-12 shadow-lg shadow-primary/20">
                New Test Payment
              </Button>
              <Button variant="outline" onClick={() => window.history.back()} className="border-slate-200 text-slate-600 font-black uppercase tracking-widest h-12">
                Back to Dashboard
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
            Simulate Payment Request
          </h2>
          <p className="text-slate-500 font-medium mt-2">Generate a mock server-to-server transaction to test your webhook and ledger logic.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2">
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b p-8">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Request Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-700">Target Merchant</Label>
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
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-700">Gross Amount (USD)</Label>
                    <Input type="number" placeholder="100.00" className="bg-slate-50 border-slate-200 h-11 text-sm font-bold" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-700">Partner Order Reference</Label>
                    <Input placeholder="e.g. ord_2024_9921" className="bg-slate-50 border-slate-200 h-11 text-sm" />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-700">Payment Instrument</Label>
                    <Select defaultValue="visa">
                      <SelectTrigger className="bg-slate-50 border-slate-200 h-11 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visa">Visa (Credit Card)</SelectItem>
                        <SelectItem value="mastercard">Mastercard (Debit)</SelectItem>
                        <SelectItem value="ach">ACH Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck size={14} className="mr-2 text-accent" />
                    Security Verification Details
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    This request will bypass MFA for sandbox purposes. In production, a valid <code className="text-accent bg-accent/10 px-1 py-0.5 rounded">x-api-key</code> is required. Idempotency is enforced via the Partner Order Reference.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/50 border-t p-8 flex justify-end">
                <Button type="submit" disabled={loading} className="bg-primary text-white font-black uppercase tracking-widest h-12 px-10 shadow-xl shadow-primary/20">
                  {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <CreditCard size={18} className="mr-2" />}
                  Dispatch Request
                </Button>
              </CardFooter>
            </Card>
          </form>

          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="p-6 border-b">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                  <Code2 size={16} className="mr-2 text-primary" />
                  Integration Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-900">1. Authenticate</p>
                  <p className="text-[11px] text-slate-500">Include your Bearer token in the Authorization header.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-900">2. Request Body</p>
                  <p className="text-[11px] text-slate-500">POST a JSON object with amount, currency, and merchant details.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-900">3. Handle Webhooks</p>
                  <p className="text-[11px] text-slate-500">Verify signatures for all incoming event notifications.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}