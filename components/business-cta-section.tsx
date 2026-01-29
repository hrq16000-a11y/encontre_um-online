"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Cadastro gratuito",
  "Sem mensalidade",
  "Clientes reais",
];

export function BusinessCTASection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-primary">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground mb-6 text-balance">
          Voce e um Profissional?
        </h2>
        <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          Cadastre-se gratuitamente e comece a receber clientes hoje mesmo. Aumente sua visibilidade e conquiste novos clientes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link href="/cadastrar">
            <Button
              size="lg"
              className="bg-background hover:bg-background/90 text-foreground font-bold rounded-xl px-8 py-6 text-lg"
            >
              Cadastre-se Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/planos">
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-bold rounded-xl px-8 py-6 text-lg bg-transparent"
            >
              Ver Planos
            </Button>
          </Link>
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-primary-foreground/80">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
