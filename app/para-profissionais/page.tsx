import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, BarChart3, Search, MessageCircle, ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Para profissionais e negócios",
  description:
    "Cadastre seu negócio ou atividade no Encontre Um e prepare um perfil para ser encontrado quando houver procura na sua região.",
  alternates: { canonical: "/para-profissionais" },
};

const benefits = [
  {
    icon: Search,
    title: "Perfil pesquisável",
    text: "Depois de aprovado, o negócio pode aparecer nas buscas compatíveis com os dados cadastrados.",
  },
  {
    icon: MessageCircle,
    title: "Contato direto",
    text: "WhatsApp, telefone e site podem ser exibidos para facilitar o contato de quem encontrou o perfil.",
  },
  {
    icon: BarChart3,
    title: "Sinais de interesse",
    text: "O painel acompanha visualizações e contatos registrados pela plataforma para ajudar a entender a procura.",
  },
];

export default function ForProfessionalsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-28">
        <div className="mx-auto max-w-3xl">
          <p className="font-medium text-primary">Para quem presta serviço ou vende localmente</p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Cadastre sua atividade para poder ser encontrada.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            O Encontre Um não promete clientes nem posição no Google. Ele cria uma
            presença pesquisável dentro da plataforma e mede os contatos que
            acontecerem por ela.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/cadastrar">
              <Button size="lg" className="gap-2">
                Cadastrar meu negócio
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/como-funciona">
              <Button size="lg" variant="outline">
                Como funciona
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, text }) => (
            <Card key={title}>
              <CardContent className="p-6">
                <Icon className="mb-4 h-7 w-7 text-primary" />
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-14 rounded-2xl bg-muted/50 p-7 sm:p-10">
          <h2 className="text-2xl font-bold">Antes de enviar o cadastro</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "Use o nome real da atividade ou negócio.",
              "Informe um WhatsApp que realmente recebe clientes.",
              "Escolha a categoria mais próxima do que você oferece.",
              "Descreva apenas serviços e informações que sejam verdadeiros.",
              "Informe cidade e região corretamente.",
              "O cadastro fica pendente até a análise da plataforma.",
            ].map((item) => (
              <div key={item} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
