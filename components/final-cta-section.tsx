"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const professions = [
  "Mecanico",
  "Eletricista",
  "Encanador",
  "Advogado",
  "Dentista",
  "Contador",
  "Pedreiro",
  "Pintor",
  "Engenheiro Civil",
  "Construcao",
];

const cities = [
  "Sao Paulo,SP",
  "Rio de Janeiro,RJ",
  "Curitiba,PR",
  "Belo Horizonte,MG",
  "Porto Alegre,RS",
  "Salvador,BA",
  "Brasilia,DF",
  "Fortaleza,CE",
  "Recife,PE",
  "Manaus,AM",
  "Fazenda Rio Grande,PR",
  "Araucaria,PR",
  "Sao Jose dos Pinhais,PR",
];

export function FinalCTASection() {
  const [profession, setProfession] = useState("");
  const [city, setCity] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (profession) params.set("q", profession);
    if (city) params.set("cidade", city.split(",")[0]);
    router.push(`/buscar?${params.toString()}`);
  };

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 text-balance">
          Pronto para encontrar o profissional ideal?
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Milhares de profissionais verificados esperando para atender voce
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 p-3 bg-card border border-border rounded-2xl shadow-lg">
            {/* Profession Select */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-secondary/50 border-0 rounded-xl text-foreground focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="">O que voce procura?</option>
                {professions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* City Select */}
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-secondary/50 border-0 rounded-xl text-foreground focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="">Onde?</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <Button type="submit" size="lg" className="h-12 px-8 rounded-xl font-semibold">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
