
"use client";

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Key, Copy, RefreshCw, ShieldCheck, Terminal, Webhook } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function PartnerSettingsPage() {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Value Copied",
      description: "Credential fragment has been copied to your clipboard.",
    });
  };

  return (
    <DashboardLayout type="partner" title="API & Security Infrastructure">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/30 border-b p-6">
              <div className="flex items-center space-x-3">
                <Terminal size={20} className="text-primary" />
                <CardTitle className="text-base font-black">Production API Credentials</CardTitle>
              </div>
              <CardDescription className="text-xs">Active authentication tokens for server-to-server gateway orchestration.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Public Key Prefix</p>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">pk_live_8F...</code>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy('pk_live_8F')}>
                        <Copy size={12} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="default" className="bg-emerald-50 text-emerald-700 border-none text-[9px] font-black uppercase tracking-widest px-3">ACTIVE</Badge>
                    <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200">
                      Rotate Secret
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-amber-50 p-4 flex items-start space-x-3">
              <ShieldCheck size={18} className="text-amber-600 mt-0.5" />
              <p className="text-[11px] text-amber-700 leading-relaxed">
                <strong>Warning:</strong> Full API secrets are only visible at the time of creation. If lost, you must rotate the credential to generate a new secret.
              </p>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/30 border-b p-6">
              <div className="flex items-center space-x-3">
                <Webhook size={20} className="text-primary" />
                <CardTitle className="text-base font-black">Webhook Configuration</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Endpoint URL</p>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-xs font-bold text-slate-900 bg-slate-100 p-3 rounded-lg border border-slate-200">
                    https://api.partner-system.com/v1/callbacks/collopay
                  </code>
                  <Button variant="outline" size="icon" className="h-11 w-11 border-slate-200">
                    <RefreshCw size={16} />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signature Verification Secret</p>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-xs font-bold text-slate-400 bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
                    whsec_********************************
                  </code>
                  <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary">Reveal</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-lg bg-[#0F172A] text-white">
            <CardHeader className="p-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Security Hygiene</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Secret Rotation</p>
                <p className="text-xs font-bold text-white">124 days ago</p>
                <p className="text-[10px] text-rose-400 font-bold">Rotation Required soon</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Authorized IP Range</p>
                <p className="text-xs font-bold text-white">10.42.0.0/16</p>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest h-11 text-[10px]">
                Update Security Policy
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
