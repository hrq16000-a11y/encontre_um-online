"use client";

import { useState } from "react";
import { Loader2, MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DemandCaptureCardProps {
  query: string;
  city: string;
}

export function DemandCaptureCard({ query, city }: DemandCaptureCardProps) {
  const [requesterName, setRequesterName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [company, setCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/demand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          city,
          requesterName,
          whatsapp,
          company,
          sourcePath: window.location.pathname + window.location.search,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível registrar agora.");
      }

      setStatus({ type: "success", message: data.message });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Tente novamente em instantes.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status?.type === "success") {
    return (
      <Card className="mx-auto max-w-2xl border-primary/20">
        <CardContent className="py-10 text-center">
          <MessageCircle className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h2 className="mb-2 text-xl font-semibold">Procura registrada</h2>
          <p className="text-muted-foreground">{status.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl border-primary/20">
      <CardHeader className="text-center">
        <Search className="mx-auto mb-2 h-8 w-8 text-primary" />
        <CardTitle>Não achou o que precisava?</CardTitle>
        <p className="text-sm text-muted-foreground">
          Deixe seu WhatsApp. Sua procura vira uma solicitação e ajuda a gente a
          trazer profissionais e negócios para essa necessidade e região.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-3">
          <Input
            value={requesterName}
            onChange={(event) => setRequesterName(event.target.value)}
            placeholder="Seu nome (opcional)"
            maxLength={100}
          />
          <Input
            value={whatsapp}
            onChange={(event) => setWhatsapp(event.target.value)}
            placeholder="WhatsApp com DDD"
            inputMode="tel"
            required
            maxLength={40}
          />
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          {status?.type === "error" && (
            <p className="text-sm text-destructive">{status.message}</p>
          )}
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              "Quero receber opções"
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Usaremos seu contato apenas para tratar esta solicitação e oportunidades relacionadas.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
