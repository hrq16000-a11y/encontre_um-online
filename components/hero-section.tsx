"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const router = useRouter();

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (city.trim()) params.set("city", city.trim());

    router.push(params.size ? `/buscar?${params.toString()}` : "/buscar");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary),0.1),transparent_50%)]" />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Encontre Um
          </span>

          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            O que você precisa
            <span className="text-primary"> encontrar hoje?</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
            Pesquise por um serviço, profissional, comércio ou solução e informe
            onde você precisa de atendimento.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mx-auto w-full max-w-4xl">
          <div className="grid gap-3 rounded-2xl border border-border bg-card p-3 shadow-lg sm:grid-cols-[1.4fr_1fr_auto]">
            <label className="relative">
              <span className="sr-only">O que você procura?</span>
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ex.: eletricista, informática, manicure..."
                className="h-12 border-0 bg-secondary/50 pl-10 text-base shadow-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </label>

            <label className="relative">
              <span className="sr-only">Cidade ou bairro</span>
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Cidade ou bairro"
                className="h-12 border-0 bg-secondary/50 pl-10 text-base shadow-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </label>

            <Button type="submit" size="lg" className="h-12 rounded-xl px-8 font-semibold">
              Buscar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>

        <div className="mt-6 flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground sm:flex-row">
          <span>Tem um negócio ou presta serviços?</span>
          <Link href="/cadastrar" className="font-semibold text-primary hover:underline">
            Cadastre-se para ser encontrado
          </Link>
        </div>
      </div>
    </section>
  );
}
