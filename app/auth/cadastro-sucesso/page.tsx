import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-primary/5 to-background p-6 md:p-10">
      <div className="w-full max-w-md text-center">
        <Card>
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <Mail className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-2xl">Verifique seu email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Enviamos um link de confirmação para o seu email. Clique no link
              para ativar sua conta e começar a cadastrar seu negócio.
            </p>
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-medium">Não encontrou o email?</p>
              <p className="mt-1 text-muted-foreground">
                Verifique sua pasta de spam ou lixo eletrônico.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-4">
              <Link href="/auth/login">
                <Button className="w-full gap-2">
                  Ir para o Login
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  Voltar para Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
