import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BusinessDetail } from "@/components/business-detail";

interface BusinessPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BusinessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select(
      `
      *,
      category:categories(name)
    `
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!listing) {
    return {
      title: "Negócio não encontrado | Encontre Um",
    };
  }

  return {
    title: `${listing.name} - ${listing.category?.name} | Encontre Um`,
    description:
      listing.description ||
      `${listing.name} em ${listing.city}, ${listing.state}. Contato direto via WhatsApp.`,
    openGraph: {
      title: listing.name,
      description: listing.description || `${listing.name} - ${listing.category?.name}`,
      images: listing.cover_url ? [listing.cover_url] : [],
    },
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Get listing with category
  const { data: listing } = await supabase
    .from("listings")
    .select(
      `
      *,
      category:categories(id, name, slug, icon)
    `
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!listing) {
    notFound();
  }

  // Get reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `
      *,
      user:profiles(id, full_name, avatar_url)
    `
    )
    .eq("listing_id", listing.id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Increment view count (fire and forget)
  supabase
    .from("listings")
    .update({ view_count: listing.view_count + 1 })
    .eq("id", listing.id)
    .then();

  // Log analytics event
  supabase
    .from("analytics_events")
    .insert({
      listing_id: listing.id,
      event_type: "view",
    })
    .then();

  return <BusinessDetail listing={listing} reviews={reviews || []} />;
}
