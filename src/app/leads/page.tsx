import { supabase } from "@/lib/supabase";
import LeadsTable, { LeadRecord } from "@/components/LeadsTable";

export default async function LeadsPage() {
  let leads: LeadRecord[] | null = null;
  let error = null;

  if (supabase) {
    const res = await supabase
      .from("call_analytics")
      .select("id, created_at, call_outcome, interest_level, buying_intent, overall_sentiment, customer_name, customer_phone")
      .order("created_at", { ascending: false })
      .limit(50);
    
    leads = res.data as LeadRecord[];
    error = res.error;
  } else {
    error = { message: "Supabase client not initialized (check .env.local)" };
  }

  if (error) {
    console.warn("Supabase fetch warning on leads page:", error.message || error);
  }

  // Fallback mock data if Supabase isn't connected or table is empty
  const fallbackLeads: LeadRecord[] = [
    {
      id: "LD-1001",
      created_at: new Date().toISOString(),
      customer_name: "Rahul",
      customer_phone: "+91 9876543210",
      call_outcome: "scheduled_followup",
      interest_level: "high",
      buying_intent: "high",
      overall_sentiment: "positive"
    },
    {
      id: "LD-1002",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      customer_name: "Anita Smith",
      customer_phone: "+1 555-0192",
      call_outcome: "not_interested",
      interest_level: "low",
      buying_intent: "low",
      overall_sentiment: "negative"
    },
    {
      id: "LD-1003",
      created_at: new Date(Date.now() - 172800000).toISOString(),
      customer_name: "Unknown Caller",
      customer_phone: "No phone",
      call_outcome: "needs_more_info",
      interest_level: "medium",
      buying_intent: "medium",
      overall_sentiment: "neutral"
    }
  ];

  const displayLeads = (leads && leads.length > 0) ? leads : fallbackLeads;

  return (
    <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border-2 border-red-600">
          <strong>Warning:</strong> Could not fetch leads from Supabase table `call_analytics`. Showing mock data instead.
        </div>
      )}

      <div>
        <h1 className="text-3xl font-black tracking-tight text-black">
          Leads Pipeline
        </h1>
        <p className="text-neutral-500 mt-1">
          Track and manage your incoming calls and qualified prospects.
        </p>
      </div>

      <LeadsTable leads={displayLeads} />
    </main>
  );
}
