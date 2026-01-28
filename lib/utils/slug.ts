import { createClient } from "@/lib/supabase/client";

/**
 * Generates a URL-friendly slug from a string
 * "Ping Soluções & Eventos" -> "ping-solucoes-eventos"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .replace(/[&]/g, "e") // Replace & with e
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
}

/**
 * Generates a random suffix for collision handling
 */
function generateRandomSuffix(length = 4): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generates a unique slug, handling collisions
 * If "ping-solucoes" exists, returns "ping-solucoes-a1b2"
 */
export async function generateUniqueSlug(
  text: string,
  existingSlug?: string
): Promise<string> {
  const supabase = createClient();
  let slug = generateSlug(text);

  // If editing and slug hasn't changed, return as is
  if (existingSlug && slug === existingSlug) {
    return slug;
  }

  // Check for existing slug
  const { data: existing } = await supabase
    .from("listings")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    // Slug exists, add random suffix
    slug = `${slug}-${generateRandomSuffix()}`;

    // Double-check the new slug doesn't exist (very rare but possible)
    const { data: stillExists } = await supabase
      .from("listings")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();

    if (stillExists) {
      // If still exists, try one more time with longer suffix
      slug = `${generateSlug(text)}-${generateRandomSuffix(6)}`;
    }
  }

  return slug;
}

/**
 * Validates if a slug is available
 */
export async function isSlugAvailable(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const supabase = createClient();

  const query = supabase
    .from("listings")
    .select("id")
    .eq("slug", slug);

  if (excludeId) {
    query.neq("id", excludeId);
  }

  const { data } = await query.maybeSingle();
  return !data;
}

/**
 * Reserved slugs that cannot be used by businesses
 */
export const RESERVED_SLUGS = [
  "buscar",
  "cadastrar",
  "painel",
  "admin",
  "auth",
  "api",
  "setup",
  "categoria",
  "negocio",
  "sobre",
  "contato",
  "termos",
  "privacidade",
  "ajuda",
  "faq",
];

/**
 * Checks if a slug is reserved
 */
export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug.toLowerCase());
}
