
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_MERCHANTS } from '@/lib/mock-data';
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
import { Input } from '@/components/ui/input';
import { Search, Filter, Store } from 'lucide-react';

export default function MerchantsPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DashboardLayout type="admin" title="Merchant Registry">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input placeholder="Search merchants..." className="pl-10 bg-white border-none shadow-sm" />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="bg-white border-none shadow-sm">
              <Filter size={16} className="mr-2" /> Filters
            </Button>
            <Button className="bg-primary text-white">Register Merchant</Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border-none overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-none h-12">
                <TableHead className="w-12"></TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Merchant Name</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Partner</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Industry</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Date Joined</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_MERCHANTS.map((merchant) => (
                <TableRow key={merchant.id} className="border-b border-muted/20 h-16">
                  <TableCell>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-primary">
                      <Store size={14} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">{merchant.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono uppercase">ID: {merchant.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">Partner {merchant.partnerId}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{merchant.industry}</TableCell>
                  <TableCell>
                    <Badge variant={merchant.status === 'active' ? 'default' : 'secondary'} className="text-[10px] font-bold uppercase tracking-widest px-2">
                      {merchant.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {mounted ? new Date(merchant.createdAt).toLocaleDateString() : '...'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="font-bold uppercase text-[10px] tracking-widest text-accent">
                      Edit Mapping
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
