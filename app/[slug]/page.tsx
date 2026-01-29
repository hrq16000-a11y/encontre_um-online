import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BusinessDetailPage } from "@/components/business-detail-page";

// Reserved slugs that should not be treated as business pages
const RESERVED_SLUGS = [
  "buscar",
  "cadastrar",
  "painel",
  "admin",
  "auth",
  "api",
  "setup",
  "categoria",
  "negocio",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
];

// Check if slug is reserved (case insensitive, handles nested routes)
function isReservedRoute(slug: string): boolean {
  const lowerSlug = slug.toLowerCase();
  return RESERVED_SLUGS.some(reserved => 
    lowerSlug === reserved || lowerSlug.startsWith(`${reserved}/`)
  );
}

interface BusinessPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BusinessPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Skip reserved routes
  if (isReservedRoute(slug)) {
    return {};
  }

  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select(`*, category:categories(name)`)
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!listing) {
    return {
      title: "Empresa não encontrada | Encontre Um",
      description: "Esta empresa ainda não está cadastrada no Encontre Um.",
    };
  }

  const title = listing.seo_title || `${listing.title} | Encontre Um`;
  const description =
    listing.seo_description ||
    listing.description ||
    `${listing.title} em ${listing.city}, ${listing.state}. Contato direto via WhatsApp.`;

  return {
    title,
    description,
    openGraph: {
      title: listing.title,
      description,
      type: "website",
      locale: "pt_BR",
      images: listing.cover_image_url ? [listing.cover_image_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description,
    },
    alternates: {
      canonical: `https://encontreum.com.br/${slug}`,
    },
  };
}

// Generate JSON-LD structured data for LocalBusiness
function generateJsonLd(listing: {
  title: string;
  description?: string | null;
  phone_whatsapp?: string | null;
  phone_primary?: string | null;
  address?: string | null;
  address_full?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  business_hours?: Record<string, { open: string; close: string }> | null;
  slug: string;
  category?: { name: string } | null;
}) {
  const phone = listing.phone_whatsapp || listing.phone_primary;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: listing.title,
    description: listing.description || undefined,
    image: listing.cover_image_url || listing.logo_url || undefined,
    logo: listing.logo_url || undefined,
    telephone: phone ? `+55${phone.replace(/\D/g, "")}` : undefined,
    address: listing.address_full || listing.address
      ? {
          "@type": "PostalAddress",
          streetAddress: listing.address_full || listing.address,
          addressLocality: listing.city,
          addressRegion: listing.state,
          postalCode: listing.postal_code,
          addressCountry: "BR",
        }
      : undefined,
    url: `https://encontreum.com.br/${listing.slug}`,
    priceRange: "$$",
    ...(listing.category?.name && {
      "@type": ["LocalBusiness", listing.category.name],
    }),
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;

  console.log("[v0] BusinessPage called with slug:", slug);

  // Reserved routes should be handled by their own page.tsx files
  // If this dynamic route catches a reserved slug, something is wrong
  // Just return null to avoid conflicts
  if (isReservedRoute(slug)) {
    console.log("[v0] Slug is reserved:", slug);
    // Return null - Next.js should handle static routes first
    // This is a fallback in case routing doesn't work as expected
    return null;
  }

  const supabase = await createClient();

  // Get listing with category
  const { data: listing, error } = await supabase
    .from("listings")
    .select(`*, category:categories(id, name, slug, icon)`)
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (error || !listing) {
    console.log("[v0] Listing not found for slug:", slug, error);
    notFound();
  }

  // Get reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`*, user:profiles(id, full_name, avatar_url)`)
    .eq("listing_id", listing.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(10);

  // Increment view count using RPC function
  await supabase.rpc("increment_listing_views", { listing_uuid: listing.id });

  // Log analytics event
  await supabase.from("analytics_events").insert({
    listing_id: listing.id,
    event_type: "view",
  });

  const jsonLd = generateJsonLd(listing);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BusinessDetailPage listing={listing} reviews={reviews || []} />
    </>
  );
}
