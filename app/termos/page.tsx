import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Regras básicas de uso do Encontre Um.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28">
        <h1 className="mb-6 text-3xl font-bold">Termos de Uso</h1>
        <div className="space-y-6 leading-relaxed text-muted-foreground">
          <p>
            O Encontre Um facilita buscas e conexões entre pessoas, profissionais
            e negócios. A plataforma não garante contratação, disponibilidade,
            qualidade ou resultado de serviços prestados por terceiros.
          </p>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-foreground">Cadastros</h2>
            <p>
              Quem cadastra um negócio deve fornecer informações verdadeiras e ter
              autorização para divulgar os dados enviados. Cadastros podem ser
              revisados, recusados, suspensos ou removidos quando houver inconsistência,
              abuso ou risco para usuários.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-foreground">Uso da plataforma</h2>
            <p>
              Não é permitido usar o serviço para fraude, spam, conteúdo ilegal,
              coleta indevida de dados ou tentativa de comprometer a segurança da
              plataforma e de seus usuários.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-semibold text-foreground">Contatos e negociações</h2>
            <p>
              Negociações e contratações realizadas após o contato são de
              responsabilidade das partes envolvidas. Recomendamos conferir
              informações e condições antes de contratar ou pagar.
            </p>
          </section>
          <p className="text-sm">
            Estes termos podem ser atualizados conforme o serviço evoluir.
            Última atualização: setembro de 2026.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
