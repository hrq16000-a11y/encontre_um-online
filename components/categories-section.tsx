"use client";

import Link from "next/link";
import { ArrowRight, Wrench, Zap, Droplet, Scale, Stethoscope, Calculator, HardHat, Paintbrush } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Mecanico", icon: Wrench, description: "Servicos automotivos e mecanicos", slug: "mecanico" },
  { name: "Eletricista", icon: Zap, description: "Servicos eletricos residenciais e comerciais", slug: "eletricista" },
  { name: "Encanador", icon: Droplet, description: "Servicos hidraulicos e encanamento", slug: "encanador" },
  { name: "Advogado", icon: Scale, description: "Servicos juridicos e advocacia", slug: "advogado" },
  { name: "Dentista", icon: Stethoscope, description: "Servicos odontologicos", slug: "dentista" },
  { name: "Contador", icon: Calculator, description: "Servicos contabeis e financeiros", slug: "contador" },
  { name: "Pedreiro", icon: HardHat, description: "Construcao e reformas", slug: "pedreiro" },
  { name: "Pintor", icon: Paintbrush, description: "Servicos de pintura", slug: "pintor" },
];

export function CategoriesSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
              Categorias Populares
            </h2>
            <p className="text-muted-foreground">
              Encontre o profissional ideal para sua necessidade
            </p>
          </div>
          <Link href="/buscar" className="hidden sm:flex items-center gap-1 text-primary hover:underline font-medium">
            Ver todas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.slug} href={`/buscar?categoria=${category.slug}`}>
                <Card className="p-6 h-full hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Mobile CTA */}
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
