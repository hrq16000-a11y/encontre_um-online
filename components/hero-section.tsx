"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";

const examples = ["Eletricista", "Informática", "Manicure"] as const;

export function HeroSection() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const router = useRouter();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (city.trim()) params.set("city", city.trim());

    router.push(params.size ? `/buscar?${params.toString()}` : "/buscar");
  };

  return (
    <section aria-labelledby="home-search-title" className="relative isolate border-b border-border bg-secondary/50 px-4 py-8 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_12%_0%,color-mix(in_oklch,var(--primary)_9%,transparent),transparent_60%)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-6 sm:gap-9 lg:grid-cols-[1.04fr_1fr] lg:gap-16">
        <div className="min-w-0">
          <div className="mb-5 flex items-center gap-3 text-xs font-semibold tracking-[.15em] text-primary uppercase">
            <span aria-hidden="true" className="h-px w-8 bg-primary" />
            Encontre Um · Busca local
          </div>
          <h1 id="home-search-title" className="max-w-xl text-[clamp(2.35rem,6.2vw,5rem)] leading-[1.04] font-bold tracking-[-.055em] text-foreground">
            O que você precisa <span className="text-primary">encontrar hoje?</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Pesquise por um serviço, profissional, comércio ou solução e informe onde você precisa de atendimento.
          </p>
          <div className="mt-6 hidden max-w-lg border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground lg:block">
            Tem um negócio ou presta serviços?{" "}
            <Link href="/cadastrar" className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
              Cadastre-se para ser encontrado
            </Link>
          </div>
        </div>

        <div className="relative min-w-0 rounded-[1.75rem] border border-border bg-card p-4 shadow-[0_18px_60px_-35px_rgba(10,42,86,0.32)] sm:p-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-primary">Busca personalizada</p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-card-foreground sm:text-[1.7rem]">Comece por aqui.</h2>
            </div>
            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="h-5 w-5" />
            </span>
          </div>
          <form action="/buscar" method="get" onSubmit={handleSearch} aria-label="Buscar serviços, profissionais e negócios" className="space-y-3 sm:space-y-4">
            <label className="block min-w-0" htmlFor="home-query">
              <span className="mb-2 block text-sm font-semibold text-card-foreground"><span aria-hidden="true" className="mr-2 font-mono text-xs text-primary">01</span>O que você procura?</span>
              <span className="relative block">
                <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input id="home-query" name="q" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex.: eletricista, informática..." className="h-14 w-full min-w-0 rounded-xl border border-border bg-background px-4 pl-11 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/35 motion-safe:transition-[border-color,box-shadow] motion-safe:duration-150" />
              </span>
            </label>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Exemplos para preencher a busca">
              <span className="text-xs text-muted-foreground">Exemplos:</span>
              {examples.map((example) => {
                const selected = query.trim().toLocaleLowerCase("pt-BR") === example.toLocaleLowerCase("pt-BR");
                return (
                  <button key={example} type="button" aria-pressed={selected} onClick={() => setQuery(example)} className={`min-h-11 rounded-full border px-3 py-1.5 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:transition-colors motion-safe:duration-150 ${selected ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:border-primary/50 hover:text-primary"}`}>
                    {example}
                  </button>
                );
              })}
            </div>
            <label className="block min-w-0" htmlFor="home-city">
              <span className="mb-2 block text-sm font-semibold text-card-foreground"><span aria-hidden="true" className="mr-2 font-mono text-xs text-primary">02</span>Cidade ou bairro</span>
              <span className="relative block">
                <MapPin aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input id="home-city" name="city" value={city} onChange={(event) => setCity(event.target.value)} placeholder="Informe sua região" className="h-14 w-full min-w-0 rounded-xl border border-border bg-background px-4 pl-11 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/35 motion-safe:transition-[border-color,box-shadow] motion-safe:duration-150" />
              </span>
            </label>
            <button type="submit" className="group flex min-h-14 w-full items-center justify-between gap-3 rounded-xl bg-primary px-5 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-safe:transition-[background-color,transform] motion-safe:duration-150 motion-safe:active:scale-[.985]">
              Buscar <ArrowRight aria-hidden="true" className="h-5 w-5 motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-0.5" />
            </button>
            <p className="text-xs leading-relaxed text-muted-foreground">Se ainda não houver uma opção cadastrada, você poderá registrar sua procura.</p>
          </form>
        </div>

        <p className="text-center text-sm leading-relaxed text-muted-foreground lg:hidden">
          Tem um negócio ou presta serviços?{" "}
          <Link href="/cadastrar" className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
            Cadastre-se para ser encontrado
          </Link>
        </p>
      </div>
    </section>
  );
}
