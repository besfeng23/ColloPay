"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // For the demo, we land on the admin overview
    router.replace('/admin');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center space-y-4 animate-pulse">
        <div className="w-12 h-12 bg-primary rounded-xl"></div>
        <p className="text-muted-foreground font-medium tracking-widest uppercase text-xs">Initializing ColloPay Gateway...</p>
      </div>
    </div>
  );
}
