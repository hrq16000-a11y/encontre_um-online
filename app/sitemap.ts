import { createClient } from "@/lib/supabase/server";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = "https://encontreum.com.br";

  // Get all active listings
  const { data: listings } = await supabase
    .from("listings")
    .select("slug, updated_at")
    .eq("status", "active");

  // Get all categories
  const { data: categories } = await supabase
    .from("categories")
    .select("slug");

  const listingUrls: MetadataRoute.Sitemap = (listings || []).map((listing) => ({
    url: `${baseUrl}/${listing.slug}`,
    lastModified: new Date(listing.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = (categories || []).map((category) => ({
    url: `${baseUrl}/buscar?category=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/buscar`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cadastrar`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...listingUrls,
    ...categoryUrls,
  ];
}
