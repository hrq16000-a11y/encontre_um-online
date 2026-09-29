"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Profile, ListingWithDetails } from "@/lib/types/database";
import {
  Building2,
  Users,
  Star,
  Eye,
  MessageCircle,
  Clock,
  Check,
  X,
  LogOut,
  BarChart3,
  AlertCircle,
  TrendingUp,
  Search,
  ChevronRight,
} from "lucide-react";

interface AdminDashboardProps {
  profile: Profile | null;
  stats: {
    totalListings: number;
    activeListings: number;
    pendingListings: number;
    totalUsers: number;
    totalReviews: number;
    weeklyViews: number;
    weeklyContacts: number;
    weeklySearches: number;
    weeklyZeroResultSearches: number;
    weeklyLeads: number;
    newLeads: number;
  };
  pendingListings: (ListingWithDetails & { owner?: Profile })[];
  recentListings: (ListingWithDetails & { owner?: Profile })[];
}

export function AdminDashboard({
  profile,
  stats,
  pendingListings,
  recentListings,
}: AdminDashboardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    listingId: string;
    listingName: string;
  }>({ open: false, listingId: "", listingName: "" });
  const [rejectReason, setRejectReason] = useState("");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleApprove = async (listingId: string) => {
    setIsProcessing(listingId);
    try {
      await supabase
        .from("listings")
        .update({ status: "active" })
        .eq("id", listingId);
      router.refresh();
    } catch {
      alert("Erro ao aprovar");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectDialog.listingId) return;
    setIsProcessing(rejectDialog.listingId);
    try {
      await supabase
        .from("listings")
        .update({
          status: "rejected",
        })
        .eq("id", rejectDialog.listingId);
      setRejectDialog({ open: false, listingId: "", listingName: "" });
      setRejectReason("");
      router.refresh();
    } catch {
      alert("Erro ao rejeitar");
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-primary">
              Encontre Um
            </Link>
            <Badge variant="secondary">Admin</Badge>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/admin/oportunidades">
              <Button variant="outline" size="sm">
                Oportunidades
              </Button>
            </Link>
            <Link href="/painel">
              <Button variant="outline" size="sm">
                Ver como Anunciante
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground">
            Gerencie a plataforma e aprove novos negócios
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Negócios</p>
                <p className="text-2xl font-bold">{stats.totalListings}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.activeListings} ativos
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{stats.pendingListings}</p>
                <p className="text-xs text-muted-foreground">
                  aguardando aprovação
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10">
                <Search className="h-6 w-6 text-violet-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Buscas (7d)</p>
                <p className="text-2xl font-bold">{stats.weeklySearches}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.weeklyZeroResultSearches} sem resultado
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                <MessageCircle className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Leads (7d)</p>
                <p className="text-2xl font-bold">{stats.weeklyLeads}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.newLeads} aguardando ação
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usuários</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Visualizações (7d)
                </p>
                <p className="text-2xl font-bold">{stats.weeklyViews}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.weeklyContacts} contatos
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Alert */}
        {stats.pendingListings > 0 && (
          <Card className="mb-8 border-amber-500/50 bg-amber-500/5">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <p>
                  <strong>{stats.pendingListings}</strong> negócio
                  {stats.pendingListings > 1 ? "s" : ""} aguardando aprovação
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pendentes
              {stats.pendingListings > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {stats.pendingListings}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="recent" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Recentes
            </TabsTrigger>
          </TabsList>

          {/* Pending Listings */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Negócios Aguardando Aprovação</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingListings.length > 0 ? (
                  <div className="space-y-4">
                    {pendingListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="rounded-lg border p-4"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">
                                {listing.category?.icon || "🏢"}
                              </span>
                              <h3 className="font-semibold">{listing.title}</h3>
                              <Badge variant="outline">
                                {listing.category?.name}
                              </Badge>
                            </div>

                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                              {listing.description || "Sem descrição"}
                            </p>

                            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                              <div>
                                <span className="text-muted-foreground">
                                  Telefone:{" "}
                                </span>
                                {listing.phone_primary || "—"}
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  WhatsApp:{" "}
                                </span>
                                {listing.phone_whatsapp || "—"}
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Local:{" "}
                                </span>
                                {listing.city
                                  ? `${listing.city}, ${listing.state}`
                                  : "—"}
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Cadastrado:{" "}
                                </span>
                                {new Date(listing.created_at).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </div>
                            </div>

                            {/* Owner Info */}
                            <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/50 p-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={listing.owner?.avatar_url || ""}
                                />
                                <AvatarFallback>
                                  {listing.owner?.full_name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-sm">
                                <p className="font-medium">
                                  {listing.owner?.full_name || "Usuário"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 lg:flex-col">
                            <Button
                              className="flex-1 gap-2 lg:flex-none"
                              onClick={() => handleApprove(listing.id)}
                              disabled={isProcessing === listing.id}
                            >
                              <Check className="h-4 w-4" />
                              Aprovar
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground lg:flex-none bg-transparent"
                              onClick={() =>
                                setRejectDialog({
                                  open: true,
                                  listingId: listing.id,
                                  listingName: listing.title,
                                })
                              }
                              disabled={isProcessing === listing.id}
                            >
                              <X className="h-4 w-4" />
                              Rejeitar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Check className="mx-auto mb-4 h-12 w-12 text-accent" />
                    <h3 className="text-lg font-semibold">Tudo em dia!</h3>
                    <p className="text-muted-foreground">
                      Não há negócios pendentes de aprovação.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Listings */}
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Negócios Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {listing.category?.icon || "🏢"}
                        </span>
                        <div>
                          <h4 className="font-medium">{listing.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {listing.category?.name} •{" "}
                            {new Date(listing.created_at).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={
                            listing.status === "active"
                              ? "default"
                              : listing.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {listing.status === "active"
                            ? "Ativo"
                            : listing.status === "pending"
                              ? "Pendente"
                              : "Rejeitado"}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          {listing.views_count}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MessageCircle className="h-4 w-4" />
                          {((listing.clicks_whatsapp_count || 0) + (listing.clicks_phone_count || 0))}
                        </div>
                        {listing.status === "active" && (
                          <Link href={`/${listing.slug}`}>
                            <Button variant="ghost" size="icon">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog.open}
        onOpenChange={(open) =>
          !open && setRejectDialog({ open: false, listingId: "", listingName: "" })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Negócio</DialogTitle>
            <DialogDescription>
              Você está rejeitando "{rejectDialog.listingName}". O anunciante
              será notificado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">
                Motivo da rejeição (opcional)
              </label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ex: Informações incompletas, dados inválidos..."
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setRejectDialog({ open: false, listingId: "", listingName: "" })
              }
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing === rejectDialog.listingId}
            >
              Rejeitar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
