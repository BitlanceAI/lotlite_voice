"use client";

import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  TrendingUp, TrendingDown, Minus, MessageSquare, AlertCircle,
  ThumbsUp, ThumbsDown, CheckCircle2, XCircle, User, Shield,
  Activity, PhoneCall, Target, Thermometer,
} from "lucide-react";

export interface CallData {
  overall_sentiment: "positive" | "neutral" | "negative";
  sentiment_score: number;
  confidence: number;
  customer_emotion: string;
  interest_level: "low" | "medium" | "high";
  buying_intent: "low" | "medium" | "high";
  call_outcome: string;
  customer_satisfaction: "low" | "medium" | "high";
  objections: { id: number; text: string; handled: boolean }[] | any[];
  complaints: { id: number; text: string; resolved: boolean }[] | any[];
  key_topics: string[];
  positive_signals: string[];
  negative_signals: string[];
  summary: string;
}

const sentimentTrendData = [
  { time: "0:00",  score: 0  },
  { time: "2:00",  score: 20 },
  { time: "4:00",  score: -10},
  { time: "6:00",  score: 40 },
  { time: "8:00",  score: 30 },
  { time: "10:00", score: 65 },
  { time: "12:00", score: 80 },
];

export default function CallAnalyticsDashboard({ data }: { data: CallData | null }) {
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-neutral-400 animate-pulse flex flex-col items-center">
          <Activity className="w-8 h-8 mb-4 text-red-600" />
          Loading analytics data...
        </div>
      </div>
    );
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "high":   return "bg-red-600 text-white border-red-600";
      case "medium": return "bg-black text-white border-black";
      case "low":    return "bg-white text-black border-black";
      default:       return "bg-white text-neutral-500 border-neutral-300";
    }
  };

  const getSentimentBadge = (s: string) => {
    switch (s) {
      case "positive": return "bg-red-600 text-white border-red-600";
      case "negative": return "bg-black text-white border-black";
      default:         return "bg-white text-black border-black";
    }
  };

  const sentimentIcon =
    data.overall_sentiment === "positive" ? <TrendingUp  className="w-5 h-5" /> :
    data.overall_sentiment === "negative" ? <TrendingDown className="w-5 h-5" /> :
                                            <Minus        className="w-5 h-5" />;

  const pieValue =
    data.overall_sentiment === "positive" ? 100 :
    data.overall_sentiment === "negative" ? 10  : 50;

  const sentimentPieData = [
    { name: "Positive", value: pieValue,           color: "#dc2626" },
    { name: "Neutral",  value: 100 - pieValue - 10, color: "#737373" },
    { name: "Negative", value: 10,                  color: "#000000" },
  ];

  const safeParseArray = (val: any) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") { try { return JSON.parse(val); } catch { return []; } }
    return [];
  };

  const objections       = safeParseArray(data.objections);
  const complaints       = safeParseArray(data.complaints);
  const key_topics       = safeParseArray(data.key_topics);
  const positive_signals = safeParseArray(data.positive_signals);
  const negative_signals = safeParseArray(data.negative_signals);

  const kpis = [
    { label: "Overall Sentiment", value: data.overall_sentiment || "neutral", icon: sentimentIcon,                                  isBadge: true,  badgeCls: getSentimentBadge(data.overall_sentiment) },
    { label: "Sentiment Score",   value: data.sentiment_score ?? 0,           icon: <Activity   className="w-5 h-5 text-red-600" />, suffix: "/100" },
    { label: "Confidence",        value: data.confidence ?? 0,                icon: <Shield     className="w-5 h-5 text-black"   />, suffix: "%" },
    { label: "Interest Level",    value: data.interest_level || "low",        icon: <Target     className="w-5 h-5 text-red-600" />, isBadge: true, badgeCls: getLevelBadge(data.interest_level) },
    { label: "Buying Intent",     value: data.buying_intent || "low",         icon: <Thermometer className="w-5 h-5 text-black"  />, isBadge: true, badgeCls: getLevelBadge(data.buying_intent) },
    { label: "Satisfaction",      value: data.customer_satisfaction || "low", icon: <User       className="w-5 h-5 text-red-600" />, isBadge: true, badgeCls: getLevelBadge(data.customer_satisfaction) },
  ];

  return (
    <div className="min-h-screen bg-white p-6 md:p-8 text-black font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-black">
              Call Analytics Dashboard
            </h1>
            <p className="text-neutral-500 mt-1">Bitlance Voice Dashboard Insights</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border-2 border-black">
            <span className="flex items-center gap-2 text-sm font-bold">
              <PhoneCall className="w-4 h-4 text-red-600" />
              Live Insights
            </span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border-2 border-black flex flex-col justify-between">
              <div className="flex items-center gap-2 text-neutral-500 mb-3">
                {kpi.icon}
                <span className="text-xs font-bold uppercase tracking-wider">{kpi.label}</span>
              </div>
              <div>
                {kpi.isBadge ? (
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold capitalize border ${kpi.badgeCls}`}>
                    {kpi.value}
                  </span>
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-2xl font-black">{kpi.value}</span>
                    {kpi.suffix && <span className="ml-1 text-sm text-neutral-500 font-medium">{kpi.suffix}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Middle Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Summary */}
            <div className="bg-white rounded-2xl p-6 border-2 border-black relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600" />
              <h2 className="text-lg font-black flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-red-600" />
                AI Call Summary
              </h2>
              <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {data.summary || "No summary available."}
              </p>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border-2 border-black">
                <h2 className="text-lg font-black mb-6">Sentiment Over Time</h2>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sentimentTrendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#737373" }} />
                      <YAxis domain={[-100, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#737373" }} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "2px solid black", boxShadow: "none" }} />
                      <Line type="monotone" dataKey="score" stroke="#dc2626" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-black flex flex-col">
                <h2 className="text-lg font-black mb-4">Sentiment Distribution</h2>
                <div className="flex-grow flex items-center justify-center relative">
                  <div className="h-48 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={sentimentPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {sentimentPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-black">{data.sentiment_score ?? 0}</span>
                      <span className="text-xs text-neutral-500">Score</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Signals */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border-2 border-black">
                <h2 className="text-lg font-black flex items-center gap-2 mb-4 text-red-600">
                  <ThumbsUp className="w-5 h-5" />
                  Positive Signals
                </h2>
                <ul className="space-y-3">
                  {positive_signals.length > 0 ? positive_signals.map((signal: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <span className="text-neutral-700 text-sm">{signal}</span>
                    </li>
                  )) : <p className="text-sm text-neutral-400">No positive signals detected.</p>}
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-black">
                <h2 className="text-lg font-black flex items-center gap-2 mb-4 text-black">
                  <ThumbsDown className="w-5 h-5" />
                  Negative Signals
                </h2>
                <ul className="space-y-3">
                  {negative_signals.length > 0 ? negative_signals.map((signal: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-black shrink-0 mt-0.5" />
                      <span className="text-neutral-700 text-sm">{signal}</span>
                    </li>
                  )) : <p className="text-sm text-neutral-400">No negative signals detected.</p>}
                </ul>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border-2 border-black">
              <h2 className="text-lg font-black mb-4">Qualification</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Customer Emotion</p>
                  <p className="font-bold text-black capitalize">{data.customer_emotion || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Call Outcome</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-bold bg-white text-black capitalize border-2 border-black">
                    {(data.call_outcome || "Pending").replace("_", " ")}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-2">Key Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {key_topics.length > 0 ? key_topics.map((topic: string, i: number) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                        {topic}
                      </span>
                    )) : <span className="text-sm text-neutral-400">No topics identified.</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-black min-h-[300px]">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Objections
                  </h2>
                  {objections.length > 0 ? (
                    <ul className="space-y-3">
                      {objections.map((obj: any, i: number) => (
                        <li key={i} className="flex flex-col gap-1 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                          <span className="text-sm font-medium text-black">{obj.text || obj}</span>
                          <span className={`text-xs font-bold ${obj.handled ? "text-red-600" : "text-neutral-400"}`}>
                            {obj.handled ? "✓ Handled" : "⚠ Needs Follow-up"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-neutral-400">No objections raised.</p>}
                </div>

                <div>
                  <h2 className="text-lg font-black flex items-center gap-2 mb-4">
                    <XCircle className="w-5 h-5 text-black" />
                    Complaints
                  </h2>
                  {complaints.length > 0 ? (
                    <ul className="space-y-3">
                      {complaints.map((comp: any, i: number) => (
                        <li key={i} className="flex flex-col gap-1 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                          <span className="text-sm font-medium text-black">{comp.text || comp}</span>
                          <span className={`text-xs font-bold ${comp.resolved ? "text-red-600" : "text-neutral-400"}`}>
                            {comp.resolved ? "✓ Resolved" : "⚠ Unresolved"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-neutral-400">No complaints raised.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
