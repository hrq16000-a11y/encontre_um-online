"use client";

import { useState } from "react";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const popularSearches = [
    "Dentistas",
    "Mecânicos",
    "Restaurantes",
    "Advogados",
    "Salão de Beleza",
  ];

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background" />
      
      <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-medium text-primary tracking-tight">
            Encontre Um
          </h2>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-4 text-balance">
          O que você precisa?
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl mx-auto text-balance">
          A conexão mais rápida entre você e quem resolve
        </p>

        {/* Search Bar */}
        <div
          className={`relative w-full transition-all duration-300 ${
            isFocused ? "scale-[1.02]" : ""
          }`}
        >
          <div
            className={`flex items-center bg-card border-2 rounded-2xl shadow-lg transition-all duration-300 ${
              isFocused
                ? "border-primary shadow-xl shadow-primary/10"
                : "border-border hover:border-muted-foreground/30"
            }`}
          >
            <div className="flex items-center pl-5 text-muted-foreground">
              <Search className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <Input
              type="text"
              placeholder="Buscar por serviço ou negócio..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 border-0 bg-transparent text-base sm:text-lg py-5 sm:py-6 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
            />
            <div className="hidden sm:flex items-center gap-2 pr-2">
              <div className="flex items-center gap-1 px-3 py-1.5 bg-secondary rounded-lg text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>São Paulo</span>
              </div>
              <Button size="lg" className="rounded-xl px-6 font-semibold">
                Buscar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Mobile Search Button */}
          <div className="sm:hidden mt-3">
            <Button size="lg" className="w-full rounded-xl font-semibold">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">Populares:</span>
          {popularSearches.map((search) => (
            <button
              key={search}
              onClick={() => setQuery(search)}
              className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors"
            >
              {search}
            </button>
          ))}
        </div>

        {/* Trust Indicator */}
        <p className="mt-12 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">12.847</span> negócios cadastrados •{" "}
          <span className="font-semibold text-foreground">89.234</span> conexões este mês
        </p>
      </div>
    </section>
  );
}
