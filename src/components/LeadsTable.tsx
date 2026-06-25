"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { CallData } from "@/components/CallAnalyticsDashboard";

export interface LeadRecord extends Partial<CallData> {
  id: string | number;
  created_at: string;
  customer_name?: string | null;
  customer_phone?: string | null;
}

export default function LeadsTable({ leads }: { leads: LeadRecord[] | null }) {
  if (!leads) {
    return (
      <div className="bg-white rounded-2xl border-2 border-black p-8 text-center text-neutral-500">
        <div className="animate-pulse">Loading leads data...</div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-black p-8 text-center text-neutral-500">
        No leads found.
      </div>
    );
  }

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case "positive": return <TrendingUp  className="w-4 h-4 text-red-600" />;
      case "negative": return <TrendingDown className="w-4 h-4 text-black" />;
      default:         return <Minus        className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getLevelBadge = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "high":
      case "hot":
        return "bg-red-600 text-white border-red-600";
      case "medium":
      case "warm":
        return "bg-black text-white border-black";
      case "low":
      case "cold":
        return "bg-white text-black border-black";
      default:
        return "bg-white text-neutral-500 border-neutral-300";
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-black overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-6 py-4 font-bold tracking-wide">Customer</th>
              <th className="px-6 py-4 font-bold tracking-wide">Date</th>
              <th className="px-6 py-4 font-bold tracking-wide">Call Outcome</th>
              <th className="px-6 py-4 font-bold tracking-wide">Interest</th>
              <th className="px-6 py-4 font-bold tracking-wide">Intent</th>
              <th className="px-6 py-4 font-bold tracking-wide">Sentiment</th>
              <th className="px-6 py-4 font-bold tracking-wide text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-red-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-black">{lead.customer_name || "Unknown"}</div>
                  <div className="text-xs text-neutral-500">{lead.customer_phone || "No phone"}</div>
                </td>
                <td className="px-6 py-4 text-neutral-600 text-sm">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className="capitalize font-medium text-black">
                    {(lead.call_outcome || "Unknown").replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getLevelBadge(lead.interest_level)}`}>
                    {lead.interest_level || "Unknown"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getLevelBadge(lead.buying_intent)}`}>
                    {lead.buying_intent || "Unknown"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(lead.overall_sentiment)}
                    <span className="capitalize font-medium text-black">
                      {lead.overall_sentiment || "Unknown"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/dashboard?id=${lead.id}`}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-bold transition-colors"
                  >
                    View Analytics
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
