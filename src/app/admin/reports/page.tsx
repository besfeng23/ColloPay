
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { generateAdminCustomReport, AdminCustomReportOutput } from '@/ai/flows/admin-custom-report-generator';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Send, Loader2, FileText, BarChart3, PieChart, Activity, Download, ShieldCheck, ChevronRight, Search, TrendingUp, AlertTriangle } from 'lucide-react';
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
  { day: "Mon", volume: 4200000 },
  { day: "Tue", volume: 3100000 },
  { day: "Wed", volume: 8900000 },
  { day: "Thu", volume: 12400000 },
  { day: "Fri", volume: 15800000 },
];

const chartConfig = {
  volume: {
    label: "Pattern Analysis",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export default function ReportsPage() {
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
        title: "Intelligence Model Activated",
        description: `Successfully architected forensic view for ${result.reportType}.`,
      });
    } catch (error) {
      console.error("Failed to generate report:", error);
      toast({
        variant: "destructive",
        title: "Architectural Failure",
        description: "Could not interpret the natural language query. Please try a different prompt.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Initialized",
      description: "Compiling forensic ledger for CSV delivery...",
    });
  };

  return (
    <DashboardLayout type="admin" title="Intelligent Reports">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <div className="h-1 bg-accent"></div>
            <CardHeader className="bg-slate-50/30">
              <div className="flex items-center space-x-2">
                <Sparkles className="text-accent" size={20} />
                <CardTitle className="text-lg font-black tracking-tight">AI Report Architect</CardTitle>
              </div>
              <CardDescription className="text-xs font-medium">
                Describe the forensic data you need in natural language. The model will analyze transaction patterns and extraction parameters.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Textarea 
                  placeholder='e.g., "Analyze anomaly patterns for strat-retail over the last 30 days" or "Forecast settlement volume for Q4"'
                  className="min-h-[140px] bg-slate-50/50 border-slate-200 focus-visible:ring-accent resize-none p-4 text-sm font-medium leading-relaxed"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-white">GPT-4o Forensics</Badge>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-white">Pattern Recognition</Badge>
                  </div>
                  <Button 
                    onClick={handleGenerate} 
                    disabled={loading || !query.trim()}
                    className="bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 shadow-lg shadow-accent/20"
                  >
                    {loading ? <Loader2 className="mr-2 animate-spin" size={16} /> : <Send className="mr-2" size={16} />}
                    Interpret Request
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {report && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/30 p-6 flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                      <FileText size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-base font-black tracking-tight">Intelligence Output</CardTitle>
                      <CardDescription className="text-xs">Identified parameters and pattern correlations</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-primary text-white font-black tracking-widest uppercase text-[10px] h-6 px-3">
                    {report.reportType}
                  </Badge>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Model Executive Summary</h4>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      {report.summaryText}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Extracted Schema</h4>
                      <div className="bg-[#0F172A] rounded-xl p-5 font-mono text-[11px] space-y-3 shadow-inner">
                        {Object.entries(report.queryParameters).map(([key, value]) => (
                          <div key={key} className="flex justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                            <span className="text-accent font-bold">{key}</span>
                            <span className="text-slate-400">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pattern Visualization</h4>
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
                      <div className="flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                        <AlertTriangle size={14} className="mr-2" />
                        Minor variance detected in period-over-period drift.
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50/30 p-4 border-t flex justify-end space-x-3">
                  <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest border-slate-200">
                    Modify Request
                  </Button>
                  <Button onClick={handleExport} className="bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                    Export Full Forensic CSV
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/30">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Intelligence Presets</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {[
                { name: 'Daily Settlement Recon', icon: Activity, desc: 'Unmatched traces analysis' },
                { name: 'Partner Performance Matrix', icon: BarChart3, desc: 'Volume & success rates' },
                { name: 'Merchant Risk Scoring', icon: ShieldCheck, desc: 'Auth rate anomalies' },
                { name: 'Global Fee Analysis', icon: PieChart, desc: 'Net platform margin breakdown' },
              ].map((r) => (
                <button key={r.name} className="w-full flex items-center space-x-4 p-4 hover:bg-slate-50 rounded-xl transition-all text-left group">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <r.icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{r.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{r.desc}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="bg-[#0F172A] rounded-2xl p-6 text-white space-y-4 shadow-xl border border-white/5">
            <div className="flex items-center space-x-3 text-accent">
              <Search size={20} />
              <h4 className="text-sm font-black uppercase tracking-widest">Global Forensic Filter</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Query the absolute ledger across all institutional silos using identifiers, masked PII, or raw metadata attributes.
            </p>
            <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest h-10 text-[9px]">
              Launch Trace Explorer
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
