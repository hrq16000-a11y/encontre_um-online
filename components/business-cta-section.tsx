"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Cadastro inicial gratuito",
  "Perfil sujeito à aprovação",
  "Contato direto com interessados",
];

export function BusinessCTASection() {
  return (
    <section className="bg-primary px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-6 text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
          Presta serviço ou tem um negócio?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-foreground/80">
          Cadastre sua atividade para aparecer quando alguém procurar pelo que
          você oferece na sua região.
        </p>

        <div className="mb-10 flex items-center justify-center">
          <Link href="/cadastrar">
            <Button
              size="lg"
              className="rounded-xl bg-background px-8 py-6 text-lg font-bold text-foreground hover:bg-background/90"
            >
              Cadastrar meu negócio
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-2 text-primary-foreground/80"
            >
              <CheckCircle className="h-5 w-5 text-accent" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
