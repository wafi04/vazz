"use client";

import type * as React from "react";
import { useState } from "react";
import {
  CreditCard,
  Home,
  Settings,
  User,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SettingsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[280px_1fr]">
        <CustomSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className="w-full p-6 bg-[#001a4b] rounded-lg shadow-lg">
          <div className="md:hidden mb-4">
            <button
              type="button"
              className="flex items-center justify-center rounded-md p-2 text-blue-300 hover:bg-[#002966] transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </button>
          </div>
          <div className="text-white">{children}</div>
        </main>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  active?: boolean;
}

function SidebarItem({ href, icon: Icon, children, active }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = active || pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-[#0042a5] text-white shadow-md"
            : "text-blue-200 hover:bg-[#002966] hover:text-white"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            isActive ? "text-blue-200" : "text-blue-300"
          )}
        />
        <span>{children}</span>
      </Link>
    </li>
  );
}

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="mb-8">
      <h3 className="px-4 text-xs font-bold uppercase tracking-wider text-blue-300 mb-3">
        {title}
      </h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

interface CustomSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function CustomSidebar({ open, setOpen }: CustomSidebarProps) {
  return (
    <>
      {/* Mobile sidebar overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-70 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform bg-[#001435] transition-transform duration-300 ease-in-out md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto border-r border-blue-900">
          <div className="flex items-center justify-between border-b border-blue-900 px-6 py-5">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-blue-300" />
              <h2 className="text-lg font-semibold text-white">Pengaturan</h2>
            </div>
            <button
              type="button"
              className="rounded-md p-2 text-blue-300 hover:bg-[#002966] transition-colors"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </button>
          </div>
          <div className="flex-1 px-4 py-6">
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-full bg-[#001435] rounded-lg shadow-lg border border-blue-900">
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="flex items-center gap-3 border-b border-blue-900 px-6 py-5">
            <Settings className="h-6 w-6 text-blue-300" />
            <h2 className="text-lg font-semibold text-white">Pengaturan</h2>
          </div>
          <div className="flex-1 px-4 py-6">
            <SidebarContent />
          </div>
        </div>
      </div>
    </>
  );
}

function SidebarContent() {
  return (
    <>
      <SidebarSection title="Akun">
        <SidebarItem href="/profile/settings" icon={User}>
          Profil
        </SidebarItem>
      </SidebarSection>
    </>
  );
}
