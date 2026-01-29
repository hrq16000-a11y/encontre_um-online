"use client";

import { Search, Users, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Busque",
    description: "Pesquise pelo servico ou profissional que voce precisa na sua cidade",
    icon: Search,
  },
  {
    number: "2",
    title: "Compare",
    description: "Veja avaliacoes, precos e perfis completos dos profissionais",
    icon: Users,
  },
  {
    number: "3",
    title: "Contrate",
    description: "Entre em contato diretamente e contrate com seguranca",
    icon: CheckCircle,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Como Funciona
          </h2>
          <p className="text-muted-foreground">
            Simples, rapido e seguro
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {step.number}. {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
