"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Informática", icon: "💻", description: "Suporte, manutenção e serviços de informática", slug: "informatica" },
  { name: "Assistência Técnica", icon: "🛠️", description: "Assistência técnica e reparos", slug: "assistencia-tecnica" },
  { name: "Eletricistas", icon: "⚡", description: "Serviços elétricos residenciais e comerciais", slug: "eletricistas" },
  { name: "Encanadores", icon: "🔧", description: "Serviços hidráulicos, reparos e instalações", slug: "encanadores" },
  { name: "Ar Condicionado", icon: "❄️", description: "Instalação, manutenção e limpeza", slug: "ar-condicionado" },
  { name: "Montadores de Móveis", icon: "🪑", description: "Montagem, desmontagem e ajustes", slug: "montadores-de-moveis" },
  { name: "Construção e Reformas", icon: "🏗️", description: "Construção, reformas e manutenção", slug: "construcao-reformas" },
  { name: "Mecânicos", icon: "🚗", description: "Oficinas e serviços automotivos", slug: "mecanicos" },
];

export function CategoriesSection() {
  return (
    <section className="bg-background px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Explore por categoria
            </h2>
            <p className="text-muted-foreground">
              Comece pelas necessidades mais comuns e refine sua busca por região.
            </p>
          </div>
          <Link href="/buscar" className="hidden items-center gap-1 font-medium text-primary hover:underline sm:flex">
            Ver todas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.slug} href={`/buscar?category=${category.slug}`}>
              <Card className="group h-full cursor-pointer p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl transition-colors group-hover:bg-primary/20">
                  {category.icon}
                </div>
                <h3 className="mb-1 font-semibold text-foreground transition-colors group-hover:text-primary">
                  {category.name}
                </h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {category.description}
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
