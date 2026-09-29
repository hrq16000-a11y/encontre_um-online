"use client";

import { Search, MapPin, MessageCircle } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Diga o que precisa",
    description:
      "Pesquise livremente por um serviço, profissional, comércio ou solução.",
    icon: Search,
  },
  {
    number: "2",
    title: "Informe a região",
    description:
      "Use cidade ou bairro para aproximar a procura de quem pode atender.",
    icon: MapPin,
  },
  {
    number: "3",
    title: "Entre em contato",
    description:
      "Quando houver opções disponíveis, consulte as informações e fale diretamente.",
    icon: MessageCircle,
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-background px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Como funciona
          </h2>
          <p className="text-muted-foreground">
            Procura simples, localização e contato direto.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">
                  {step.number}. {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
