"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { Loader2, MessageCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getTrafficAttribution } from "@/lib/attribution/client";
import { confirmedDemand } from "@/lib/search/demand-context";

interface DemandCaptureCardProps {
  query: string;
  city: string;
}

export function DemandCaptureCard({ query, city }: DemandCaptureCardProps) {
  const fieldId = useId();
  const [open, setOpen] = useState(false);
  const [need, setNeed] = useState(query);
  const [region, setRegion] = useState(city);
  const [requesterName, setRequesterName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkAttempt, setCheckAttempt] = useState(0);
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/health", { cache: "no-store", signal: controller.signal })
      .then((response) => {
        if (!controller.signal.aborted) setBackendStatus(response.ok ? "online" : "offline");
      })
      .catch(() => {
        if (!controller.signal.aborted) setBackendStatus("offline");
      });
    return () => controller.abort();
  }, [checkAttempt]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting || backendStatus !== "online" || !consent) return;
    if (need.trim().length < 2 || whatsapp.replace(/\D/g, "").length < 10) {
      setStatus({ type: "error", message: "Informe o que precisa e um WhatsApp válido." });
      return;
    }
    setIsSubmitting(true);
    setStatus(null);

    try {
      const attribution = getTrafficAttribution();
      const response = await fetch("/api/demand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: need.trim(),
          city: region.trim(),
          requesterName,
          whatsapp,
          company,
          sourcePath: window.location.pathname + window.location.search,
          attribution,
        }),
      });

      const data = await response.json();

      if (!confirmedDemand(response.status, data)) {
        throw new Error(typeof data?.error === "string" ? data.error : "Não foi possível confirmar o registro agora.");
      }

      setStatus({ type: "success", message: data.message });
      setRequesterName("");
      setWhatsapp("");
      setCompany("");
      setConsent(false);
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Tente novamente em instantes.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (backendStatus !== "online") {
    return (
      <Card className="mx-auto max-w-2xl border-amber-500/30">
        <CardContent className="py-8 text-center" aria-live="polite">
          <MessageCircle className="mx-auto mb-4 h-10 w-10 text-amber-500" aria-hidden="true" />
          {backendStatus === "checking" ? (
            <>
              <h2 className="mb-2 text-xl font-semibold">Verificando disponibilidade</h2>
              <p className="text-muted-foreground">A busca continua disponível. Aguarde a confirmação do recebimento de solicitações.</p>
            </>
          ) : (
            <>
              <h2 className="mb-2 text-xl font-semibold">Solicitações temporariamente indisponíveis</h2>
              <p className="text-muted-foreground">
                A busca continua disponível, mas não vamos pedir seu WhatsApp enquanto
                o recebimento de solicitações não estiver funcionando normalmente.
              </p>
              <Button type="button" variant="outline" className="mt-4 min-h-11"
                onClick={() => { setBackendStatus("checking"); setCheckAttempt(value => value + 1); }}>
                Verificar novamente
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card className="mx-auto max-w-2xl border-primary/20">
        <CardHeader className="text-center">
          <Search className="mx-auto mb-2 h-8 w-8 text-primary" aria-hidden="true" />
          <CardTitle>{status?.type === "success" ? "Procura registrada" : "Não achou o que precisava?"}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {status?.type === "success" ? status.message : "Registre sua procura sem sair dos resultados. Confira o serviço e a região antes de enviar."}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
            {status?.type !== "success" && (query || city) && (
              <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm break-words">
                {query && <p><strong>Procura:</strong> {query}</p>}
                {city && <p><strong>Região:</strong> {city}</p>}
              </div>
            )}
            <DialogTrigger asChild>
              <Button type="button" className="w-full min-h-12" size="lg">{status?.type === "success" ? "Ver confirmação" : "Registrar minha procura"}</Button>
            </DialogTrigger>
        </CardContent>
      </Card>
      <DialogContent showCloseButton={false} className="max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain motion-reduce:animate-none motion-reduce:transition-none">
        <DialogHeader className="pr-10 text-left">
          <DialogTitle>{status?.type === "success" ? "Procura registrada" : "Revise sua procura"}</DialogTitle>
          <DialogDescription>
            {status?.type === "success" ? status.message : "Mantivemos o contexto da sua busca. Você pode ajustar as informações antes de registrar."}
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <button type="button" aria-label="Fechar solicitação" className="absolute right-3 top-3 grid min-h-11 min-w-11 place-items-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </DialogClose>
        {status?.type === "success" ? (
          <DialogClose asChild><Button type="button" className="min-h-12 w-full">Voltar aos resultados</Button></DialogClose>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor={fieldId + "-need"} className="text-sm font-medium">O que você procura?</label>
              <Input id={fieldId + "-need"} value={need} onChange={event => setNeed(event.target.value)} required minLength={2} maxLength={160} placeholder="Ex.: Eletricista" className="min-h-11" />
            </div>
            <div className="space-y-1">
              <label htmlFor={fieldId + "-region"} className="text-sm font-medium">Cidade ou bairro (opcional)</label>
              <Input id={fieldId + "-region"} value={region} onChange={event => setRegion(event.target.value)} maxLength={120} placeholder="Informe sua região" className="min-h-11" />
            </div>
            <div className="space-y-1">
              <label htmlFor={fieldId + "-name"} className="text-sm font-medium">Seu nome (opcional)</label>
              <Input id={fieldId + "-name"} value={requesterName} onChange={event => setRequesterName(event.target.value)} autoComplete="name" maxLength={100} className="min-h-11" />
            </div>
            <div className="space-y-1">
              <label htmlFor={fieldId + "-whatsapp"} className="text-sm font-medium">WhatsApp com DDD</label>
              <Input id={fieldId + "-whatsapp"} value={whatsapp} onChange={event => setWhatsapp(event.target.value)} type="tel" inputMode="tel" autoComplete="tel" required maxLength={40} className="min-h-11" />
            </div>
            <input value={company} onChange={event => setCompany(event.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <label className="flex min-h-11 items-start gap-2 text-xs leading-5 text-muted-foreground">
              <input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} required className="mt-1" />
              <span>Autorizo o uso do meu contato para tratar esta solicitação, conforme a <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="font-medium underline">Política de Privacidade</a>.</span>
            </label>
            {status?.type === "error" && <p role="alert" className="text-sm text-destructive">{status.message}</p>}
            <Button type="submit" className="w-full min-h-12" size="lg" disabled={isSubmitting || !consent}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />Registrando...</> : "Quero receber opções"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
