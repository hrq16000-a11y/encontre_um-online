import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

const cities = [
  { name: "São Paulo", query: "Sao Paulo", state: "São Paulo", slug: "sao-paulo" },
  { name: "Rio de Janeiro", query: "Rio de Janeiro", state: "Rio de Janeiro", slug: "rio-de-janeiro" },
  { name: "Curitiba", query: "Curitiba", state: "Paraná", slug: "curitiba" },
  { name: "Belo Horizonte", query: "Belo Horizonte", state: "Minas Gerais", slug: "belo-horizonte" },
  { name: "Porto Alegre", query: "Porto Alegre", state: "Rio Grande do Sul", slug: "porto-alegre" },
  { name: "Salvador", query: "Salvador", state: "Bahia", slug: "salvador" },
];

export function CitiesSection() {
  return (
    <section aria-labelledby="home-cities-title" className="border-b border-border bg-background px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-14">
        <div className="min-w-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.15em] text-primary">Explore por região</p>
          <h2 id="home-cities-title" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Busque por cidade</h2>
          <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">
            Comece sua busca por cidade. Se ainda não houver uma opção cadastrada, registre sua procura.
          </p>
          <Link href="/buscar" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
            Abrir busca <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <ul className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          {cities.map((city) => (
            <li key={city.slug} className="min-w-0">
              <Link href={`/buscar?city=${encodeURIComponent(city.query)}`} className="group flex min-h-20 min-w-0 items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 hover:border-primary/50 hover:bg-secondary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:transition-colors motion-safe:duration-150">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin aria-hidden="true" className="h-5 w-5" />
                </div>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-card-foreground sm:text-base">{city.name}</span>
                  <span className="block text-xs leading-relaxed text-muted-foreground">{city.state}</span>
                </span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
