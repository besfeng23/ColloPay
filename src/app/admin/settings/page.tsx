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
  Terminal
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout type="admin" title="System Settings">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="space-y-1">
          {[
            { name: 'General', icon: Globe },
            { name: 'Security & Auth', icon: Shield },
            { name: 'API Configuration', icon: Terminal },
            { name: 'Notifications', icon: Bell },
            { name: 'Encryption Keys', icon: Key },
            { name: 'Database & Storage', icon: Database },
          ].map((item, i) => (
            <button key={item.name} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${i === 1 ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:bg-white hover:text-foreground'}`}>
              <item.icon size={18} />
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="lg:col-span-3 space-y-8">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Access Control & Security</CardTitle>
              <CardDescription>Manage how users and systems authenticate with the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">Enforce Multi-Factor Authentication (MFA)</Label>
                    <p className="text-sm text-muted-foreground">Require all internal admins and partners to use MFA.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">Automatic Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Terminate inactive sessions after 15 minutes.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">Webhook Signature Verification</Label>
                    <p className="text-sm text-muted-foreground">Strictly verify all incoming processor webhooks.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Password Policy</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-len">Minimum Length</Label>
                    <Input id="min-len" defaultValue="12" type="number" className="bg-muted/30 border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Rotation Interval (Days)</Label>
                    <Input id="expiry" defaultValue="90" type="number" className="bg-muted/30 border-none" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t border-muted/20 px-6 py-4 flex justify-end space-x-3">
              <Button variant="ghost" className="font-bold uppercase text-[10px] tracking-widest">Reset Changes</Button>
              <Button className="bg-primary text-white font-bold uppercase text-[10px] tracking-widest px-8">Update Security Policy</Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Rate Limiting (API)</CardTitle>
              <CardDescription>Prevent abuse and maintain platform stability.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Standard Partners (Req/min)</Label>
                  <Input defaultValue="600" className="bg-muted/30 border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Tier 1 Enterprise (Req/min)</Label>
                  <Input defaultValue="2400" className="bg-muted/30 border-none" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t border-muted/20 px-6 py-4 flex justify-end">
              <Button className="bg-primary text-white font-bold uppercase text-[10px] tracking-widest px-8">Save Rate Limits</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
