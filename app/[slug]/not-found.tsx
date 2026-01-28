import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Search, Building2, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-muted p-6">
              <Building2 className="h-16 w-16 text-muted-foreground" />
            </div>
          </div>

          <h1 className="mb-3 text-3xl font-bold">
            Empresa não encontrada
          </h1>

          <p className="mb-8 text-lg text-muted-foreground">
            Esta empresa ainda não está cadastrada no Encontre Um, ou o link
            pode estar incorreto.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/buscar">
              <Button size="lg" className="w-full gap-2 sm:w-auto">
                <Search className="h-5 w-5" />
                Buscar empresas
              </Button>
            </Link>

            <Link href="/cadastrar">
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2 bg-transparent sm:w-auto"
              >
                Cadastrar minha empresa
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            É dono desta empresa?{" "}
            <Link href="/cadastrar" className="text-primary hover:underline">
              Cadastre-se agora
            </Link>{" "}
            e apareça no topo das buscas.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
