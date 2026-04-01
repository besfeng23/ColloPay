
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  CreditCard, 
  Shuffle, 
  History, 
  FileBarChart, 
  Settings, 
  Webhook, 
  CircleDollarSign,
  ShieldCheck,
  Scale
} from 'lucide-react';

interface SidebarNavProps {
  type: 'admin' | 'partner';
}

export function SidebarNav({ type }: SidebarNavProps) {
  const pathname = usePathname();

  const adminLinks = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Partners', href: '/admin/partners', icon: Users },
    { name: 'Merchants', href: '/admin/merchants', icon: Store },
    { name: 'Global Ledger', href: '/admin/transactions', icon: CreditCard },
    { name: 'Reconciliation', href: '/admin/reconciliation', icon: Scale },
    { name: 'Pricing Engine', href: '/admin/fee-rules', icon: CircleDollarSign },
    { name: 'Processors', href: '/admin/processors', icon: Shuffle },
    { name: 'Settlements', href: '/admin/settlements', icon: History },
    { name: 'Webhook Trace', href: '/admin/webhooks', icon: Webhook },
    { name: 'Reports', href: '/admin/reports', icon: FileBarChart },
    { name: 'Audit Logs', href: '/admin/audit', icon: ShieldCheck },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const partnerLinks = [
    { name: 'Dashboard', href: '/partner', icon: LayoutDashboard },
    { name: 'Transactions', href: '/partner/transactions', icon: CreditCard },
    { name: 'Merchants', href: '/partner/merchants', icon: Store },
    { name: 'Reports', href: '/partner/reports', icon: FileBarChart },
    { name: 'API Settings', href: '/partner/settings', icon: Settings },
  ];

  const links = type === 'admin' ? adminLinks : partnerLinks;

  return (
    <nav className="flex-1 space-y-1 px-4 py-4">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive 
                ? "bg-sidebar-accent text-sidebar-foreground" 
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <link.icon className={cn(
              "mr-3 h-5 w-5 shrink-0",
              isActive ? "text-accent" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
            )} />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
