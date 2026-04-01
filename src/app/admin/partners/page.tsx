"use client";

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_PARTNERS } from '@/lib/mock-data';
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
import { 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Calendar,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function PartnersPage() {
  return (
    <DashboardLayout type="admin" title="Partner Ecosystem">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground text-sm">Manage enterprise relationships and platform integrators.</p>
        <Button className="bg-primary text-white">
          <Plus size={18} className="mr-2" /> Onboard New Partner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {MOCK_PARTNERS.map((partner) => (
          <Card key={partner.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {partner.name.charAt(0)}
                  </div>
                  <Badge variant={partner.status === 'active' ? 'default' : 'secondary'} className="uppercase text-[10px] tracking-widest font-bold">
                    {partner.status}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{partner.name}</h3>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Mail size={14} className="mr-2" /> {partner.contactEmail}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar size={14} className="mr-2" /> Onboarded {new Date(partner.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="bg-muted/30 px-6 py-3 border-t border-muted/20 flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ID: {partner.id}</span>
                <Button variant="ghost" size="sm" className="h-8 text-xs font-bold uppercase tracking-wider text-accent hover:text-accent/80">
                  Manage <ExternalLink size={12} className="ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
