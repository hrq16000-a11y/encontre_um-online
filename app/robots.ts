import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/painel", "/auth/", "/api/", "/setup"],
      },
    ],
    sitemap: "https://encontreum.com.br/sitemap.xml",
  };
}
