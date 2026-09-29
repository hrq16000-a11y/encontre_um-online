import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, MapPin, MessageCircle, TrendingUp } from "lucide-react";
import { DemandStatusActions } from "@/components/demand-status-actions";

export const metadata: Metadata = {
  title: "Oportunidades | Admin",
  robots: { index: false, follow: false },
};

type SearchEvent = {
  query: string | null;
  city: string | null;
  category_slug: string | null;
  result_count: number;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
};

type DemandRequest = {
  id: string;
  query: string;
  city: string | null;
  requester_name: string | null;
  whatsapp: string;
  status: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
};

type Opportunity = {
  label: string;
  city: string;
  zeroResultSearches: number;
  leads: number;
  score: number;
};

function normalizeSignal(value: string | null | undefined) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function buildOpportunities(searches: SearchEvent[], demands: DemandRequest[]) {
  const map = new Map<string, Opportunity>();

  for (const row of searches) {
    if (row.result_count !== 0) continue;
    const label = row.query?.trim() || row.category_slug?.trim() || "";
    if (!label) continue;

    const city = row.city?.trim() || "";
    const key = `${normalizeSignal(label)}|${normalizeSignal(city)}`;
    const current = map.get(key) || {
      label,
      city,
      zeroResultSearches: 0,
      leads: 0,
      score: 0,
    };
    current.zeroResultSearches += 1;
    map.set(key, current);
  }

  for (const demand of demands) {
    const label = demand.query.trim();
    if (!label) continue;

    const city = demand.city?.trim() || "";
    const key = `${normalizeSignal(label)}|${normalizeSignal(city)}`;
    const current = map.get(key) || {
      label,
      city,
      zeroResultSearches: 0,
      leads: 0,
      score: 0,
    };
    current.leads += 1;
    map.set(key, current);
  }

  return [...map.values()]
    .map((item) => ({
      ...item,
      score: item.zeroResultSearches * 2 + item.leads * 5,
    }))
    .sort((a, b) => b.score - a.score || b.leads - a.leads)
    .slice(0, 12);
}

function topValues(
  rows: SearchEvent[],
  getValue: (row: SearchEvent) => string | null,
) {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const value = getValue(row)?.trim();
    if (!value) continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
}

export default async function OpportunitiesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/painel");

  const [{ data: demandRows }, { data: searchRows }] = await Promise.all([
    supabase
      .from("demand_requests")
      .select("id, query, city, requester_name, whatsapp, status, utm_source, utm_medium, utm_campaign, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("search_events")
      .select("query, city, category_slug, result_count, utm_source, utm_medium, utm_campaign, created_at")
      .order("created_at", { ascending: false })
      .limit(250),
  ]);

  const demands = (demandRows || []) as DemandRequest[];
  const searches = (searchRows || []) as SearchEvent[];
  const zeroResultSearches = searches.filter((row) => row.result_count === 0);
  const topQueries = topValues(searches, (row) => row.query);
  const topCities = topValues(searches, (row) => row.city);
  const topSources = topValues(searches, (row) => row.utm_source || "direto/sem UTM");
  const newDemands = demands.filter((row) => row.status === "new");
  const opportunities = buildOpportunities(searches, demands);

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Oportunidades de crescimento</h1>
            <p className="mt-1 text-muted-foreground">
              Sinais reais de procura para decidir onde cadastrar oferta, criar páginas e monetizar.
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao admin
            </Button>
          </Link>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<Search className="h-5 w-5" />}
            label="Buscas registradas"
            value={searches.length}
          />
          <MetricCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Buscas sem resultado"
            value={zeroResultSearches.length}
          />
          <MetricCard
            icon={<MessageCircle className="h-5 w-5" />}
            label="Leads capturados"
            value={demands.length}
          />
          <MetricCard
            icon={<MapPin className="h-5 w-5" />}
            label="Leads novos"
            value={newDemands.length}
          />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Prioridades sugeridas pelos dados</CardTitle>
          </CardHeader>
          <CardContent>
            {opportunities.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {opportunities.map((item, index) => (
                  <div
                    key={`${item.label}-${item.city}-${index}`}
                    className="flex items-center justify-between gap-4 rounded-lg border p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.city || "Local não informado"} • {item.zeroResultSearches} busca
                        {item.zeroResultSearches === 1 ? "" : "s"} sem resultado • {item.leads} lead
                        {item.leads === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        score
                      </p>
                      <p className="text-2xl font-bold text-primary">{item.score}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Ainda não há sinais suficientes para priorização." />
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              Score determinístico: 2 pontos por busca sem resultado + 5 pontos por lead
              com contato. Serve para ordenar ações; não representa receita prevista.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Termos mais procurados</CardTitle>
            </CardHeader>
            <CardContent>
              {topQueries.length ? (
                <div className="space-y-3">
                  {topQueries.map(([value, count]) => (
                    <div key={value} className="flex items-center justify-between gap-3">
                      <span className="truncate">{value}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState text="Ainda não há buscas suficientes." />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Origem das buscas</CardTitle>
            </CardHeader>
            <CardContent>
              {topSources.length ? (
                <div className="space-y-3">
                  {topSources.map(([value, count]) => (
                    <div key={value} className="flex items-center justify-between gap-3">
                      <span className="truncate">{value}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState text="Ainda não há origem suficiente." />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cidades com procura</CardTitle>
            </CardHeader>
            <CardContent>
              {topCities.length ? (
                <div className="space-y-3">
                  {topCities.map(([value, count]) => (
                    <div key={value} className="flex items-center justify-between gap-3">
                      <span className="truncate">{value}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState text="Ainda não há cidades suficientes." />
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Demandas com contato</CardTitle>
          </CardHeader>
          <CardContent>
            {demands.length ? (
              <div className="divide-y">
                {demands.slice(0, 30).map((demand) => {
                  const digits = demand.whatsapp.replace(/\D/g, "");
                  const waNumber =
                    digits.startsWith("55") ? digits : `55${digits}`;

                  return (
                    <div
                      key={demand.id}
                      className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{demand.query}</p>
                          <Badge variant={demand.status === "new" ? "default" : "secondary"}>
                            {demand.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {demand.city || "Local não informado"}
                          {demand.requester_name ? ` • ${demand.requester_name}` : ""}
                          {demand.utm_source ? ` • origem: ${demand.utm_source}` : ""}
                          {" • "}
                          {new Date(demand.created_at).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`https://wa.me/${waNumber}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button className="gap-2">
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp
                          </Button>
                        </a>
                        <DemandStatusActions
                          demandId={demand.id}
                          currentStatus={demand.status}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState text="Nenhum lead com contato capturado ainda." />
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Buscas recentes sem resultado</CardTitle>
          </CardHeader>
          <CardContent>
            {zeroResultSearches.length ? (
              <div className="divide-y">
                {zeroResultSearches.slice(0, 30).map((row, index) => (
                  <div
                    key={`${row.created_at}-${index}`}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div>
                      <p className="font-medium">
                        {row.query || row.category_slug || "Busca sem termo"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {row.city || "Sem cidade"} •{" "}
                        {new Date(row.created_at).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    {row.category_slug && (
                      <Badge variant="outline">{row.category_slug}</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Nenhuma busca sem resultado registrada ainda." />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="py-8 text-center text-muted-foreground">{text}</p>;
}
