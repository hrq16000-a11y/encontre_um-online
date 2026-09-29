import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export async function CategoriesSection() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, icon, description, listings_count")
    .order("listings_count", { ascending: false })
    .order("name", { ascending: true })
    .limit(8);

  if (!categories?.length) return null;

  return (
    <section className="bg-background px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Explore categorias
            </h2>
            <p className="text-muted-foreground">
              Comece por uma categoria ou pesquise livremente pelo que precisa.
            </p>
          </div>
          <Link
            href="/buscar"
            className="hidden items-center gap-1 font-medium text-primary hover:underline sm:flex"
          >
            Ver todas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/buscar?category=${category.slug}`}>
              <Card className="group h-full cursor-pointer p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl transition-colors group-hover:bg-primary/20">
                  {category.icon || "🔎"}
                </div>
                <h3 className="mb-1 font-semibold text-foreground transition-colors group-hover:text-primary">
                  {category.name}
                </h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {category.description || "Encontre opções nessa categoria."}
                </p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/buscar">
            <Button variant="outline" className="rounded-xl bg-transparent">
              Ver todas as categorias
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
