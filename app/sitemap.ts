import { createClient } from "@/lib/supabase/server";
import { MetadataRoute } from "next";

const BASE_URL = "https://encontreum.online";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from("listings")
    .select("slug, updated_at")
    .eq("status", "active");

  const listingUrls: MetadataRoute.Sitemap = (listings || []).map((listing) => ({
    url: `${BASE_URL}/${listing.slug}`,
    lastModified: listing.updated_at ? new Date(listing.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...listingUrls,
  ];
}
