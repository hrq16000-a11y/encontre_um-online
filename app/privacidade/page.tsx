import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como o Encontre Um trata dados usados em buscas, solicitações e cadastros.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28">
        <h1 className="mb-6 text-3xl font-bold">Política de Privacidade</h1>
        <div className="space-y-6 leading-relaxed text-muted-foreground">
          <p>
            O Encontre Um utiliza dados apenas para operar a plataforma, atender
            solicitações, conectar pessoas a negócios e melhorar a experiência.
          </p>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-foreground">Dados que podem ser coletados</h2>
            <p>
              Termos pesquisados, cidade ou bairro informado, dados de conta e
              cadastro de negócio, eventos de uso do site e, quando você pedir
              ajuda para encontrar uma opção, nome e WhatsApp informados por você.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-foreground">Como usamos</h2>
            <p>
              Usamos essas informações para executar sua solicitação, administrar
              cadastros, medir desempenho, prevenir abuso e desenvolver novos
              recursos e oportunidades comerciais relacionadas ao serviço.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-foreground">Compartilhamento</h2>
            <p>
              Dados podem ser processados por fornecedores de infraestrutura e
              ferramentas necessários à operação. Informações de contato fornecidas
              em uma solicitação podem ser usadas para viabilizar atendimento ou
              conexão com opções relevantes.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-foreground">Segurança e retenção</h2>
            <p>
              Adotamos controles técnicos proporcionais ao serviço e mantemos dados
              pelo período necessário para operação, segurança, obrigações aplicáveis
              e melhoria do produto.
            </p>
          </section>
          <p className="text-sm">
            Esta política pode ser atualizada à medida que o produto evoluir.
            Última atualização: setembro de 2026.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
