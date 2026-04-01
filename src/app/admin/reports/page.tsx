"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { generateAdminCustomReport, AdminCustomReportOutput } from '@/ai/flows/admin-custom-report-generator';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Send, Loader2, FileText, BarChart3, PieChart, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ReportsPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AdminCustomReportOutput | null>(null);

  const handleGenerate = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const result = await generateAdminCustomReport({ naturalLanguageQuery: query });
      setReport(result);
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout type="admin" title="Intelligent Reports">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Interface */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Sparkles className="text-accent" size={20} />
                <CardTitle className="text-lg">AI Report Architect</CardTitle>
              </div>
              <CardDescription>
                Describe the data you need in natural language. We'll interpret your request and prepare the report parameters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea 
                  placeholder='e.g., "Show me all failed transactions for ColloPay from last month" or "What was the total volume for Partner A in Q3?"'
                  className="min-h-[120px] bg-muted/30 border-none focus-visible:ring-accent resize-none p-4 text-base"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground italic">
                    Try asking about specific partners, timeframes, or transaction statuses.
                  </p>
                  <Button 
                    onClick={handleGenerate} 
                    disabled={loading || !query.trim()}
                    className="bg-accent hover:bg-accent/90 text-white"
                  >
                    {loading ? <Loader2 className="mr-2 animate-spin" size={18} /> : <Send className="mr-2" size={18} />}
                    Generate Strategy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {report && (
            <Card className="border-none shadow-sm bg-white animate-in fade-in slide-in-from-bottom-4">
              <CardHeader className="border-b border-muted/10 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <FileText className="text-accent" size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">Report Strategy Identified</CardTitle>
                      <CardDescription>Generated for your query</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-primary text-white font-bold tracking-widest uppercase text-[10px]">
                    {report.reportType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Executive Summary</h4>
                  <p className="text-foreground leading-relaxed">
                    {report.summaryText}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Extracted Parameters</h4>
                    <div className="bg-muted/30 rounded-lg p-4 font-mono text-xs space-y-2">
                      {Object.entries(report.queryParameters).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b border-muted/50 pb-1 last:border-0">
                          <span className="text-primary font-bold">{key}:</span>
                          <span className="text-muted-foreground">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center space-y-4">
                    <Button variant="outline" className="w-full justify-start h-12">
                      <BarChart3 className="mr-3 text-accent" size={20} />
                      View Visualization
                    </Button>
                    <Button className="w-full justify-start h-12 bg-primary text-white">
                      <Download className="mr-3" size={20} />
                      Export CSV Ledger
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar / Pre-built Reports */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Standard Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-2">
              {[
                { name: 'Daily Settlement Recon', icon: Activity },
                { name: 'Partner Performance Matrix', icon: BarChart3 },
                { name: 'Merchant Risk Scoring', icon: ShieldCheck },
                { name: 'Global Fee Analysis', icon: PieChart },
              ].map((r) => (
                <button key={r.name} className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-muted rounded-lg transition-colors text-left group">
                  <r.icon size={18} className="text-muted-foreground group-hover:text-primary" />
                  <span className="text-sm font-medium text-foreground">{r.name}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { Download, ShieldCheck } from 'lucide-react';
