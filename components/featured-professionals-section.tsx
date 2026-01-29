"use client";

import Link from "next/link";
import { ArrowRight, Phone, MessageCircle, MapPin, Star, BadgeCheck, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const featuredProfessionals = [
  {
    id: "1",
    name: "Joao Silva Mecanica",
    specialty: "Mecanico Automotivo",
    rating: 4.8,
    reviews: 127,
    city: "Curitiba",
    state: "PR",
    description: "Mecanica especializada em carros nacionais e importados. Mais de 15 anos de experiencia. Diagnostico computadorizado, troca de oleo, freios, suspensao e muito mais.",
    initials: "J",
    isPremium: true,
    phone: "+5541999999999",
    whatsapp: "+5541999999999",
    slug: "joao-silva-mecanica",
  },
  {
    id: "2",
    name: "Maria Eletricista",
    specialty: "Eletricista Residencial",
    rating: 4.9,
    reviews: 89,
    city: "Sao Paulo",
    state: "SP",
    description: "Eletricista profissional com certificacao NR-10. Instalacoes eletricas, manutencao preventiva e corretiva. Atendimento rapido em toda Sao Paulo.",
    initials: "M",
    isPremium: true,
    phone: "+5511988888888",
    whatsapp: "+5511988888888",
    slug: "maria-eletricista",
  },
  {
    id: "3",
    name: "Dra. Ana Paula Advocacia",
    specialty: "Advogado Trabalhista",
    rating: 4.9,
    reviews: 203,
    city: "Belo Horizonte",
    state: "MG",
    description: "Advogada especialista em direito trabalhista. Atendimento personalizado, consulta online disponivel. OAB/MG 123456.",
    initials: "D",
    isPremium: true,
    phone: "+5531977777777",
    whatsapp: "+5531977777777",
    slug: "dra-ana-paula-advocacia",
  },
];

export function FeaturedProfessionalsSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary hover:bg-primary/10">
              <BadgeCheck className="h-3 w-3 mr-1" />
              Profissionais Verificados
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
              Profissionais em Destaque
            </h2>
            <p className="text-muted-foreground">
              Os melhores profissionais recomendados pela nossa plataforma
            </p>
          </div>
          <Link href="/buscar" className="hidden sm:flex items-center gap-1 text-primary hover:underline font-medium">
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Professionals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProfessionals.map((professional) => (
            <Card key={professional.id} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    {professional.initials}
                  </div>
                  {professional.isPremium && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                      <Crown className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/${professional.slug}`}>
                    <h3 className="font-bold text-foreground truncate hover:text-primary transition-colors">
                      {professional.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">{professional.specialty}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-foreground">{professional.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({professional.reviews})</span>
                  </div>
                </div>
                {professional.isPremium && (
                  <Badge className="bg-amber-500 text-white hover:bg-amber-500 shrink-0">
                    Premium
                  </Badge>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>{professional.city}, {professional.state}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                {professional.description}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  asChild
                >
                  <a href={`tel:${professional.phone}`}>
                    <Phone className="h-4 w-4 mr-1" />
                    Ligar
                  </a>
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white"
                  asChild
                >
                  <a href={`https://wa.me/${professional.whatsapp?.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    WhatsApp
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  asChild
                >
                  <Link href={`/${professional.slug}`}>
                    Ver perfil
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
