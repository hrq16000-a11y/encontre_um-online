"use client";

import { ArrowUpRight, TrendingUp, Star, MapPin } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    name: "Dentistas",
    slug: "dentistas",
    count: 1847,
    topResult: "Dra. Marina Souza",
    rating: 4.9,
    location: "Centro",
    trend: "+12%",
  },
  {
    name: "Mecânicos",
    slug: "mecanicos",
    count: 923,
    topResult: "Auto Mecânica Silva",
    rating: 4.8,
    location: "Zona Norte",
    trend: "+8%",
  },
  {
    name: "Restaurantes",
    slug: "restaurantes",
    count: 2341,
    topResult: "Sabor & Arte",
    rating: 4.7,
    location: "Praça Central",
    trend: "+23%",
  },
  {
    name: "Advogados",
    slug: "advogados",
    count: 567,
    topResult: "Dr. Roberto Lima",
    rating: 4.9,
    location: "Centro Empresarial",
    trend: "+5%",
  },
  {
    name: "Salões de Beleza",
    slug: "saloes-beleza",
    count: 1289,
    topResult: "Studio Hair Design",
    rating: 4.8,
    location: "Shopping Center",
    trend: "+18%",
  },
  {
    name: "Eletricistas",
    slug: "eletricistas",
    count: 445,
    topResult: "Elétrica 24h",
    rating: 4.6,
    location: "Zona Sul",
    trend: "+15%",
  },
];

export function SEOCategoriesSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
            <TrendingUp className="h-4 w-4" />
            Categorias mais buscadas
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 text-balance">
            Encontre o profissional certo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            As categorias mais populares da sua região, ranqueadas por avaliações e relevância
          </p>
        </div>

        {/* Categories Grid - Google Snippet Style */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/categoria/${category.slug}`}
              className="group block p-5 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              {/* Snippet-style content */}
              <div className="space-y-3">
                {/* Top Result */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                    #1
                  </span>
                  <span className="text-sm font-medium text-foreground truncate">
                    {category.topResult}
                  </span>
                </div>

                {/* Rating & Location */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span>{category.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{category.location}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{category.count.toLocaleString()}</span> negócios
                  </span>
                  <span className="text-xs font-medium text-accent">
                    {category.trend} este mês
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO Footer Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground mb-4">
            Outras categorias populares:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Encanadores",
              "Pet Shops",
              "Contadores",
              "Academias",
              "Clínicas",
              "Padarias",
              "Farmácias",
              "Imobiliárias",
            ].map((cat) => (
              <Link
                key={cat}
                href={`/categoria/${cat.toLowerCase()}`}
                className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
