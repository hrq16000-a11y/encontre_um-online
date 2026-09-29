import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Encontre Um",
  description: "Painel administrativo do Encontre Um.",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/painel");
  }

  // Get platform stats
  const { count: totalListings } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true });

  const { count: activeListings } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: pendingListings } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: totalReviews } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true });

  // Get pending listings for review
  const { data: pendingListingsData } = await supabase
    .from("listings")
    .select(`
      *,
      category:categories(id, name, slug, icon),
      owner:profiles(id, full_name, avatar_url)
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(20);

  // Get recent listings
  const { data: recentListings } = await supabase
    .from("listings")
    .select(`
      *,
      category:categories(id, name, slug, icon),
      owner:profiles(id, full_name, avatar_url)
    `)
    .order("created_at", { ascending: false })
    .limit(10);

  // Get analytics for last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: recentAnalytics } = await supabase
    .from("analytics_events")
    .select("event_type, created_at")
    .gte("created_at", sevenDaysAgo.toISOString());

  // Count events by type
  const analyticsCounts: Record<string, number> = {};
  recentAnalytics?.forEach(event => {
    analyticsCounts[event.event_type] = (analyticsCounts[event.event_type] || 0) + 1;
  });

  return (
    <AdminDashboard
      profile={profile}
      stats={{
        totalListings: totalListings || 0,
        activeListings: activeListings || 0,
        pendingListings: pendingListings || 0,
        totalUsers: totalUsers || 0,
        totalReviews: totalReviews || 0,
        weeklyViews: analyticsCounts.view || 0,
        weeklyContacts: (analyticsCounts.whatsapp_click || 0) + (analyticsCounts.phone_click || 0),
      }}
      pendingListings={pendingListingsData || []}
      recentListings={recentListings || []}
    />
  );
}
