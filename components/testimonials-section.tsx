"use client";

import { Card } from "@/components/ui/card";

const testimonials = [
  {
    quote: "Encontrei um eletricista excelente em menos de 5 minutos. O servico foi impecavel e o preco justo.",
    name: "Carlos Silva",
    role: "Empresario",
    initials: "C",
  },
  {
    quote: "Uso sempre para encontrar profissionais. As avaliacoes sao confiaveis e ja indiquei para varias amigas.",
    name: "Maria Santos",
    role: "Professora",
    initials: "M",
  },
  {
    quote: "Depois que me cadastrei, meu numero de clientes triplicou. A melhor decisao que tomei para meu negocio.",
    name: "Joao Mecanico",
    role: "Profissional Cadastrado",
    initials: "J",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            O que dizem nossos usuarios
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
              <p className="text-muted-foreground mb-6 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
