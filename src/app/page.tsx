
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Building2,
  Globe,
  Workflow,
  Split,
  ArrowDown,
  CheckCircle2,
  CircleDot,
} from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-emerald-500"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl w-full space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 mx-auto mb-6">
            <span className="text-white font-black text-2xl">CP</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl uppercase italic">ColloPay Gateway</h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Institutional-grade payment orchestration and forensic settlement infrastructure for enterprise ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-none shadow-xl bg-white hover:ring-2 hover:ring-primary/20 transition-all group overflow-hidden">
            <div className="h-1.5 bg-primary"></div>
            <CardHeader className="p-8">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <CardTitle className="text-2xl font-black text-slate-900">Infrastructure Ops</CardTitle>
              <CardDescription className="text-sm font-medium leading-relaxed">
                Global ledger management, forensic auditing, and dual-auth governance for platform administrators.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <Button 
                onClick={() => router.push('/admin')}
                className="w-full bg-primary text-white font-black uppercase tracking-widest h-12 shadow-lg shadow-primary/20"
              >
                Enter Admin Console <ArrowRight size={18} className="ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white hover:ring-2 hover:ring-accent/20 transition-all group overflow-hidden">
            <div className="h-1.5 bg-accent"></div>
            <CardHeader className="p-8">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <CardTitle className="text-2xl font-black text-slate-900">Ecosystem Partner</CardTitle>
              <CardDescription className="text-sm font-medium leading-relaxed">
                Developer sandbox, merchant orchestration, and portfolio analytics for enterprise integrators.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <Button 
                onClick={() => router.push('/partner')}
                className="w-full bg-accent text-white font-black uppercase tracking-widest h-12 shadow-lg shadow-accent/20"
              >
                Launch Partner Portal <ArrowRight size={18} className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-primary">
              <Workflow size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Payment Flow</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              How SpeedyPay works with your existing platform
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-4xl">
              SpeedyPay runs behind your current app experience. Your teams keep your existing product and checkout surface, while
              SpeedyPay handles transaction orchestration, fee logic, settlement movement, and ledger visibility in the background.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-bold uppercase tracking-wide">Default Flow</span>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Flow 1</span>
                </div>
                <CardTitle className="text-xl font-black text-slate-900">Platform Fee + Direct Client Remittance</CardTitle>
                <CardDescription className="text-slate-600">
                  Built for standard single-recipient settlement where funds are remitted directly to the designated client or merchant
                  account after fee deduction.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CircleDot className="mt-0.5 text-primary" size={18} />
                    <p className="text-sm text-slate-700">Your existing app creates a payment request through SpeedyPay APIs.</p>
                  </li>
                  <li className="flex justify-center">
                    <ArrowDown size={16} className="text-slate-300" />
                  </li>
                  <li className="flex items-start gap-3">
                    <CircleDot className="mt-0.5 text-primary" size={18} />
                    <p className="text-sm text-slate-700">The payer completes the transaction in the normal checkout flow.</p>
                  </li>
                  <li className="flex justify-center">
                    <ArrowDown size={16} className="text-slate-300" />
                  </li>
                  <li className="flex items-start gap-3">
                    <CircleDot className="mt-0.5 text-primary" size={18} />
                    <p className="text-sm text-slate-700">SpeedyPay deducts the configured platform fee automatically.</p>
                  </li>
                  <li className="flex justify-center">
                    <ArrowDown size={16} className="text-slate-300" />
                  </li>
                  <li className="flex items-start gap-3">
                    <CircleDot className="mt-0.5 text-primary" size={18} />
                    <p className="text-sm text-slate-700">Net proceeds are remitted directly to the designated client/merchant account.</p>
                  </li>
                  <li className="flex justify-center">
                    <ArrowDown size={16} className="text-slate-300" />
                  </li>
                  <li className="flex items-start gap-3">
                    <CircleDot className="mt-0.5 text-primary" size={18} />
                    <p className="text-sm text-slate-700">Settlement status and ledger records remain available for reconciliation.</p>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-accent">
                    <Split size={16} />
                    <span className="text-xs font-bold uppercase tracking-wide">Optional</span>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Flow 2</span>
                </div>
                <CardTitle className="text-xl font-black text-slate-900">Optional Multi-Party Split Settlement</CardTitle>
                <CardDescription className="text-slate-600">
                  For configured programs, one payment can be split across multiple downstream recipients as part of settlement.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">How it works:</p>
                  <p className="text-sm text-slate-600 mt-1">
                    A single payer transaction is allocated by predefined split rules (for example by percentage or fixed amount) only
                    when this mode is enabled.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Recipient</p>
                    <p className="text-sm font-bold text-slate-900">Merchant</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Recipient</p>
                    <p className="text-sm font-bold text-slate-900">Platform</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Recipient</p>
                    <p className="text-sm font-bold text-slate-900">Service Partner</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  This split-settlement model is optional and configuration-driven. The default implementation remains direct client
                  remittance with a platform fee deduction.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-2 border-t border-slate-200">
          <div className="flex items-center space-x-3 text-slate-400">
            <Globe size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Global Ingestion: Active</span>
          </div>
          <div className="flex items-center space-x-3 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-widest">Ledger Integrity: Verified</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <Building2 size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Region: PH-CENTRAL-1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
