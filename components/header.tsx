"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "Buscar", href: "/buscar" },
    { label: "Categorias", href: "/buscar" },
    { label: "Para empresas", href: "/cadastrar" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">Encontre Um</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/buscar">
              <Button variant="ghost" size="sm" className="rounded-lg">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                Entrar
              </Button>
            </Link>
            <Link href="/cadastrar">
              <Button size="sm" className="rounded-lg font-semibold">
                Cadastrar negócio
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-base font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-3">
              <Link href="/buscar" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full rounded-lg bg-transparent"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </Link>
              <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full rounded-lg bg-transparent"
                >
                  Entrar
                </Button>
              </Link>
              <Link href="/cadastrar" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full rounded-lg font-semibold">
                  Cadastrar negócio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
