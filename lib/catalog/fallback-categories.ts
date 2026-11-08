import type { Category } from "@/lib/types/database";

export const FALLBACK_CATEGORIES: Category[] = [
  { id: "fallback:academias", name: "Academias", slug: "academias", icon: "🏋️" },
  { id: "fallback:advogados", name: "Advogados", slug: "advogados", icon: "⚖️" },
  { id: "fallback:ar-condicionado", name: "Ar Condicionado", slug: "ar-condicionado", icon: "❄️" },
  { id: "fallback:assistencia-tecnica", name: "Assistência Técnica", slug: "assistencia-tecnica", icon: "🛠️" },
  { id: "fallback:barbearias", name: "Barbearias", slug: "barbearias", icon: "💈" },
  { id: "fallback:construcao-reformas", name: "Construção e Reformas", slug: "construcao-reformas", icon: "🏗️" },
  { id: "fallback:contadores", name: "Contadores", slug: "contadores", icon: "🧮" },
  { id: "fallback:dentistas", name: "Dentistas", slug: "dentistas", icon: "🦷" },
  { id: "fallback:eletricistas", name: "Eletricistas", slug: "eletricistas", icon: "⚡" },
  { id: "fallback:encanadores", name: "Encanadores", slug: "encanadores", icon: "🔧" },
  { id: "fallback:imobiliarias", name: "Imobiliárias", slug: "imobiliarias", icon: "🏠" },
  { id: "fallback:informatica", name: "Informática", slug: "informatica", icon: "💻" },
  { id: "fallback:limpeza", name: "Limpeza", slug: "limpeza", icon: "🧹" },
  { id: "fallback:lojas-comercio-local", name: "Lojas e Comércio Local", slug: "lojas-comercio-local", icon: "🏪" },
  { id: "fallback:mecanicos", name: "Mecânicos", slug: "mecanicos", icon: "🚗" },
  { id: "fallback:medicos", name: "Médicos", slug: "medicos", icon: "🩺" },
  { id: "fallback:montadores-de-moveis", name: "Montadores de Móveis", slug: "montadores-de-moveis", icon: "🪑" },
  { id: "fallback:outros-servicos", name: "Outros Serviços", slug: "outros-servicos", icon: "🧰" },
  { id: "fallback:pedreiros", name: "Pedreiros", slug: "pedreiros", icon: "🧱" },
  { id: "fallback:pet-shops", name: "Pet Shops", slug: "pet-shops", icon: "🐾" },
  { id: "fallback:pintores", name: "Pintores", slug: "pintores", icon: "🎨" },
  { id: "fallback:restaurantes", name: "Restaurantes", slug: "restaurantes", icon: "🍽️" },
  { id: "fallback:saloes-beleza", name: "Salões de Beleza", slug: "saloes-beleza", icon: "✂️" },
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function knownCategorySlug(query: string, explicitSlug: string) {
  if (explicitSlug && FALLBACK_CATEGORIES.some((category) => category.slug === explicitSlug)) {
    return explicitSlug;
  }

  const normalizedQuery = normalize(query);
  if (normalizedQuery.length < 3) return "unclassified";

  const match = FALLBACK_CATEGORIES.find((category) => {
    const name = normalize(category.name);
    const slug = normalize(category.slug);
    return (
      name.includes(normalizedQuery) ||
      normalizedQuery.includes(name) ||
      slug.includes(normalizedQuery) ||
      normalizedQuery.includes(slug)
    );
  });

  return match?.slug || "unclassified";
}
