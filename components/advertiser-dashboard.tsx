"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Profile, ListingWithDetails } from "@/lib/types/database";
import {
  Plus,
  Eye,
  MessageCircle,
  Phone,
  MoreVertical,
  Edit,
  Trash2,
  BarChart3,
  Building2,
  TrendingUp,
  LogOut,
  Settings,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface AdvertiserDashboardProps {
  profile: Profile | null;
  listings: ListingWithDetails[];
  analytics: { event_type: string; count: number }[];
}

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  active: {
    label: "Ativo",
    color: "bg-accent text-accent-foreground",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  pending: {
    label: "Em Análise",
    color: "bg-amber-500 text-white",
    icon: <Clock className="h-4 w-4" />,
  },
  rejected: {
    label: "Rejeitado",
    color: "bg-destructive text-destructive-foreground",
    icon: <XCircle className="h-4 w-4" />,
  },
  suspended: {
    label: "Suspenso",
    color: "bg-muted text-muted-foreground",
    icon: <AlertCircle className="h-4 w-4" />,
  },
};

export function AdvertiserDashboard({
  profile,
  listings,
  analytics,
}: AdvertiserDashboardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/");
  };

  const totalViews = analytics.find((a) => a.event_type === "view")?.count || 0;
  const totalWhatsApp =
    analytics.find((a) => a.event_type === "whatsapp_click")?.count || 0;
  const totalCalls =
    analytics.find((a) => a.event_type === "phone_click")?.count || 0;
  const totalContacts = totalWhatsApp + totalCalls;

  const activeListings = listings.filter((l) => l.status === "active").length;
  const pendingListings = listings.filter((l) => l.status === "pending").length;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-primary">
            Encontre Um
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/cadastrar">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Novo Negócio</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback>
                      {profile?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">
                    {profile?.full_name || "Usuário"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/painel/perfil")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? "Saindo..." : "Sair"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            Olá, {profile?.full_name?.split(" ")[0] || "Anunciante"}
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus negócios e acompanhe suas estatísticas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Negócios Ativos</p>
                <p className="text-2xl font-bold">{activeListings}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <Eye className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Visualizações (30d)
                </p>
                <p className="text-2xl font-bold">{totalViews}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <MessageCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contatos (30d)</p>
                <p className="text-2xl font-bold">{totalContacts}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                <TrendingUp className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Taxa de Conversão
                </p>
                <p className="text-2xl font-bold">
                  {totalViews > 0
                    ? ((totalContacts / totalViews) * 100).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Alert */}
        {pendingListings > 0 && (
          <Card className="mb-8 border-amber-500/50 bg-amber-500/5">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-500" />
                <p>
                  Você tem{" "}
                  <strong>
                    {pendingListings} negócio{pendingListings > 1 ? "s" : ""}
                  </strong>{" "}
                  aguardando aprovação
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Listings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Meus Negócios
            </CardTitle>
            <Link href="/cadastrar">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {listings.length > 0 ? (
              <div className="space-y-4">
                {listings.map((listing) => {
                  const status = statusConfig[listing.status];
                  return (
                    <div
                      key={listing.id}
                      className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {listing.category?.icon || "🏢"}
                          </span>
                          <h3 className="font-semibold">{listing.title}</h3>
                          <Badge className={`gap-1 ${status.color}`}>
                            {status.icon}
                            {status.label}
                          </Badge>
                          {listing.plan_tier !== "free" && (
                            <Badge variant="outline">
                              {listing.plan_tier === "premium"
                                ? "Premium"
                                : "Básico"}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {listing.category?.name}
                          {listing.city && ` • ${listing.city}, ${listing.state}`}
                        </p>
                        {listing.status === "active" && (
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Eye className="h-4 w-4" />
                              {listing.views_count} views
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MessageCircle className="h-4 w-4" />
                              {((listing.clicks_whatsapp_count || 0) + (listing.clicks_phone_count || 0))} contatos
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {listing.status === "active" && (
                          <Link href={`/${listing.slug}`}>
                            <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                              Ver Página
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/painel/editar/${listing.id}`)
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 text-lg font-semibold">
                  Nenhum negócio cadastrado
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Cadastre seu primeiro negócio e envie para aprovação
                </p>
                <Link href="/cadastrar">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Cadastrar Negócio
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats by Listing */}
        {listings.filter((l) => l.status === "active").length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Estatísticas por Negócio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {listings
                  .filter((l) => l.status === "active")
                  .map((listing) => (
                    <div key={listing.id} className="rounded-lg bg-muted/50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="font-medium">{listing.title}</h4>
                        <Badge variant="outline">
                          {listing.plan_tier === "free"
                            ? "Gratuito"
                            : listing.plan_tier}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Visualizações
                          </p>
                          <p className="text-xl font-semibold">
                            {listing.views_count || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            WhatsApp
                          </p>
                          <p className="text-xl font-semibold">
                            {listing.clicks_whatsapp_count || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Ligações
                          </p>
                          <p className="text-xl font-semibold">
                            {listing.clicks_phone_count || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Contatos
                          </p>
                          <p className="text-xl font-semibold">
                            {(listing.clicks_whatsapp_count || 0) + (listing.clicks_phone_count || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upgrade CTA */}
        {listings.some((l) => l.plan_tier === "free") && (
          <Card className="mt-8 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-bold">
                  Destaque seu Negócio
                </h3>
                <p className="text-muted-foreground">
                  Apareça nas primeiras posições das buscas e receba até 5x mais
                  contatos com o plano Premium.
                </p>
              </div>
              <Button size="lg" className="shrink-0">
                Ver Planos
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
