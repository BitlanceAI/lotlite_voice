import { supabase } from "@/lib/supabase";
import CallAnalyticsDashboard, { CallData } from "@/components/CallAnalyticsDashboard";

// Next.js Server Component
export default async function CallAnalyticsPage() {
  let data = null;
  let error = null;

  if (supabase) {
    const res = await supabase
      .from("call_analytics")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    data = res.data;
    error = res.error;
  } else {
    error = { message: "Supabase client not initialized (check .env.local)" };
  }

  if (error) {
    console.warn("Supabase fetch warning:", error.message || error);
    // If table doesn't exist or error, provide fallback sample data so UI still renders
  }

  const sampleFallbackData: CallData = {
    overall_sentiment: "positive",
    sentiment_score: 65,
    confidence: 88,
    customer_emotion: "calm, pragmatic, decisive",
    interest_level: "high",
    buying_intent: "high",
    call_outcome: "scheduled_followup",
    customer_satisfaction: "high",
    objections: [
      { id: 1, text: "Price is slightly above budget", handled: true },
      { id: 2, text: "Need more time to decide", handled: false },
    ],
    complaints: [
      { id: 1, text: "Wait time was long", resolved: true }
    ],
    key_topics: ["Pricing", "Move-in date", "Amenities", "Neighborhood"],
    positive_signals: ["Asked about financing", "Agreed to tour", "Loved the kitchen"],
    negative_signals: ["Mentioned high HOA fees", "Hesitant about location"],
    summary: "Customer showed strong interest in the 3BR property. They were initially concerned about the price but warmed up after discussing the included amenities. They are looking to move in within 60 days and have agreed to an in-person tour next week."
  };

  const dashboardData = data || sampleFallbackData;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {error && (
        <div className="bg-amber-100 text-amber-800 px-4 py-2 text-sm text-center">
          Warning: Could not connect to Supabase table `call_analytics` (Are credentials set in .env.local?). Showing mock data.
        </div>
      )}
      <CallAnalyticsDashboard data={dashboardData as CallData} />
    </main>
  );
}
