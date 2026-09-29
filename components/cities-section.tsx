"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const cities = [
  { name: "Sao Paulo", state: "Sao Paulo", slug: "sao-paulo" },
  { name: "Rio de Janeiro", state: "Rio de Janeiro", slug: "rio-de-janeiro" },
  { name: "Curitiba", state: "Parana", slug: "curitiba" },
  { name: "Belo Horizonte", state: "Minas Gerais", slug: "belo-horizonte" },
  { name: "Porto Alegre", state: "Rio Grande do Sul", slug: "porto-alegre" },
  { name: "Salvador", state: "Bahia", slug: "salvador" },
];

export function CitiesSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Busque por cidade
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comece sua busca por cidade. Se ainda não houver uma opção cadastrada, registre sua procura.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {cities.map((city) => (
            <Link key={city.slug} href={`/buscar?city=${encodeURIComponent(city.name)}`}>
              <Card className="p-6 h-full hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer group text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {city.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {city.state}
                </p>
              </Card>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <Link href="/buscar">
            <Button variant="outline" className="rounded-xl bg-transparent">
              Abrir busca
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
