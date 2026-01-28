"use client";

import React from "react"

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListingCard } from "@/components/listing-card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { ListingWithDetails, Category } from "@/lib/types/database";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface SearchResultsProps {
  listings: ListingWithDetails[];
  categories: Category[];
  total: number;
  currentPage: number;
  totalPages: number;
  query: string;
  categorySlug: string;
  city: string;
}

export function SearchResults({
  listings,
  categories,
  total,
  currentPage,
  totalPages,
  query,
  categorySlug,
  city,
}: SearchResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(`/buscar?${params.toString()}`);
  };

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug === slug) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    params.delete("page");
    router.push(`/buscar?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/buscar");
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/buscar?${params.toString()}`);
  };

  const hasFilters = query || categorySlug || city;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Search Header */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="O que você precisa?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 pr-4 text-lg"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  size="lg"
                >
                  Buscar
                </Button>
              </div>
            </form>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 8).map((cat) => (
                <Badge
                  key={cat.id}
                  variant={categorySlug === cat.slug ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handleCategoryClick(cat.slug)}
                >
                  {cat.icon && <span className="mr-1">{cat.icon}</span>}
                  {cat.name}
                </Badge>
              ))}
            </div>

            {/* Active Filters */}
            {hasFilters && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Filtros ativos:
                </span>
                {query && (
                  <Badge variant="secondary" className="gap-1">
                    Busca: {query}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        setSearchQuery("");
                        const params = new URLSearchParams(
                          searchParams.toString()
                        );
                        params.delete("q");
                        router.push(`/buscar?${params.toString()}`);
                      }}
                    />
                  </Badge>
                )}
                {categorySlug && (
                  <Badge variant="secondary" className="gap-1">
                    Categoria:{" "}
                    {categories.find((c) => c.slug === categorySlug)?.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleCategoryClick(categorySlug)}
                    />
                  </Badge>
                )}
                {city && (
                  <Badge variant="secondary" className="gap-1">
                    Cidade: {city}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Limpar tudo
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground">
              {total > 0 ? (
                <>
                  <span className="font-semibold text-foreground">{total}</span>{" "}
                  {total === 1 ? "resultado encontrado" : "resultados encontrados"}
                </>
              ) : (
                "Nenhum resultado encontrado"
              )}
            </p>
          </div>

          {listings.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="icon"
                          onClick={() => goToPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">
                Nenhum resultado encontrado
              </h2>
              <p className="mb-6 text-muted-foreground">
                Tente buscar com outros termos ou{" "}
                <button
                  onClick={clearFilters}
                  className="text-primary underline"
                >
                  remova os filtros
                </button>
              </p>
              <Link href="/cadastrar">
                <Button size="lg">Cadastre seu negócio</Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
