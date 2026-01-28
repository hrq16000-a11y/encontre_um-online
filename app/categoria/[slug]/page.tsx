import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) {
    return {
      title: "Categoria não encontrada | Encontre Um",
    };
  }

  return {
    title: `${category.name} - Melhores Profissionais | Encontre Um`,
    description:
      category.description ||
      `Encontre os melhores profissionais de ${category.name}. Contato direto via WhatsApp, sem cadastro.`,
    openGraph: {
      title: `${category.name} | Encontre Um`,
      description: `Os melhores profissionais de ${category.name} com contato direto.`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) {
    notFound();
  }

  // Redirect to search with category filter
  redirect(`/buscar?category=${slug}`);
}
