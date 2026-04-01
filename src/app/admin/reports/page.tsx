
"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { generateAdminCustomReport, AdminCustomReportOutput } from '@/ai/flows/admin-custom-report-generator';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Send, Loader2, FileText, BarChart3, PieChart, Activity, Download, ShieldCheck, ChevronRight, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

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
        title: "Report Strategy Architected",
        description: `Successfully interpreted ${result.reportType} request.`,
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
        {/* Main Interface */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <div className="h-1 bg-accent"></div>
            <CardHeader className="bg-slate-50/30">
              <div className="flex items-center space-x-2">
                <Sparkles className="text-accent" size={20} />
                <CardTitle className="text-lg font-black tracking-tight">AI Report Architect</CardTitle>
              </div>
              <CardDescription className="text-xs font-medium">
                Describe the forensic data you need in natural language. We'll interpret your intent and prepare the extraction parameters.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Textarea 
                  placeholder='e.g., "Show me all failed transactions for ColloPay from last month" or "What was the total volume for Partner A in Q3?"'
                  className="min-h-[140px] bg-slate-50/50 border-slate-200 focus-visible:ring-accent resize-none p-4 text-sm font-medium leading-relaxed"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-white">GPT-4o Optimized</Badge>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-white">Forensic Context</Badge>
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
            <Card className="border-none shadow-sm bg-white animate-in fade-in slide-in-from-bottom-4 overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/30 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                      <FileText size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-base font-black tracking-tight">Report Strategy Identified</CardTitle>
                      <CardDescription className="text-xs">Generated forensic parameters for extraction</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-primary text-white font-black tracking-widest uppercase text-[10px] h-6 px-3">
                    {report.reportType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-8 p-6">
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Executive Summary</h4>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {report.summaryText}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Extracted Trace Parameters</h4>
                    <div className="bg-[#0F172A] rounded-xl p-5 font-mono text-[11px] space-y-3 shadow-inner">
                      {Object.entries(report.queryParameters).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                          <span className="text-accent font-bold">{key}</span>
                          <span className="text-slate-400">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center space-y-3">
                    <Button variant="outline" className="w-full justify-between h-12 text-[10px] font-black uppercase tracking-widest border-slate-200">
                      <div className="flex items-center">
                        <BarChart3 className="mr-3 text-accent" size={18} />
                        View Visualization
                      </div>
                      <ChevronRight size={14} className="text-slate-300" />
                    </Button>
                    <Button onClick={handleExport} className="w-full justify-between h-12 bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                      <div className="flex items-center">
                        <Download className="mr-3" size={18} />
                        Export Forensic Ledger
                      </div>
                      <ChevronRight size={14} className="opacity-50" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar / Pre-built Reports */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/30">
              <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Standard Forensic Ledgers</CardTitle>
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

          <div className="bg-[#0F172A] rounded-2xl p-6 text-white space-y-4 shadow-xl">
            <div className="flex items-center space-x-3 text-accent">
              <Search size={20} />
              <h4 className="text-sm font-black uppercase tracking-widest">Global Filter</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Access the cross-institutional search engine to query transactions across all partners and environments using Trace IDs or Metadata.
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
