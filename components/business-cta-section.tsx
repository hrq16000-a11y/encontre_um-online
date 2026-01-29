"use client";

import { Camera, ArrowRight, CheckCircle2, Zap, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Zap,
    title: "Cadastro em 30 segundos",
    description: "Tire uma foto do cartão e pronto",
  },
  {
    icon: Globe,
    title: "Apareça no Google",
    description: "Perfil otimizado para SEO local",
  },
  {
    icon: Users,
    title: "Clientes reais",
    description: "Conexões diretas sem intermediários",
  },
];

export function BusinessCTASection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 sm:p-12 lg:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-background rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-background rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground mb-4 text-balance">
                Seu negócio não aparece no Google?
              </h2>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Tire uma foto do seu cartão de visita e apareça agora.
                <br />
                <span className="font-semibold">Se você não está aqui, você não existe.</span>
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-3 gap-6 mb-12">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center p-4"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-bold text-primary-foreground mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-primary-foreground/70">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-background hover:bg-background/90 text-foreground font-bold rounded-xl px-8 py-6 text-lg"
              >
                <Camera className="mr-2 h-5 w-5" />
                Cadastrar meu negócio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-primary-foreground/60 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Grátis para sempre
              </p>
            </div>

            {/* Trust Stats */}
            <div className="mt-12 pt-8 border-t border-primary-foreground/20">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary-foreground">12.8k</p>
                  <p className="text-sm text-primary-foreground/60">Negócios ativos</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-foreground">89k</p>
                  <p className="text-sm text-primary-foreground/60">Conexões/mês</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-foreground">4.8</p>
                  <p className="text-sm text-primary-foreground/60">Avaliação média</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
