import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <section aria-labelledby="home-categories-title" className="border-b border-border bg-background px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.15em] text-primary">Explore por interesse</p>
            <h2 id="home-categories-title" className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Explore categorias
            </h2>
            <p className="text-muted-foreground">
              Comece por uma categoria ou pesquise livremente pelo que precisa.
            </p>
          </div>
          <Link
            href="/buscar"
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Ver todas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <li key={category.id} className="min-w-0">
              <Link href={`/buscar?category=${category.slug}`} className="group flex h-full min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:bg-secondary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:transition-colors motion-safe:duration-150">
                <div className="flex items-center justify-between gap-3">
                  <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl">{category.icon || "🔎"}</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-card-foreground">{category.name}</h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{category.description || "Encontre opções nessa categoria."}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
