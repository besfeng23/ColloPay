
"use client";

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, PieChart, Activity, Download, FileText, Sparkles } from 'lucide-react';

export default function PartnerReportsPage() {
  return (
    <DashboardLayout type="partner" title="Portfolio Analytics">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-lg bg-[#0F172A] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles size={120} />
            </div>
            <CardHeader className="p-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-accent rounded-lg">
                  <Sparkles size={24} className="text-white" />
                </div>
                <CardTitle className="text-xl font-black">AI Portfolio Insight</CardTitle>
              </div>
              <CardDescription className="text-slate-400 text-base max-w-lg">
                Generate high-dimensional reports on your ecosystem's performance using natural language queries.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <Button className="bg-white text-slate-900 hover:bg-slate-100 font-black uppercase tracking-widest text-[11px] h-12 px-8">
                Launch Intelligence Architect
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2">Settlement Forecast</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Projected disbursement amounts for the next 72 hours across all managed merchants.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <PieChart size={24} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2">Fee Attribution Matrix</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Detailed analysis of revenue share and commission breakdown by industry vertical.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/30 border-b p-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Standard Ledgers</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {[
                  { name: 'Monthly Tax Manifest', size: '2.4 MB', icon: FileText },
                  { name: 'Daily Activity Summary', size: '840 KB', icon: Activity },
                  { name: 'Risk Exposure Report', size: '1.2 MB', icon: FileText },
                ].map((rpt, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center space-x-3">
                      <rpt.icon size={18} className="text-slate-400 group-hover:text-primary" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{rpt.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{rpt.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                      <Download size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
