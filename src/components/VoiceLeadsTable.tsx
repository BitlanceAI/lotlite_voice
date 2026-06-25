"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Home,
  IndianRupee,
  Clock,
  Mic,
  FileText,
  Languages,
  Search,
  Filter,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export interface VoiceLead {
  id: string | number;
  call_id: string;
  call_time: string | null;
  duration_seconds: string | null;
  preferred_language: string | null;
  purpose: string | null;
  full_name: string | null;
  mobile_number: string | null;
  email: string | null;
  property_type: string | null;
  city: string | null;
  locality: string | null;
  budget: string | null;
  size_bhk: string | null;
  amenities: string | null;
  move_in_timeline: string | null;
  recording_url: string | null;
  transcript_url: string | null;
  phone_number: string | null;
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-black p-5">
      <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-black mt-1">{value}</p>
      {sub && <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>}
    </div>
  );
}

const languageBadge: Record<string, string> = {
  marathi: "bg-red-50 text-red-700 border-red-300",
  hindi:   "bg-black text-white border-black",
  english: "bg-white text-black border-black",
};

const purposeBadge: Record<string, string> = {
  rent: "bg-white text-black border-black",
  buy:  "bg-red-600 text-white border-red-600",
};

function Badge({ value, map }: { value: string | null; map: Record<string, string> }) {
  if (!value) return <span className="text-neutral-400 text-xs">—</span>;
  const key = value.toLowerCase();
  const cls = map[key] ?? "bg-white text-black border-neutral-300";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${cls}`}>
      {value}
    </span>
  );
}

function formatDuration(seconds: string | null) {
  if (!seconds) return "—";
  const s = parseFloat(seconds);
  if (isNaN(s)) return "—";
  const m = Math.floor(s / 60);
  const rem = Math.floor(s % 60);
  return m > 0 ? `${m}m ${rem}s` : `${rem}s`;
}

function formatDate(dt: string | null) {
  if (!dt) return "—";
  try {
    return new Date(dt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return dt;
  }
}

export default function VoiceLeadsTable({ leads }: { leads: VoiceLead[] }) {
  const [rows, setRows] = useState<VoiceLead[]>(leads);
  const [search, setSearch] = useState("");
  const [purposeFilter, setPurposeFilter] = useState<"all" | "rent" | "buy">("all");
  const [confirmId, setConfirmId] = useState<string | number | null>(null);
  const [deleting, setDeleting] = useState<string | number | null>(null);

  async function handleDelete(lead: VoiceLead) {
    setDeleting(lead.id);
    if (supabase) {
      await supabase.from("lotlite_leads").delete().eq("id", lead.id);
    }
    setRows((prev) => prev.filter((r) => r.id !== lead.id));
    setConfirmId(null);
    setDeleting(null);
  }

  const filtered = rows.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (l.full_name ?? "").toLowerCase().includes(q) ||
      (l.phone_number ?? "").toLowerCase().includes(q) ||
      (l.city ?? "").toLowerCase().includes(q) ||
      (l.property_type ?? "").toLowerCase().includes(q);
    const matchPurpose =
      purposeFilter === "all" || (l.purpose ?? "").toLowerCase() === purposeFilter;
    return matchSearch && matchPurpose;
  });

  const total = rows.length;
  const rentCount = rows.filter((l) => l.purpose?.toLowerCase() === "rent").length;
  const buyCount  = rows.filter((l) => l.purpose?.toLowerCase() === "buy").length;
  const topCity = (() => {
    const counts: Record<string, number> = {};
    rows.forEach((l) => { if (l.city) counts[l.city] = (counts[l.city] ?? 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  })();
  const avgDuration = (() => {
    const valid = rows.map((l) => parseFloat(l.duration_seconds ?? "")).filter((n) => !isNaN(n));
    if (!valid.length) return "—";
    return formatDuration(String(valid.reduce((a, b) => a + b, 0) / valid.length));
  })();

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Calls"  value={total} />
        <StatCard label="Rent Leads"   value={rentCount} sub={`${buyCount} buying`} />
        <StatCard label="Top City"     value={topCity} />
        <StatCard label="Avg Duration" value={avgDuration} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, phone, city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border-2 border-black bg-white text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400" />
          {(["all", "rent", "buy"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setPurposeFilter(v)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors border-2 ${
                purposeFilter === v
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black hover:bg-neutral-100"
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border-2 border-black overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 font-medium">No leads found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-5 py-4 font-bold tracking-wide">Caller</th>
                  <th className="px-5 py-4 font-bold tracking-wide">Language</th>
                  <th className="px-5 py-4 font-bold tracking-wide">Purpose</th>
                  <th className="px-5 py-4 font-bold tracking-wide">Property</th>
                  <th className="px-5 py-4 font-bold tracking-wide">Location</th>
                  <th className="px-5 py-4 font-bold tracking-wide">Budget</th>
                  <th className="px-5 py-4 font-bold tracking-wide">BHK / Size</th>
                  <th className="px-5 py-4 font-bold tracking-wide">Timeline</th>
                  <th className="px-5 py-4 font-bold tracking-wide">Duration</th>
                  <th className="px-5 py-4 font-bold tracking-wide">Date</th>
                  <th className="px-5 py-4 font-bold tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-red-50 transition-colors">

                    {/* Caller */}
                    <td className="px-5 py-4 min-w-[160px]">
                      <div className="font-bold text-black">
                        {lead.full_name?.trim() || <span className="text-neutral-400 font-normal">No name</span>}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-neutral-600 mt-0.5">
                        <Phone className="w-3 h-3 shrink-0 text-red-600" />
                        <span>{lead.phone_number?.trim() || <span className="text-neutral-400">No phone</span>}</span>
                      </div>
                      {lead.email?.trim() && (
                        <div className="flex items-center gap-1 text-xs text-neutral-400 mt-0.5">
                          <Mail className="w-3 h-3 shrink-0" />
                          {lead.email.trim()}
                        </div>
                      )}
                    </td>

                    {/* Language */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Languages className="w-3.5 h-3.5 text-neutral-400" />
                        <Badge value={lead.preferred_language} map={languageBadge} />
                      </div>
                    </td>

                    {/* Purpose */}
                    <td className="px-5 py-4">
                      <Badge value={lead.purpose} map={purposeBadge} />
                    </td>

                    {/* Property */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-black">
                        <Home className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="capitalize">{lead.property_type || "—"}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-black">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>{[lead.locality, lead.city].filter(Boolean).join(", ") || "—"}</span>
                      </div>
                    </td>

                    {/* Budget */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 font-bold text-black">
                        <IndianRupee className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        {lead.budget || "—"}
                      </div>
                    </td>

                    {/* BHK */}
                    <td className="px-5 py-4 text-black font-medium">
                      {lead.size_bhk || "—"}
                    </td>

                    {/* Timeline */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-neutral-700">
                        <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        {lead.move_in_timeline || "—"}
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="px-5 py-4 text-neutral-600 tabular-nums font-medium">
                      {formatDuration(lead.duration_seconds)}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-neutral-600 whitespace-nowrap">
                      {formatDate(lead.call_time)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        {lead.recording_url && (
                          <a
                            href={lead.recording_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Recording"
                            className="p-1.5 rounded-lg text-black hover:bg-black hover:text-white transition-colors"
                          >
                            <Mic className="w-4 h-4" />
                          </a>
                        )}
                        {lead.transcript_url && (
                          <a
                            href={lead.transcript_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Transcript"
                            className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        )}

                        {confirmId === lead.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(lead)}
                              disabled={deleting === lead.id}
                              title="Confirm delete"
                              className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                              {deleting === lead.id
                                ? <span className="w-4 h-4 block border-2 border-white border-t-transparent rounded-full animate-spin" />
                                : <Check className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              title="Cancel"
                              className="p-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmId(lead.id)}
                            title="Delete lead"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-neutral-400 text-right font-medium">
        Showing {filtered.length} of {total} calls
      </p>
    </div>
  );
}
