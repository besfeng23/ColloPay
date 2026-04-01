"use client";

import { ReactNode } from 'react';
import { SidebarNav } from './sidebar-nav';
import { LogOut, Bell, User, Search, Command } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface DashboardLayoutProps {
  children: ReactNode;
  type: 'admin' | 'partner';
  title?: string;
}

export function DashboardLayout({ children, type, title }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar flex flex-col shrink-0 border-r border-sidebar-border shadow-xl z-20">
        <div className="flex items-center h-16 px-6 border-b border-sidebar-border bg-sidebar/50 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <span className="text-white font-black text-sm">CP</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-base tracking-tight leading-none">ColloPay</span>
              <span className="text-[10px] text-sidebar-foreground/40 font-bold uppercase tracking-widest mt-1">Gateway</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <SidebarNav type={type} />
        </div>

        <div className="p-4 mt-auto border-t border-sidebar-border bg-sidebar/20">
          <div className="flex items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
            <Avatar className="h-8 w-8 ring-1 ring-white/10 group-hover:ring-white/20">
              <AvatarFallback className="bg-primary text-[10px] font-bold">JD</AvatarFallback>
            </Avatar>
            <div className="ml-3 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">John Doe</p>
              <p className="text-[9px] text-sidebar-foreground/40 truncate uppercase tracking-widest font-bold">{type} Mode</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 shrink-0 z-10">
          <div className="flex items-center flex-1">
            <h1 className="text-lg font-bold text-slate-900 mr-8 whitespace-nowrap">{title || 'Dashboard'}</h1>
            
            <div className="hidden md:flex relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Search transactions, partners..." 
                className="pl-10 h-9 bg-slate-50 border-slate-200 focus-visible:ring-accent text-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                <Command size={10} />
                <span>K</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-5">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-destructive rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-6 w-px bg-slate-200"></div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-3 focus:outline-none group">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 leading-none">System Admin</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">ColloPay Ops</p>
                  </div>
                  <Avatar className="h-8 w-8 ring-2 ring-slate-100 group-hover:ring-slate-200 transition-all">
                    <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold">CP</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 shadow-2xl border-slate-200">
                <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Security & Ops</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-sm font-medium">
                  <User className="mr-2 h-4 w-4 text-slate-400" />
                  IAM Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm font-medium">
                  <LogOut className="mr-2 h-4 w-4 text-destructive" />
                  Terminate Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto p-8 space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}