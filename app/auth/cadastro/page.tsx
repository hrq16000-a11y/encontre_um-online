"use client";

import React from "react"

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, Check } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!acceptTerms) {
      setError("Você precisa aceitar os termos de uso");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            phone: phone,
            role: "advertiser",
          },
        },
      });
      if (error) throw error;
      router.push("/auth/cadastro-sucesso");
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message === "User already registered"
            ? "Este email já está cadastrado"
            : error.message
          : "Ocorreu um erro"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "Crie o perfil do seu negócio",
    "Tenha uma página pública quando o cadastro for aprovado",
    "Receba contatos diretos pelo WhatsApp quando houver interessados",
    "Acompanhe visualizações e contatos no painel",
    "Cadastro inicial gratuito",
  ];

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-primary/5 to-background p-6 md:p-10">
      <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-2">
        {/* Benefits */}
        <div className="hidden flex-col justify-center lg:flex">
          <div className="mb-6">
            <Link href="/" className="text-3xl font-bold text-primary">
              Encontre Um
            </Link>
          </div>
          <h1 className="mb-4 text-3xl font-bold">
            Coloque seu negócio no mapa
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Cadastre sua atividade para poder ser encontrada por pessoas que procuram serviços e negócios na sua região.
          </p>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Check className="h-4 w-4" />
                </div>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <div className="mb-2 lg:hidden">
              <Link href="/" className="text-2xl font-bold text-primary">
                Encontre Um
              </Link>
            </div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="h-6 w-6" />
              Cadastre seu Negócio
            </CardTitle>
            <CardDescription>
              Crie sua conta e envie seu negócio para análise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">WhatsApp</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) =>
                      setAcceptTerms(checked === true)
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm leading-tight text-muted-foreground"
                  >
                    Aceito os{" "}
                    <Link href="/termos" className="text-primary underline">
                      Termos de Uso
                    </Link>{" "}
                    e{" "}
                    <Link href="/privacidade" className="text-primary underline">
                      Política de Privacidade
                    </Link>
                  </label>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Criando conta..." : "Criar Conta Grátis"}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              Já tem uma conta?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
