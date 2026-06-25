"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  PhoneCall,
  LogOut,
  Building,
  PhoneIncoming
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Voice Leads", href: "/voice-leads", icon: PhoneIncoming },

];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r-2 border-black bg-white flex flex-col hidden md:flex h-screen sticky top-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b-2 border-black">
        <div className="flex items-center gap-2 font-black text-xl tracking-tight text-black">
          <Building className="w-6 h-6 text-red-600" />
          <span>RealAgent</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive
                  ? "bg-red-600 text-white"
                  : "text-black hover:bg-neutral-100"
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-red-600"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t-2 border-black">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-black hover:bg-neutral-100 w-full transition-colors">
          <LogOut className="w-5 h-5 text-red-600" />
          Log out
        </button>
      </div>
    </aside>
  );
}
