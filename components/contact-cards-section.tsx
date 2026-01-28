"use client";

import { Phone, MessageCircle, MapPin, Star, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const businesses = [
  {
    name: "Dra. Marina Souza",
    category: "Dentista",
    rating: 4.9,
    reviews: 127,
    address: "Av. Brasil, 450 - Centro",
    hours: "Seg-Sex 8h-18h",
    verified: true,
    initials: "MS",
    phone: "+5511999999999",
  },
  {
    name: "Auto Mecânica Silva",
    category: "Mecânico",
    rating: 4.8,
    reviews: 89,
    address: "Rua das Flores, 1200",
    hours: "Seg-Sáb 7h-19h",
    verified: true,
    initials: "AS",
    phone: "+5511988888888",
  },
  {
    name: "Restaurante Sabor & Arte",
    category: "Restaurante",
    rating: 4.7,
    reviews: 234,
    address: "Praça Central, 15",
    hours: "Ter-Dom 11h-23h",
    verified: true,
    initials: "SA",
    phone: "+5511977777777",
  },
];

export function ContactCardsSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 text-balance">
            Contato direto.
            <br />
            Sem intermediários.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Um toque para ligar. Um toque para WhatsApp. Sem cadastro, sem login, sem fricção.
          </p>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-medium text-secondary-foreground">
            <Shield className="h-4 w-4 text-primary" />
            Sem login necessário
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-medium text-secondary-foreground">
            <Phone className="h-4 w-4 text-primary" />
            Ligação direta
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-sm font-medium text-accent">
            <MessageCircle className="h-4 w-4" />
            WhatsApp instantâneo
          </div>
        </div>

        {/* Business Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {business.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground truncate">
                      {business.name}
                    </h3>
                    {business.verified && (
                      <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{business.category}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-foreground">
                      {business.rating}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({business.reviews} avaliações)
                    </span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{business.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>{business.hours}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-xl h-14 text-base"
                  asChild
                >
                  <a
                    href={`https://wa.me/${business.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-bold rounded-xl h-14 text-base border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary bg-transparent"
                  asChild
                >
                  <a href={`tel:${business.phone}`}>
                    <Phone className="mr-2 h-5 w-5" />
                    Ligar
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl font-semibold border-2 bg-transparent"
          >
            Ver todos os resultados
          </Button>
        </div>
      </div>
    </section>
  );
}
