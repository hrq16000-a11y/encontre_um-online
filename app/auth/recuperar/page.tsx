"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const redirectTo =
        `${window.location.origin}/auth/callback?next=/auth/atualizar-senha`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) throw error;

      setMessage(
        "Se existir uma conta com este email, enviaremos um link para redefinir a senha.",
      );
    } catch {
      setError("Não foi possível solicitar a recuperação agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 to-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recuperar senha</CardTitle>
          <CardDescription>
            Informe o email usado na sua conta do Encontre Um.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="seu@email.com"
              />
            </div>

            {message && <p className="text-sm text-primary">{message}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>

            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
