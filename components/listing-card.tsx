"use client";

import React from "react"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ListingWithDetails } from "@/lib/types/database";
import {
  Phone,
  MessageCircle,
  MapPin,
  Star,
  Clock,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ListingCardProps {
  listing: ListingWithDetails;
  onContact?: (type: "whatsapp" | "phone", listingId: string) => void;
}

function isOpenNow(businessHours: ListingWithDetails["business_hours"]): boolean {
  if (!businessHours) return false;
  
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;
  const now = new Date();
  const dayName = days[now.getDay()];
  const hours = businessHours[dayName];
  
  if (!hours || !hours.open || !hours.close) return false;
  
  const currentTime = now.getHours() * 100 + now.getMinutes();
  const openTime = parseInt(hours.open.replace(":", ""));
  const closeTime = parseInt(hours.close.replace(":", ""));
  
  return currentTime >= openTime && currentTime <= closeTime;
}

export function ListingCard({ listing, onContact }: ListingCardProps) {
  const isOpen = isOpenNow(listing.business_hours);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (listing.whatsapp) {
      const phone = listing.whatsapp.replace(/\D/g, "");
      window.open(`https://wa.me/55${phone}`, "_blank");
      onContact?.("whatsapp", listing.id);
    }
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (listing.phone) {
      window.location.href = `tel:${listing.phone}`;
      onContact?.("phone", listing.id);
    }
  };

  return (
    <Card className="group overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-lg">
      <Link href={`/negocio/${listing.slug}`}>
        <div className="relative h-40 overflow-hidden bg-muted">
          {listing.cover_url ? (
            <Image
              src={listing.cover_url || "/placeholder.svg"}
              alt={listing.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <span className="text-4xl text-primary/30">
                {listing.category?.icon || "🏢"}
              </span>
            </div>
          )}
          {listing.subscription_tier === "premium" && (
            <Badge className="absolute left-2 top-2 bg-amber-500 text-amber-950 hover:bg-amber-500">
              Destaque
            </Badge>
          )}
          {listing.is_verified && (
            <Badge
              variant="secondary"
              className="absolute right-2 top-2 gap-1 bg-primary text-primary-foreground"
            >
              <BadgeCheck className="h-3 w-3" />
              Verificado
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/negocio/${listing.slug}`} className="flex-1">
              <h3 className="line-clamp-1 font-semibold text-foreground transition-colors hover:text-primary">
                {listing.name}
              </h3>
            </Link>
            {listing.average_rating > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">
                  {listing.average_rating.toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  ({listing.review_count})
                </span>
              </div>
            )}
          </div>

          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="text-xs font-normal">
              {listing.category?.name}
            </Badge>
            {isOpen !== null && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className={isOpen ? "text-accent" : "text-destructive"}>
                  {isOpen ? "Aberto" : "Fechado"}
                </span>
              </div>
            )}
          </div>

          {listing.city && (
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">
                {listing.city}
                {listing.state && `, ${listing.state}`}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {listing.whatsapp && (
            <Button
              onClick={handleWhatsAppClick}
              className="flex-1 gap-2 bg-[#25D366] text-white hover:bg-[#20bd5a]"
              size="lg"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </Button>
          )}
          {listing.phone && (
            <Button
              onClick={handlePhoneClick}
              variant={listing.whatsapp ? "outline" : "default"}
              className={
                listing.whatsapp
                  ? "flex-1 gap-2"
                  : "flex-1 gap-2 bg-[#25D366] text-white hover:bg-[#20bd5a]"
              }
              size="lg"
            >
              <Phone className="h-5 w-5" />
              Ligar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
