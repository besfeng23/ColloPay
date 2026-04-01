"use client";

import { ReactNode, useState } from 'react';
import { SidebarNav } from './sidebar-nav';
import { LogOut, Bell, User, Search, Command, Menu, X, ShieldCheck } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/menu-bar'; // Corrected import to standard UI components if exists, otherwise use standard pattern
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

// Note: Using Radix Dropdown components directly if shadcn dropdown is not in the provided file list
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

interface DashboardLayoutProps {
  children: ReactNode;
  type: 'admin' | 'partner';
  title?: string;
}

export function DashboardLayout({ children, type, title }: DashboardLayoutProps) {
  const Logo = () => (
    <div className="flex items-center space-x-3">
      <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
        <span className="text-white font-black text-sm">CP</span>
      </div>
      <div className="flex flex-col text-left">
        <span className="text-white font-bold text-base tracking-tight leading-none uppercase">ColloPay</span>
        <span className="text-[10px] text-sidebar-foreground/40 font-bold uppercase tracking-widest mt-1">Infrastructure</span>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-sidebar flex-col shrink-0 border-r border-sidebar-border shadow-xl z-20">
        <div className="flex items-center h-16 px-6 border-b border-sidebar-border bg-sidebar/50 backdrop-blur-md">
          <Logo />
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <SidebarNav type={type} />
        </div>

        <div className="p-4 mt-auto border-t border-sidebar-border bg-sidebar/20">
          <div className="flex items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
            <Avatar className="h-8 w-8 ring-1 ring-white/10 group-hover:ring-white/20">
              <AvatarFallback className="bg-primary text-[10px] font-bold">MT</AvatarFallback>
            </Avatar>
            <div className="ml-3 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Marcus Thorne</p>
              <p className="text-[9px] text-sidebar-foreground/40 truncate uppercase tracking-widest font-bold">Lead Ops • {type}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-white border-b border-slate-200 shrink-0 z-30">
          <div className="flex items-center flex-1">
            {/* Mobile Nav Trigger */}
            <div className="lg:hidden mr-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-600">
                    <Menu size={24} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-sidebar w-72 border-none">
                  <SheetHeader className="h-16 px-6 border-b border-sidebar-border flex items-center justify-center">
                    <SheetTitle className="sr-only">ColloPay Navigation</SheetTitle>
                    <Logo />
                  </SheetHeader>
                  <div className="py-6 h-[calc(100vh-64px)] overflow-y-auto">
                    <SidebarNav type={type} />
                    <div className="px-6 mt-8">
                      <div className="flex items-center p-3 rounded-xl bg-white/5 border border-white/5">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-[10px] font-bold">MT</AvatarFallback>
                        </Avatar>
                        <div className="ml-3 overflow-hidden">
                          <p className="text-xs font-bold text-white">Marcus Thorne</p>
                          <p className="text-[9px] text-sidebar-foreground/40 uppercase tracking-widest font-bold">{type}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <h1 className="text-base sm:text-lg font-bold text-slate-900 mr-4 sm:mr-8 whitespace-nowrap truncate max-w-[150px] sm:max-w-none">
              {title || 'Dashboard'}
            </h1>
            
            <div className="hidden md:flex relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Search forensics (ID, Trace, Partner Ref)..." 
                className="pl-10 h-9 bg-slate-50 border-slate-200 focus-visible:ring-accent text-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                <Command size={10} />
                <span>K</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-5">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative hidden sm:block">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-destructive rounded-full border-2 border-white"></span>
            </button>
            
            <div className="hidden sm:block h-6 w-px bg-slate-200"></div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 focus:outline-none group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">Marcus Thorne</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Platform Operations</p>
              </div>
              <Avatar className="h-8 w-8 ring-2 ring-slate-100 group-hover:ring-slate-200 transition-all">
                <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold">MT</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
