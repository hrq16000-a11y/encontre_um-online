"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Phone,
  MessageCircle,
  MapPin,
  Star,
  Clock,
  BadgeCheck,
  Globe,
  Mail,
  Facebook,
  Instagram,
  ExternalLink,
  Share2,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Listing {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  phone_whatsapp?: string | null;
  phone_primary?: string | null;
  whatsapp_business?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  address_full?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  gallery_urls?: string[] | null;
  business_hours?: Record<string, { open: string; close: string }> | null;
  plan_tier: string;
  views_count: number;
  clicks_whatsapp_count: number;
  clicks_phone_count: number;
  category?: {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
  } | null;
}

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  created_at: string;
  user?: {
    id: string;
    full_name?: string | null;
    avatar_url?: string | null;
  } | null;
}

interface BusinessDetailPageProps {
  listing: Listing;
  reviews: Review[];
}

const dayNames: Record<string, string> = {
  monday: "Segunda",
  tuesday: "Terça",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sábado",
  sunday: "Domingo",
};

export function BusinessDetailPage({ listing, reviews }: BusinessDetailPageProps) {
  const [isSharing, setIsSharing] = useState(false);
  const supabase = createClient();

  const whatsappNumber = listing.phone_whatsapp || listing.whatsapp_business;
  const phoneNumber = listing.phone_primary;
  const address = listing.address_full || listing.address;

  const logClick = async (type: "whatsapp_click" | "phone_click" | "website_click") => {
    await supabase.from("analytics_events").insert({
      listing_id: listing.id,
      event_type: type,
    });

    if (type === "whatsapp_click") {
      await supabase.rpc("increment_whatsapp_clicks", { listing_uuid: listing.id });
    }
  };

  const handleWhatsAppClick = () => {
    if (whatsappNumber) {
      const phone = whatsappNumber.replace(/\D/g, "");
      const message = encodeURIComponent(
        `Olá! Vi seu perfil no Encontre Um e gostaria de mais informações.`
      );
      window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
      logClick("whatsapp_click");
    }
  };

  const handlePhoneClick = () => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
      logClick("phone_click");
    }
  };

  const handleWebsiteClick = () => {
    if (listing.website) {
      window.open(listing.website, "_blank");
      logClick("website_click");
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          text: `Confira ${listing.title} no Encontre Um`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copiado!");
      }
    } catch {
      // User cancelled
    }
    setIsSharing(false);
  };

  // Calculate average rating
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 md:h-64 lg:h-80">
          {listing.cover_image_url ? (
            <Image
              src={listing.cover_image_url || "/placeholder.svg"}
              alt={listing.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-8xl opacity-20">
                {listing.category?.icon || "🏢"}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

          {/* Back Button */}
          <Link
            href="/buscar"
            className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-background/80 px-3 py-1.5 text-sm backdrop-blur-sm transition-colors hover:bg-background"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
        </div>

        <div className="mx-auto max-w-5xl px-4">
          {/* Header Info */}
          <div className="relative -mt-16 mb-6 flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
            {/* Logo */}
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-4 border-background bg-card shadow-lg">
              {listing.logo_url ? (
                <Image
                  src={listing.logo_url || "/placeholder.svg"}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 text-4xl">
                  {listing.category?.icon || "🏢"}
                </div>
              )}
            </div>

            {/* Name & Badges */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold md:text-3xl">{listing.title}</h1>
                {listing.plan_tier === "premium" && (
                  <Badge className="gap-1 bg-primary">
                    <BadgeCheck className="h-3 w-3" />
                    Destaque
                  </Badge>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-muted-foreground">
                {listing.category && (
                  <Link
                    href={`/buscar?category=${listing.category.slug}`}
                    className="transition-colors hover:text-primary"
                  >
                    {listing.category.icon} {listing.category.name}
                  </Link>
                )}

                {avgRating > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-foreground">
                        {avgRating.toFixed(1)}
                      </span>
                      <span>({reviews.length} avaliações)</span>
                    </div>
                  </>
                )}

                {listing.city && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {listing.city}, {listing.state}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Share Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              disabled={isSharing}
              className="shrink-0 bg-transparent"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 pb-12 lg:grid-cols-3">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Contact Buttons - Primary CTA */}
              <Card className="border-2 border-[#25D366]/30">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
                  {whatsappNumber && (
                    <Button
                      onClick={handleWhatsAppClick}
                      size="lg"
                      className="flex-1 gap-2 bg-[#25D366] text-lg font-bold text-white hover:bg-[#20bd5a]"
                    >
                      <MessageCircle className="h-6 w-6" />
                      Conversar no WhatsApp
                    </Button>
                  )}
                  {phoneNumber && (
                    <Button
                      onClick={handlePhoneClick}
                      size="lg"
                      variant={whatsappNumber ? "outline" : "default"}
                      className={`flex-1 gap-2 text-lg ${
                        !whatsappNumber
                          ? "bg-[#25D366] font-bold text-white hover:bg-[#20bd5a]"
                          : "bg-transparent"
                      }`}
                    >
                      <Phone className="h-6 w-6" />
                      Ligar
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Description */}
              {listing.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Sobre</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                      {listing.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Gallery */}
              {listing.gallery_urls && listing.gallery_urls.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Fotos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                      {listing.gallery_urls.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square overflow-hidden rounded-lg"
                        >
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${listing.title} - Foto ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Avaliações
                    {avgRating > 0 && (
                      <div className="flex items-center gap-2 text-base font-normal">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{avgRating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({reviews.length})</span>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id}>
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={review.user?.avatar_url || ""} />
                              <AvatarFallback>
                                {review.user?.full_name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {review.user?.full_name || "Usuário"}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.created_at).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                              <div className="mt-1 flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                              {review.comment && (
                                <p className="mt-2 text-muted-foreground">{review.comment}</p>
                              )}
                            </div>
                          </div>
                          <Separator className="mt-4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">
                      Este negócio ainda não tem avaliações.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Business Hours */}
              {listing.business_hours &&
                Object.keys(listing.business_hours).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Horário de Funcionamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(dayNames).map(([key, label]) => {
                          const hours = listing.business_hours?.[key];
                          const today = new Date().getDay();
                          const dayIndex = [
                            "sunday",
                            "monday",
                            "tuesday",
                            "wednesday",
                            "thursday",
                            "friday",
                            "saturday",
                          ].indexOf(key);
                          const isToday = today === dayIndex;

                          return (
                            <div
                              key={key}
                              className={`flex justify-between text-sm ${
                                isToday ? "font-medium text-primary" : ""
                              }`}
                            >
                              <span>{label}</span>
                              <span className="text-muted-foreground">
                                {hours?.open && hours?.close
                                  ? `${hours.open} - ${hours.close}`
                                  : "Fechado"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                      <div>
                        <p>{address}</p>
                        <p className="text-muted-foreground">
                          {listing.city}, {listing.state}
                          {listing.postal_code && ` - ${listing.postal_code}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {listing.email && (
                    <a
                      href={`mailto:${listing.email}`}
                      className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Mail className="h-5 w-5" />
                      {listing.email}
                    </a>
                  )}

                  {listing.website && (
                    <button
                      onClick={handleWebsiteClick}
                      className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Globe className="h-5 w-5" />
                      <span className="truncate">Visitar site</span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  )}
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardContent className="grid grid-cols-2 gap-4 p-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {listing.views_count.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Visualizações</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#25D366]">
                      {listing.clicks_whatsapp_count.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Cliques WhatsApp</p>
                  </div>
                </CardContent>
              </Card>

              {/* Claim Business */}
              <Card className="border-dashed">
                <CardContent className="p-4 text-center">
                  <p className="mb-2 text-sm text-muted-foreground">
                    Este é seu negócio?
                  </p>
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Reivindicar perfil
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky WhatsApp Button (Mobile) */}
      {whatsappNumber && (
        <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 p-4 backdrop-blur-sm md:hidden">
          <Button
            onClick={handleWhatsAppClick}
            size="lg"
            className="w-full gap-2 bg-[#25D366] text-lg font-bold text-white hover:bg-[#20bd5a]"
          >
            <MessageCircle className="h-6 w-6" />
            Conversar no WhatsApp
          </Button>
        </div>
      )}

      <Footer />
    </div>
  );
}
