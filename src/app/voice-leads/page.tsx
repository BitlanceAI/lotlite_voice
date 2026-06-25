import { supabase } from "@/lib/supabase";
import VoiceLeadsTable, { VoiceLead } from "@/components/VoiceLeadsTable";

export default async function VoiceLeadsPage() {
  let leads: VoiceLead[] | null = null;
  let error = null;

  if (supabase) {
    const res = await supabase
      .from("lotlite_leads")
      .select(
        "id, call_id, call_time, duration_seconds, preferred_language, purpose, full_name, mobile_number, email, property_type, city, locality, budget, size_bhk, amenities, move_in_timeline, recording_url, transcript_url, phone_number"
      )
      .order("call_time", { ascending: false })
      .limit(100);

    leads = res.data as VoiceLead[];
    error = res.error;
  } else {
    error = { message: "Supabase client not initialized (check .env.local)" };
  }

  if (error) {
    console.warn("Supabase fetch warning on voice-leads page:", error.message || error);
  }

  const fallback: VoiceLead[] = [
    {
      id: 1,
      call_id: "demo-001",
      call_time: new Date().toISOString(),
      duration_seconds: "187",
      preferred_language: "Marathi",
      purpose: "buy",
      full_name: "Rahul Patil",
      mobile_number: "+91 98765 43210",
      email: "rahul@example.com",
      property_type: "apartment",
      city: "Pune",
      locality: "Baner",
      budget: "85 lakhs",
      size_bhk: "3 BHK",
      amenities: "parking, gym, security",
      move_in_timeline: "3 months",
      recording_url: null,
      transcript_url: null,
      phone_number: "+91 98765 43210",
    },
    {
      id: 2,
      call_id: "demo-002",
      call_time: new Date(Date.now() - 86400000).toISOString(),
      duration_seconds: "143",
      preferred_language: "Hindi",
      purpose: "rent",
      full_name: "Priya Sharma",
      mobile_number: "+91 87654 32109",
      email: null,
      property_type: "apartment",
      city: "Mumbai",
      locality: "Andheri West",
      budget: "35000/month",
      size_bhk: "2 BHK",
      amenities: "parking, power backup",
      move_in_timeline: "immediate",
      recording_url: null,
      transcript_url: null,
      phone_number: "+91 87654 32109",
    },
    {
      id: 3,
      call_id: "demo-003",
      call_time: new Date(Date.now() - 172800000).toISOString(),
      duration_seconds: "210",
      preferred_language: "English",
      purpose: "buy",
      full_name: "Amit Desai",
      mobile_number: "+91 76543 21098",
      email: "amit.desai@example.com",
      property_type: "villa",
      city: "Nashik",
      locality: "Gangapur Road",
      budget: "1.2 crores",
      size_bhk: "4 BHK",
      amenities: "swimming pool, garden, security",
      move_in_timeline: "6 months",
      recording_url: null,
      transcript_url: null,
      phone_number: "+91 76543 21098",
    },
  ];

  const displayLeads = leads && leads.length > 0 ? leads : fallback;

  return (
    <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border-2 border-red-600">
          <strong>Warning:</strong> Could not fetch from Supabase table{" "}
          <code>lotlite_leads</code>. Showing demo data instead.
        </div>
      )}

      <div>
        <h1 className="text-3xl font-black tracking-tight text-black">
          Voice Leads
        </h1>
        <p className="text-neutral-500 mt-1">
          All inbound leads captured by the LotLite Real Estate voice agent.
        </p>
      </div>

      <VoiceLeadsTable leads={displayLeads} />
    </main>
  );
}
