"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Building,
  PhoneIncoming,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard",   href: "/dashboard",   icon: LayoutDashboard },
  { name: "Leads",       href: "/leads",        icon: Users },
  { name: "Voice Leads", href: "/voice-leads",  icon: PhoneIncoming },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavLinks = ({ onNav }: { onNav?: () => void }) => (
    <>
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNav}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              isActive
                ? "bg-red-600 text-white"
                : "text-black hover:bg-neutral-100"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-red-600"}`} />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="w-64 flex-shrink-0 border-r-2 border-black bg-white flex-col hidden md:flex h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b-2 border-black">
          <div className="flex items-center gap-2 font-black text-xl tracking-tight text-black">
            <Building className="w-6 h-6 text-red-600" />
            <span>RealAgent</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <NavLinks />
        </nav>
        <div className="p-4 border-t-2 border-black">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-black hover:bg-neutral-100 w-full transition-colors">
            <LogOut className="w-5 h-5 text-red-600" />
            Log out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b-2 border-black flex items-center justify-between px-4">
        <div className="flex items-center gap-2 font-black text-lg tracking-tight text-black">
          <Building className="w-5 h-5 text-red-600" />
          <span>RealAgent</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-black" />
        </button>
      </div>

      {/* ── Mobile drawer backdrop ── */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white border-r-2 border-black flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-14 flex items-center justify-between px-5 border-b-2 border-black">
          <div className="flex items-center gap-2 font-black text-lg tracking-tight text-black">
            <Building className="w-5 h-5 text-red-600" />
            <span>RealAgent</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <NavLinks onNav={() => setOpen(false)} />
        </nav>
        <div className="p-4 border-t-2 border-black">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-black hover:bg-neutral-100 w-full transition-colors">
            <LogOut className="w-5 h-5 text-red-600" />
            Log out
          </button>
        </div>
      </div>
    </>
  );
}
