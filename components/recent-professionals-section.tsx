"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, MessageCircle, MapPin, Star, Crown, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const recentProfessionals = [
  {
    id: "1",
    name: "Eng. Jackson Fabricio Spies",
    specialty: "Projetos Estruturais",
    category: "Engenheiro Civil",
    rating: 5,
    reviews: 89,
    city: "Curitiba",
    state: "PR",
    description: "Engenheiro Civil com CREA 101.522-D/RS, Mestre em Estruturas com quase 40 anos de experiencia. Especialista em projetos estruturais, recuperacao e reforco de estruturas. Mais de 2.500 obras realizadas em diversos estados brasileiros.",
    initials: "J",
    isPremium: true,
    hasImage: true,
    imageUrl: "/placeholder.svg",
    phone: "+5541999999999",
    whatsapp: "+5541999999999",
    slug: "eng-jackson-fabricio-spies",
  },
  {
    id: "2",
    name: "Fabrica de Obras",
    specialty: "Construcao Residencial",
    category: "Construcao",
    rating: 4.9,
    reviews: 67,
    city: "Fazenda Rio Grande",
    state: "PR",
    description: "Construtora especializada em construcao civil, reformas e manutencao predial. Atendimento em Fazenda Rio Grande e regiao metropolitana de Curitiba.",
    initials: "F",
    isPremium: true,
    hasImage: true,
    imageUrl: "/placeholder.svg",
    phone: "+5541988888888",
    whatsapp: "+5541988888888",
    slug: "fabrica-de-obras",
  },
  {
    id: "3",
    name: "Pedro Pinturas",
    specialty: "Pintura Residencial",
    category: "Pintor",
    rating: 4.3,
    reviews: 32,
    city: "Curitiba",
    state: "PR",
    description: "Pintor profissional com mais de 10 anos de experiencia. Pintura residencial e comercial, textura, grafiato. Qualidade garantida!",
    initials: "P",
    isPremium: false,
    hasImage: false,
    phone: "+5541977777777",
    whatsapp: null,
    slug: "pedro-pinturas",
  },
  {
    id: "4",
    name: "Carlos Encanador 24h",
    specialty: "Encanador Residencial",
    category: "Encanador",
    rating: 4.5,
    reviews: 45,
    city: "Rio de Janeiro",
    state: "RJ",
    description: "Encanador profissional com atendimento 24 horas. Desentupimento, vazamentos, instalacoes hidraulicas. Orcamento gratis!",
    initials: "C",
    isPremium: false,
    hasImage: false,
    phone: "+5521966666666",
    whatsapp: "+5521966666666",
    slug: "carlos-encanador-24h",
  },
  {
    id: "5",
    name: "Maria Eletricista",
    specialty: "Eletricista Residencial",
    category: "Eletricista",
    rating: 4.9,
    reviews: 89,
    city: "Sao Paulo",
    state: "SP",
    description: "Eletricista profissional com certificacao NR-10. Instalacoes eletricas, manutencao preventiva e corretiva. Atendimento rapido em toda Sao Paulo.",
    initials: "M",
    isPremium: true,
    hasImage: false,
    phone: "+5511988888888",
    whatsapp: "+5511988888888",
    slug: "maria-eletricista",
  },
  {
    id: "6",
    name: "Joao Silva Mecanica",
    specialty: "Mecanico Automotivo",
    category: "Mecanico",
    rating: 4.8,
    reviews: 127,
    city: "Curitiba",
    state: "PR",
    description: "Mecanica especializada em carros nacionais e importados. Mais de 15 anos de experiencia. Diagnostico computadorizado, troca de oleo, freios, suspensao e muito mais.",
    initials: "J",
    isPremium: true,
    hasImage: false,
    phone: "+5541999999999",
    whatsapp: "+5541999999999",
    slug: "joao-silva-mecanica",
  },
];

export function RecentProfessionalsSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <Badge variant="secondary" className="mb-3 bg-accent/10 text-accent hover:bg-accent/10">
              <Clock className="h-3 w-3 mr-1" />
              Novos Cadastros
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
              Cadastrados Recentemente
            </h2>
            <p className="text-muted-foreground">
              Novos profissionais que acabaram de entrar na plataforma
            </p>
          </div>
          <Link href="/buscar" className="hidden sm:flex items-center gap-1 text-primary hover:underline font-medium">
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Professionals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProfessionals.map((professional) => (
            <Card key={professional.id} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  {professional.hasImage ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted">
                      <Image
                        src={professional.imageUrl || "/placeholder.svg"}
                        alt={professional.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      {professional.initials}
                    </div>
                  )}
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
                  <p className="text-sm text-primary font-medium">{professional.specialty}</p>
                  <p className="text-sm text-muted-foreground">{professional.category}</p>
                </div>
                {professional.isPremium && (
                  <Badge className="bg-amber-500 text-white hover:bg-amber-500 shrink-0">
                    Premium
                  </Badge>
                )}
              </div>

              {/* Rating & Location */}
              <div className="flex items-center gap-3 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">{professional.rating}</span>
                  <span className="text-muted-foreground">({professional.reviews})</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{professional.city}, {professional.state}</span>
                </div>
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
                {professional.whatsapp && (
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
                )}
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

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link href="/buscar">
            <Button variant="outline" size="lg" className="rounded-xl bg-transparent">
              Ver todos os profissionais
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
