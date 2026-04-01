"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Building2, CheckCircle2, Landmark, Layers3, ShieldCheck, Wallet } from 'lucide-react';

const howItWorksSteps = [
  {
    title: 'Connect your platform',
    description:
      'Integrate SpeedyPay into your existing product using APIs and webhooks. Keep your current app, user experience, and workflows.',
  },
  {
    title: 'Collect payments at scale',
    description:
      'Accept card and account-based payments for rent, invoices, reservations, dues, and recurring charges across your merchant network.',
  },
  {
    title: 'Auto-deduct platform fees',
    description:
      'Set fee rules by product line, merchant type, or transaction band so your platform fee is automatically deducted at settlement time.',
  },
  {
    title: 'Remit net proceeds directly',
    description:
      'Send net proceeds straight to your client or merchant account with a clear settlement trail and controls for audit and reconciliation.',
  },
];

const useCases = [
  {
    title: 'Property management platforms',
    description:
      'Support multi-property portfolios, landlord entities, and managed units without rebuilding your core platform.',
  },
  {
    title: 'Rent and dues collection',
    description:
      'Process recurring rent, association dues, and utility pass-throughs with configurable fee logic and reconciliation exports.',
  },
  {
    title: 'Booking and reservation platforms',
    description:
      'Capture customer payments, hold platform commissions, and remit net amounts to operators or service providers.',
  },
  {
    title: 'Enterprise collections',
    description:
      'Modernize high-volume billing and collections with configurable controls, payout governance, and settlement-level visibility.',
  },
];

const trustControls = [
  'Role-based access and operational approval flows',
  'Detailed transaction, fee, and settlement audit trails',
  'Webhook and API observability for operations teams',
  'Exception handling workflows for returns and disputes',
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-accent to-emerald-500" />

      <main className="mx-auto w-full max-w-6xl space-y-20 px-6 py-14 sm:py-20">
        <section className="space-y-8 text-center">
          <div className="mx-auto inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            SpeedyPay for Platforms
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Connect your existing platform to SpeedyPay.
            </h1>
            <p className="mx-auto max-w-4xl text-lg text-slate-600 sm:text-xl">
              Accept payments, deduct your platform fee automatically, and remit net proceeds directly to your client or merchant account.
            </p>
            <p className="mx-auto max-w-3xl text-base text-slate-500">
              Built for teams that already have their own application and need enterprise-grade payment and settlement infrastructure behind it.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button className="h-12 px-8 text-sm font-bold" onClick={() => router.push('/partner')}>
              Talk to Sales <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="h-12 px-8 text-sm font-bold" onClick={() => router.push('/partner/webhooks')}>
              Review API Integration
            </Button>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <Layers3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-extrabold sm:text-3xl">How It Works</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {howItWorksSteps.map((step, index) => (
              <Card key={step.title} className="border-slate-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">
                    <span className="mr-3 text-primary">0{index + 1}</span>
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-slate-600">{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight">Built for Platforms That Already Have Their Own App</h2>
            <p className="text-slate-600">
              SpeedyPay is the infrastructure layer behind your existing customer experience. You keep your product frontend while we power payment acceptance, fee routing, and settlement operations.
            </p>
            <p className="text-slate-600">
              This model is ideal for SaaS and enterprise platforms that need to monetize payment flows and control disbursement outcomes without building a payment stack from scratch.
            </p>
          </div>
          <Card className="border-slate-200 bg-slate-900 text-slate-100">
            <CardHeader>
              <CardTitle className="text-xl">Platform Fee + Direct Remittance Flow</CardTitle>
              <CardDescription className="text-slate-300">
                A predictable settlement flow for modern platform finance operations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                <span className="font-semibold text-white">Step 1:</span> End customer pays through your platform interface.
              </p>
              <p>
                <span className="font-semibold text-white">Step 2:</span> SpeedyPay applies your platform fee rule automatically.
              </p>
              <p>
                <span className="font-semibold text-white">Step 3:</span> Net proceeds are remitted directly to the designated merchant or client account.
              </p>
              <p>
                <span className="font-semibold text-white">Step 4:</span> Settlement records and audit events are available for reconciliation and reporting.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight">Use Cases</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {useCases.map((item) => (
              <Card key={item.title} className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="text-slate-600">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2 text-primary">
                <Wallet className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-[0.15em]">Optional Configuration</span>
              </div>
              <CardTitle>Optional Split-Settlement Logic</CardTitle>
              <CardDescription className="leading-relaxed text-slate-600">
                For platforms that need more than one destination per transaction, SpeedyPay can support configurable split-settlement flows so amounts are allocated by rule across participating accounts.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-[0.15em]">Enterprise Trust and Controls</span>
              </div>
              <CardTitle>Operational Control for Finance and Risk Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-600">
                {trustControls.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Move Faster Without Rebuilding Your Platform</h2>
          <p className="mx-auto mt-4 max-w-3xl text-slate-600">
            Use SpeedyPay as your payment and settlement layer so your team can launch monetization and remittance workflows with enterprise controls.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button className="h-12 px-8 font-bold" onClick={() => router.push('/partner')}>
              Book Sales Conversation
            </Button>
            <Button variant="outline" className="h-12 px-8 font-bold" onClick={() => router.push('/partner/webhooks')}>
              Explore API Docs in Portal
            </Button>
            <Button variant="ghost" className="h-12 px-8 font-semibold text-slate-600" onClick={() => router.push('/admin')}>
              Admin Login
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Landmark className="h-4 w-4" /> Enterprise-ready controls
            </span>
            <span className="inline-flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Built for platform operators
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
