import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, MapPin, MessageCircle, Building2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Como funciona",
  description:
    "Entenda como buscar serviços e negócios, registrar uma procura e cadastrar sua atividade no Encontre Um.",
  alternates: { canonical: "/como-funciona" },
};

const steps = [
  {
    icon: Search,
    title: "1. Diga o que você procura",
    text: "Pesquise por um serviço, profissional, comércio ou solução. Você pode usar um termo livre ou começar por uma categoria.",
  },
  {
    icon: MapPin,
    title: "2. Informe a região",
    text: "Cidade ou bairro ajudam a aproximar a procura de opções que possam atender naquela localidade.",
  },
  {
    icon: MessageCircle,
    title: "3. Fale com uma opção ou registre a demanda",
    text: "Quando houver oferta cadastrada, você pode consultar o perfil e entrar em contato. Se ainda não houver, sua procura pode ser registrada para orientar a expansão da plataforma.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Encontrar primeiro. Cadastrar oferta onde existe procura.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            O Encontre Um combina busca local, cadastro de negócios e sinais reais
            de demanda. O objetivo é reduzir buscas sem resposta e facilitar o
            contato quando houver uma opção disponível.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }) => (
            <Card key={title}>
              <CardContent className="p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-14 rounded-2xl border bg-card p-7 sm:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Para profissionais e negócios</h2>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                O cadastro inicial é gratuito e passa por análise antes de ficar
                ativo. Informações reais, contato correto e descrição clara ajudam
                o perfil a ser útil para quem estiver procurando.
              </p>
            </div>
            <Link href="/para-profissionais">
              <Button size="lg" className="gap-2">
                Entender o cadastro
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
