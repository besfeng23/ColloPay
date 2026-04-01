
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, description, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden border-none shadow-sm bg-white hover:shadow-md transition-all duration-300 group", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 bg-slate-50 group-hover:bg-primary/5 rounded-xl text-slate-400 group-hover:text-primary transition-colors border border-slate-100">
            <Icon size={20} />
          </div>
          {trend && (
            <div className={cn(
              "flex items-center text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
              trend.isUp 
                ? "text-emerald-600 bg-emerald-50 border-emerald-100" 
                : "text-rose-600 bg-rose-50 border-rose-100"
            )}>
              {trend.isUp ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
              {trend.value}%
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</p>
          <h3 className="text-2xl font-black tracking-tight text-slate-900">{value}</h3>
          {description && (
            <p className="text-[11px] text-slate-500 font-medium leading-tight">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
