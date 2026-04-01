
"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MOCK_MERCHANTS } from '@/lib/mock-data';
import { Zap, CreditCard, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function CreatePaymentPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const partnerMerchants = MOCK_MERCHANTS.filter(m => m.partnerId === 'p1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast({
        title: "Mock Transaction Initialized",
        description: "Transaction cp-sandbox-992 has been created and dispatched to the processor.",
      });
    }, 1500);
  };

  if (success) {
    return (
      <DashboardLayout type="partner" title="Sandbox Result">
        <div className="max-w-xl mx-auto py-12">
          <Card className="border-none shadow-lg text-center p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold mb-2">Success: Payment Dispatched</CardTitle>
            <CardDescription className="mb-6">
              Transaction has been successfully initiated and is now in 'processing' state.
              You can track the state transitions in the Global Ledger.
            </CardDescription>
            <div className="bg-muted p-4 rounded-lg font-mono text-xs text-left mb-8">
              <p className="text-primary mb-2">// Response Payload</p>
              <pre>
{`{
  "id": "tx-sandbox-992",
  "internalId": "cp-sandbox-992",
  "status": "processing",
  "correlationId": "corr-sandbox-abc",
  "amount": 15000,
  "currency": "USD"
}`}
              </pre>
            </div>
            <div className="flex flex-col space-y-3">
              <Button onClick={() => setSuccess(false)} className="bg-primary text-white">
                Initiate Another Payment
              </Button>
              <Button variant="ghost" onClick={() => window.history.back()}>
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="partner" title="Sandbox: Initiate Payment">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-bold flex items-center">
            <Zap className="mr-2 text-accent" size={20} />
            Mock API Request
          </h2>
          <p className="text-muted-foreground text-sm">Simulate a server-to-server payment request from your application to ColloPay.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-muted/20">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Transaction Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Target Merchant</Label>
                  <Select required>
                    <SelectTrigger className="bg-muted/30 border-none">
                      <SelectValue placeholder="Select Merchant" />
                    </SelectTrigger>
                    <SelectContent>
                      {partnerMerchants.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount (USD)</Label>
                  <Input type="number" placeholder="100.00" className="bg-muted/30 border-none" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Partner Reference ID</Label>
                  <Input placeholder="e.g. order_9921" className="bg-muted/30 border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select defaultValue="visa">
                    <SelectTrigger className="bg-muted/30 border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visa">Visa (Card)</SelectItem>
                      <SelectItem value="mastercard">Mastercard (Card)</SelectItem>
                      <SelectItem value="ach">Bank Transfer (ACH)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg space-y-3">
                <div className="flex items-center text-amber-800 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck size={14} className="mr-2" />
                  Security Constraints
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  In a production environment, this request must include a valid `x-api-key` header and be signed with your private webhook secret. The idempotency key should be unique for every distinct payment attempt.
                </p>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t border-muted/20 p-6 flex justify-end">
              <Button type="submit" disabled={loading} className="bg-primary text-white font-bold uppercase tracking-widest px-8">
                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <CreditCard size={18} className="mr-2" />}
                Dispatch Payment Request
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
