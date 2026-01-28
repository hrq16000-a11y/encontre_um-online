"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);

  async function createAdmin() {
    setStatus("loading");
    try {
      const response = await fetch("/api/setup-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: "setup-encontreum-admin-2024" }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setCredentials(data.credentials);
      } else {
        setStatus("error");
        setMessage(data.error || "Erro desconhecido");
      }
    } catch {
      setStatus("error");
      setMessage("Erro de conexão");
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Setup Encontre Um</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === "idle" && (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Clique no botão abaixo para criar o usuário administrador.
              </p>
              <Button onClick={createAdmin} className="w-full">
                Criar Admin
              </Button>
            </div>
          )}

          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Criando administrador...</p>
            </div>
          )}

          {status === "success" && credentials && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{message}</span>
              </div>
              
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium">Credenciais do Admin:</p>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <code className="bg-background px-2 py-1 rounded">{credentials.email}</code>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Senha:</span>{" "}
                    <code className="bg-background px-2 py-1 rounded">{credentials.password}</code>
                  </p>
                </div>
              </div>

              <Button asChild className="w-full">
                <a href="/auth/login">Ir para Login</a>
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">{message}</span>
              </div>
              <Button onClick={createAdmin} variant="outline" className="w-full bg-transparent">
                Tentar novamente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
