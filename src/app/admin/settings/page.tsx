
"use client";

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Globe, 
  Bell, 
  Key, 
  Database,
  Terminal,
  Lock,
  Webhook,
  Activity,
  Server,
  Fingerprint
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const handleSave = () => {
    toast({
      title: "System Update Initialized",
      description: "Configuration changes staged for platform re-deployment.",
    });
  };

  return (
    <DashboardLayout type="admin" title="Infrastructure Governance">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="space-y-1">
          {[
            { name: 'General', icon: Globe },
            { name: 'Security & Auth', icon: Shield },
            { name: 'API Management', icon: Terminal },
            { name: 'Network Rules', icon: Webhook },
            { name: 'Compliance', icon: Fingerprint },
            { name: 'Data Persistence', icon: Database },
          ].map((item, i) => (
            <button key={item.name} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all text-xs font-black uppercase tracking-widest ${i === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-white hover:text-primary'}`}>
              <item.icon size={16} />
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="lg:col-span-3 space-y-8">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Shield size={18} />
                </div>
                <div>
                  <CardTitle className="text-base font-black tracking-tight">Access Control & Hardening</CardTitle>
                  <CardDescription className="text-xs font-medium">Manage how institutional operators and systems interact with platform data.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-6">
                <div className="flex items-start justify-between group">
                  <div className="space-y-1">
                    <Label className="text-sm font-bold text-slate-900">Enforce Multi-Factor Authentication (MFA)</Label>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Require all internal admins and partner developers to provide secondary verification via hardware key or TOTP.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="opacity-50" />
                <div className="flex items-start justify-between group">
                  <div className="space-y-1">
                    <Label className="text-sm font-bold text-slate-900">Adaptive Session Timeout</Label>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Automatically terminate dormant administrative sessions after 15 minutes of inactivity.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="opacity-50" />
                <div className="flex items-start justify-between group">
                  <div className="space-y-1">
                    <Label className="text-sm font-bold text-slate-900">Webhook Signature Enforcement</Label>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Strictly reject any incoming processor webhooks that do not match the expected HMAC-SHA256 signature.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="pt-4 space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                  <Fingerprint size={14} className="mr-2" /> Institutional Password Policy
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-700" htmlFor="min-len">Minimum Entropy Length</Label>
                    <Input id="min-len" defaultValue="16" type="number" className="bg-slate-50 border-slate-200 h-11 text-sm font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-700" htmlFor="expiry">Force Rotation Interval (Days)</Label>
                    <Input id="expiry" defaultValue="90" type="number" className="bg-slate-50 border-slate-200 h-11 text-sm font-bold" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-6 flex justify-end space-x-3">
              <Button variant="ghost" className="font-black uppercase text-[10px] tracking-widest h-11 px-6 text-slate-400">Revert Defaults</Button>
              <Button onClick={handleSave} className="bg-primary text-white font-black uppercase text-[10px] tracking-widest h-11 px-10 shadow-lg shadow-primary/20">
                Commit Security Policy
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/30 border-b p-6">
                <CardTitle className="text-sm font-black flex items-center uppercase tracking-widest text-slate-400">
                  <Activity size={16} className="mr-2 text-accent" />
                  Ingestion Rate Limits
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-700">Standard Tier (Burst/min)</Label>
                  <Input defaultValue="1200" className="bg-slate-50 border-slate-200 font-mono font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-700">Enterprise Tier (Burst/min)</Label>
                  <Input defaultValue="10000" className="bg-slate-50 border-slate-200 font-mono font-bold" />
                </div>
              </CardContent>
            </Card>

            <div className="bg-[#0F172A] rounded-2xl p-6 text-white space-y-4 shadow-xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Server size={80} />
              </div>
              <div className="flex items-center space-x-3 text-accent relative z-10">
                <Lock size={18} />
                <h4 className="text-[11px] font-black uppercase tracking-widest">KMS Encryption Key</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium relative z-10">
                All PII and sensitive identification numbers are encrypted at rest using AES-256-GCM. Master keys are managed in an external HSM cluster.
              </p>
              <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest h-10 text-[9px] relative z-10">
                Rotate Master Key (Dual-Auth)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
