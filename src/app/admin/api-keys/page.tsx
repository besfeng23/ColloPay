
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { MOCK_API_KEYS, MOCK_PARTNERS } from '@/lib/mock-data';
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
import { Plus, Key, Copy, Trash2, Eye, ShieldAlert } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function APIKeysPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = (prefix: string) => {
    navigator.clipboard.writeText(prefix);
    toast({
      title: "Prefix Copied",
      description: "The API key fragment has been copied to your clipboard.",
    });
  };

  return (
    <DashboardLayout type="admin" title="System Credentials">
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-muted-foreground">Manage authentication keys for partners and internal services.</p>
          <div className="flex items-center mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-100 max-w-fit">
            <ShieldAlert size={14} className="mr-2" />
            Keys are hashed using SHA-256. We only store and display the prefix for auditing.
          </div>
        </div>
        <Button className="bg-primary text-white">
          <Plus size={18} className="mr-2" /> Provision New Key
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Active API Credentials</CardTitle>
          <CardDescription>Authentication tokens currently authorized to interact with the Gateway API.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-xs uppercase font-bold tracking-wider">Label / Owner</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider">Key Fragment</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider">Status</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider">Created</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider">Last Used</TableHead>
                <TableHead className="text-xs uppercase font-bold tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_API_KEYS.map((key) => {
                const partner = MOCK_PARTNERS.find(p => p.id === key.ownerId);
                return (
                  <TableRow key={key.id} className="border-b border-muted/20 h-16">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">{key.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Partner: {partner?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 font-mono text-xs text-muted-foreground">
                        <span>{key.keyPrefix}</span>
                        <button onClick={() => handleCopy(key.keyPrefix)} className="hover:text-primary p-1"><Copy size={12} /></button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.status === 'active' ? 'default' : 'secondary'} className="text-[10px] font-bold uppercase tracking-widest px-2">
                        {key.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {mounted ? new Date(key.createdAt).toLocaleDateString() : '...'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {mounted && key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : 'Never'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 size={14} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
