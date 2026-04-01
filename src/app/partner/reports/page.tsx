
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { generateAdminCustomReport, AdminCustomReportOutput } from '@/ai/flows/admin-custom-report-generator';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Send, Loader2, FileText, BarChart3, PieChart, Activity, Download, Search, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts";

const chartData = [
  { day: "Mon", volume: 120000 },
  { day: "Tue", volume: 310000 },
  { day: "Wed", volume: 290000 },
  { day: "Thu", volume: 440000 },
  { day: "Fri", volume: 580000 },
];

const chartConfig = {
  volume: {
    label: "Pattern Analysis",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export default function PartnerReportsPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AdminCustomReportOutput | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGenerate = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const result = await generateAdminCustomReport({ naturalLanguageQuery: query });
      setReport(result);
      toast({
        title: "Ecosystem Analysis Complete",
        description: `Successfully extracted insights for your requested scope.`,
      });
    } catch (error) {
      console.error("Failed to generate report:", error);
      toast({
        variant: "destructive",
        title: "Intelligence Failure",
        description: "Could not interpret the request. Please try rephrasing.",
      });
    } finally {
      setLoading(false);
    }
  };

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
                <CardTitle className="text-xl font-black tracking-tight">AI Portfolio Architect</CardTitle>
              </div>
              <CardDescription className="text-slate-400 text-base max-w-lg font-medium leading-relaxed">
                Describe your analysis needs in natural language. Our model will query your merchant ecosystem and identify performance patterns.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-0">
              <div className="space-y-4">
                <Textarea 
                  placeholder='e.g., "Compare auth rates between my logistics merchants over the last 7 days" or "Forecast my commission for Q4"'
                  className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-accent resize-none p-4 text-sm font-medium"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleGenerate} 
                    disabled={loading || !query.trim()}
                    className="bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest text-[10px] h-11 px-10 shadow-xl shadow-accent/20"
                  >
                    {loading ? <Loader2 className="mr-2 animate-spin" size={16} /> : <Send className="mr-2" size={16} />}
                    Initialize Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {report && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="border-b bg-slate-50/30 p-6 flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <FileText size={18} />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-black uppercase tracking-widest">Extracted Intelligence</CardTitle>
                      <CardDescription className="text-xs">Partner-scoped analysis parameters</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-slate-200">
                    {report.reportType}
                  </Badge>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Executive Summary</h4>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{report.summaryText}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trace Parameters</h4>
                      <div className="bg-[#0F172A] rounded-xl p-5 space-y-3 font-mono text-[11px] text-slate-300">
                        {Object.entries(report.queryParameters).map(([key, value]) => (
                          <div key={key} className="flex justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                            <span className="text-accent font-bold">{key}</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pattern Forecast</h4>
                      <div className="h-[140px] w-full bg-slate-50 rounded-xl p-2 border border-slate-100">
                        {mounted && (
                          <ChartContainer config={chartConfig} className="h-full w-full">
                            <AreaChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Area 
                                type="monotone" 
                                dataKey="volume" 
                                stroke="hsl(var(--accent))" 
                                fill="hsl(var(--accent))" 
                                fillOpacity={0.1}
                                strokeWidth={2}
                              />
                            </AreaChart>
                          </ChartContainer>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50/30 p-4 flex justify-end space-x-3 border-t">
                  <Button variant="outline" onClick={() => setReport(null)} className="text-[10px] font-black uppercase tracking-widest h-9 px-6 border-slate-200">
                    Refine Scope
                  </Button>
                  <Button className="bg-primary text-white text-[10px] font-black uppercase tracking-widest h-9 px-8 shadow-lg shadow-primary/20">
                    Export Forensic Dataset
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors border border-blue-100">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2">Settlement Forecast</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Projected disbursement amounts for the next 72 hours across all managed merchants.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors border border-emerald-100">
                  <PieChart size={24} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2">Fee Attribution Matrix</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Detailed analysis of revenue share and commission breakdown by industry vertical.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/30 border-b p-6">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Standard Ledgers</CardTitle>
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
                      <rpt.icon size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{rpt.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{rpt.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary transition-colors">
                      <Download size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="bg-[#0F172A] rounded-2xl p-6 text-white space-y-4 shadow-xl border border-white/5">
            <div className="flex items-center space-x-3 text-accent">
              <Search size={20} />
              <h4 className="text-sm font-black uppercase tracking-widest">Forensic Search</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Query the absolute ledger for your ecosystem using identifiers, masked PII, or raw metadata.
            </p>
            <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest h-10 text-[9px] shadow-sm">
              Launch Trace Explorer
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
