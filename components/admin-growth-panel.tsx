"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Search, Target } from "lucide-react";
import { normalizeBrazilWhatsApp } from "@/lib/utils/phone";

type Demand = {
  id: string;
  query: string;
  city: string | null;
  requester_name: string | null;
  whatsapp: string;
  status: string;
  created_at: string;
};

type SearchEvent = {
  id: string;
  query: string | null;
  city: string | null;
  category_slug: string | null;
  result_count: number;
  created_at: string;
};

export function AdminGrowthPanel() {
  const supabase = useMemo(() => createClient(), []);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [searches, setSearches] = useState<SearchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    const [{ data: demandData }, { data: searchData }] = await Promise.all([
      supabase
        .from("demand_requests")
        .select("id, query, city, requester_name, whatsapp, status, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("search_events")
        .select("id, query, city, category_slug, result_count, created_at")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    setDemands((demandData || []) as Demand[]);
    setSearches((searchData || []) as SearchEvent[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const updateDemand = async (id: string, status: "contacted" | "closed") => {
    await supabase.from("demand_requests").update({ status }).eq("id", id);
    setDemands((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  const newDemands = demands.filter((item) => item.status === "new").length;
  const zeroResultSearches = searches.filter((item) => item.result_count === 0).length;

  const gaps = Object.entries(
    searches
      .filter((item) => item.result_count === 0)
      .reduce<Record<string, number>>((acc, item) => {
        const key = [item.query || item.category_slug || "Busca", item.city]
          .filter(Boolean)
          .join(" · ");
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Demanda e crescimento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Demandas novas</p>
            <p className="text-2xl font-bold">{newDemands}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Buscas recentes</p>
            <p className="text-2xl font-bold">{searches.length}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Buscas sem oferta</p>
            <p className="text-2xl font-bold">{zeroResultSearches}</p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando sinais de demanda...</p>
        ) : (
          <Tabs defaultValue="demands">
            <TabsList>
              <TabsTrigger value="demands">Leads de demanda</TabsTrigger>
              <TabsTrigger value="gaps">Gaps de oferta</TabsTrigger>
              <TabsTrigger value="searches">Buscas</TabsTrigger>
            </TabsList>

            <TabsContent value="demands" className="mt-4 space-y-3">
              {demands.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Nenhuma demanda captada ainda.
                </p>
              ) : (
                demands.map((item) => (
                  <div key={item.id} className="rounded-lg border p-4">
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <strong>{item.query}</strong>
                          <Badge variant={item.status === "new" ? "default" : "secondary"}>
                            {item.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.city || "Região não informada"} · {item.requester_name || "Nome não informado"} ·{" "}
                          {new Date(item.created_at).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`https://wa.me/${normalizeBrazilWhatsApp(item.whatsapp)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button size="sm" className="gap-2">
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp
                          </Button>
                        </a>
                        {item.status === "new" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateDemand(item.id, "contacted")}
                          >
                            Marcar contato
                          </Button>
                        )}
                        {item.status !== "closed" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateDemand(item.id, "closed")}
                          >
                            Fechar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="gaps" className="mt-4">
              {gaps.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Ainda não há buscas sem resultado suficientes para formar um ranking.
                </p>
              ) : (
                <div className="space-y-2">
                  {gaps.map(([label, count]) => (
                    <div key={label} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span>{label}</span>
                      </div>
                      <Badge variant="outline">{count} busca{count > 1 ? "s" : ""}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="searches" className="mt-4">
              <div className="space-y-2">
                {searches.slice(0, 30).map((item) => (
                  <div key={item.id} className="flex flex-col justify-between gap-2 rounded-lg border p-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span>{item.query || item.category_slug || "Busca por filtro"}</span>
                      {item.city && <span className="text-sm text-muted-foreground">· {item.city}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.result_count === 0 ? "destructive" : "secondary"}>
                        {item.result_count} resultado{item.result_count === 1 ? "" : "s"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
