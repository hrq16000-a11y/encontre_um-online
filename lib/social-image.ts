/** Public brand fallback; never point to a temporary preview deploy. */
export const DEFAULT_SOCIAL_IMAGE = {
  url: "https://www.encontreum.online/social-preview.png",
  width: 1200,
  height: 630,
  alt: "Encontre Um — serviços, profissionais e negócios na sua região",
};

/** Reuse the listing's existing public cover when it is a valid HTTPS URL. */
export function listingSocialImage(cover: unknown, title: string) {
  if (typeof cover !== "string" || !cover.trim()) return DEFAULT_SOCIAL_IMAGE;
  try {
    const url = new URL(cover);
    if (url.protocol === "https:" && !url.username && !url.password) {
      return { url: url.href, alt: title };
    }
  } catch {
    // A missing or malformed public cover uses the branded fallback.
  }
  return DEFAULT_SOCIAL_IMAGE;
}
