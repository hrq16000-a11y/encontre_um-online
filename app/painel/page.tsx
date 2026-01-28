import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdvertiserDashboard } from "@/components/advertiser-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel do Anunciante | Encontre Um",
  description: "Gerencie seus negócios e acompanhe suas estatísticas.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get user's listings
  const { data: listings } = await supabase
    .from("listings")
    .select(`
      *,
      category:categories(id, name, slug, icon)
    `)
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  // Get analytics for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const listingIds = listings?.map(l => l.id) || [];
  
  let analytics: { event_type: string; count: number }[] = [];
  if (listingIds.length > 0) {
    const { data: analyticsData } = await supabase
      .from("analytics_events")
      .select("event_type")
      .in("listing_id", listingIds)
      .gte("created_at", thirtyDaysAgo.toISOString());

    // Count events by type
    const counts: Record<string, number> = {};
    analyticsData?.forEach(event => {
      counts[event.event_type] = (counts[event.event_type] || 0) + 1;
    });
    analytics = Object.entries(counts).map(([event_type, count]) => ({
      event_type,
      count,
    }));
  }

  return (
    <AdvertiserDashboard
      profile={profile}
      listings={listings || []}
      analytics={analytics}
    />
  );
}
