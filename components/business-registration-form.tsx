"use client";

import React from "react"

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Category } from "@/lib/types/database";
import { generateSlug, isReservedSlug } from "@/lib/utils/slug";
import {
  Camera,
  Sparkles,
  Upload,
  Check,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Phone,
  MapPin,
  Clock,
  Link as LinkIcon,
} from "lucide-react";

interface BusinessRegistrationFormProps {
  categories: Category[];
  userId: string;
}

interface FormData {
  title: string;
  slug: string;
  category_id: string;
  description: string;
  phone_primary: string;
  phone_whatsapp: string;
  email: string;
  website: string;
  address_full: string;
  city: string;
  state: string;
  postal_code: string;
  business_hours: {
    monday: { open: string; close: string } | null;
    tuesday: { open: string; close: string } | null;
    wednesday: { open: string; close: string } | null;
    thursday: { open: string; close: string } | null;
    friday: { open: string; close: string } | null;
    saturday: { open: string; close: string } | null;
    sunday: { open: string; close: string } | null;
  };
}

const defaultBusinessHours = {
  monday: { open: "08:00", close: "18:00" },
  tuesday: { open: "08:00", close: "18:00" },
  wednesday: { open: "08:00", close: "18:00" },
  thursday: { open: "08:00", close: "18:00" },
  friday: { open: "08:00", close: "18:00" },
  saturday: { open: "08:00", close: "12:00" },
  sunday: null,
};

const dayLabels: Record<string, string> = {
  monday: "Segunda",
  tuesday: "Terça",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sábado",
  sunday: "Domingo",
};

export function BusinessRegistrationForm({
  categories,
  userId,
}: BusinessRegistrationFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<"upload" | "form" | "hours" | "success">(
    "upload"
  );
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    slug: "",
    category_id: "",
    description: "",
    phone_primary: "",
    phone_whatsapp: "",
    email: "",
    website: "",
    address_full: "",
    city: "",
    state: "",
    postal_code: "",
    business_hours: defaultBusinessHours,
  });
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const newSlug = generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  }, [formData.title]);

  // Check slug availability
  useEffect(() => {
    if (!formData.slug) {
      setSlugAvailable(null);
      return;
    }

    if (isReservedSlug(formData.slug)) {
      setSlugAvailable(false);
      return;
    }

    const checkSlug = async () => {
      setCheckingSlug(true);
      const { data } = await supabase
        .from("listings")
        .select("id")
        .eq("slug", formData.slug)
        .maybeSingle();
      setSlugAvailable(!data);
      setCheckingSlug(false);
    };

    const debounce = setTimeout(checkSlug, 500);
    return () => clearTimeout(debounce);
  }, [formData.slug, supabase]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowedTypes.has(file.type)) {
      setError("Use uma imagem JPG, PNG ou WebP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 5 MB.");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Process with OCR
    setIsScanning(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("image", file);

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao processar imagem");
      }

      // Update form with extracted data
      const extracted = result.data;
      const title = extracted.business_name || extracted.owner_name || "";
      setFormData((prev) => ({
        ...prev,
        title: title || prev.title,
        slug: title ? generateSlug(title) : prev.slug,
        description: extracted.description || prev.description,
        phone_primary: extracted.phone || prev.phone_primary,
        phone_whatsapp: extracted.whatsapp || extracted.phone || prev.phone_whatsapp,
        email: extracted.email || prev.email,
        website: extracted.website || prev.website,
        address_full: extracted.address || prev.address_full,
        city: extracted.city || prev.city,
        state: extracted.state || prev.state,
      }));

      setStep("form");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao processar. Tente novamente."
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.category_id) {
      setError("Nome e categoria são obrigatórios");
      return;
    }

    if (!formData.phone_whatsapp) {
      setError("WhatsApp é obrigatório para contato");
      return;
    }

    if (!slugAvailable) {
      setError("Este link já está em uso. Escolha outro.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Use the user-edited slug or generate a unique one
      let finalSlug = formData.slug || generateSlug(formData.title);
      
      // Double-check slug availability
      const { data: existingSlug } = await supabase
        .from("listings")
        .select("id")
        .eq("slug", finalSlug)
        .maybeSingle();
      
      if (existingSlug) {
        // Add random suffix if collision
        finalSlug = `${finalSlug}-${Date.now().toString(36).slice(-4)}`;
      }

      const { error: insertError } = await supabase.from("listings").insert({
        owner_id: userId,
        category_id: formData.category_id,
        title: formData.title,
        slug: finalSlug,
        description: formData.description || null,
        phone_primary: formData.phone_primary || null,
        phone_whatsapp: formData.phone_whatsapp || null,
        email: formData.email || null,
        website: formData.website || null,
        address_full: formData.address_full || null,
        city: formData.city || null,
        state: formData.state || null,
        postal_code: formData.postal_code || null,
        business_hours: formData.business_hours,
        status: "pending",
        plan_tier: "free",
      });

      if (insertError) throw insertError;

      setStep("success");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao cadastrar. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateHours = (
    day: string,
    field: "open" | "close",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      business_hours: {
        ...prev.business_hours,
        [day]: prev.business_hours[day as keyof typeof prev.business_hours]
          ? {
              ...prev.business_hours[day as keyof typeof prev.business_hours],
              [field]: value,
            }
          : { open: "08:00", close: "18:00", [field]: value },
      },
    }));
  };

  const toggleDayOpen = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      business_hours: {
        ...prev.business_hours,
        [day]: prev.business_hours[day as keyof typeof prev.business_hours]
          ? null
          : { open: "08:00", close: "18:00" },
      },
    }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12">
          {/* Progress Steps */}
          <div className="mb-8 flex items-center justify-center gap-2">
            {["upload", "form", "hours"].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    step === s
                      ? "bg-primary text-primary-foreground"
                      : ["upload", "form", "hours"].indexOf(step) > i
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {["upload", "form", "hours"].indexOf(step) > i ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && (
                  <div
                    className={`h-0.5 w-12 ${
                      ["upload", "form", "hours"].indexOf(step) > i
                        ? "bg-accent"
                        : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Upload Step */}
          {step === "upload" && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Camera className="h-6 w-6" />
                  Cadastro Inteligente
                </CardTitle>
                <p className="text-muted-foreground">
                  Tire uma foto do seu cartão de visita e nossa IA preenche tudo
                  automaticamente
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />

                {previewImage && (
                  <div className="relative mx-auto max-w-xs overflow-hidden rounded-lg border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full"
                    />
                    {isScanning && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
                        <Loader2 className="mb-2 h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium">
                          Analisando cartão...
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Sparkles className="h-3 w-3" />
                          IA extraindo informações
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    className="w-full gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isScanning}
                  >
                    <Camera className="h-5 w-5" />
                    Tirar Foto do Cartão
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-2 bg-transparent"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.removeAttribute("capture");
                        fileInputRef.current.click();
                        fileInputRef.current.setAttribute(
                          "capture",
                          "environment"
                        );
                      }
                    }}
                    disabled={isScanning}
                  >
                    <Upload className="h-5 w-5" />
                    Enviar da Galeria
                  </Button>
                </div>

                {error && (
                  <p className="text-center text-sm text-destructive">{error}</p>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      ou
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep("form")}
                >
                  Preencher manualmente
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Form Step */}
          {step === "form" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informações do Negócio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Nome do Negócio *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Ex: Ping Soluções"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="slug" className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      Link do Perfil *
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">encontreum.online/</span>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: generateSlug(e.target.value) })
                        }
                        placeholder="pingsolucoes"
                        className="flex-1"
                      />
                    </div>
                    {formData.slug && (
                      <p className={`text-xs ${checkingSlug ? "text-muted-foreground" : slugAvailable ? "text-green-600" : "text-destructive"}`}>
                        {checkingSlug ? "Verificando..." : slugAvailable ? "Link disponível!" : "Link já em uso. Escolha outro."}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Descreva seu negócio..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 font-medium">
                    <Phone className="h-4 w-4" />
                    Contato
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="phone_whatsapp" className="flex items-center gap-2">
                        WhatsApp *
                        <span className="text-xs text-green-600">(Principal)</span>
                      </Label>
                      <Input
                        id="phone_whatsapp"
                        value={formData.phone_whatsapp}
                        onChange={(e) =>
                          setFormData({ ...formData, phone_whatsapp: e.target.value })
                        }
                        placeholder="5541999999999"
                        className="border-green-200 focus:border-green-500"
                      />
                      <p className="text-xs text-muted-foreground">
                        Formato: 5541999999999 (com código do país)
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone_primary">Telefone Fixo</Label>
                      <Input
                        id="phone_primary"
                        value={formData.phone_primary}
                        onChange={(e) =>
                          setFormData({ ...formData, phone_primary: e.target.value })
                        }
                        placeholder="(41) 3333-3333"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="contato@exemplo.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        placeholder="www.exemplo.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 font-medium">
                    <MapPin className="h-4 w-4" />
                    Endereço
                  </h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="address_full">Endereço Completo</Label>
                      <Input
                        id="address_full"
                        value={formData.address_full}
                        onChange={(e) =>
                          setFormData({ ...formData, address_full: e.target.value })
                        }
                        placeholder="Rua, número, complemento"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="grid gap-2">
                        <Label htmlFor="city">Cidade *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          placeholder="Curitiba"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="state">Estado *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) =>
                            setFormData({ ...formData, state: e.target.value })
                          }
                          placeholder="PR"
                          maxLength={2}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="postal_code">CEP</Label>
                        <Input
                          id="postal_code"
                          value={formData.postal_code}
                          onChange={(e) =>
                            setFormData({ ...formData, postal_code: e.target.value })
                          }
                          placeholder="00000-000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => setStep("upload")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </Button>
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => setStep("hours")}
                  >
                    Continuar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hours Step */}
          {step === "hours" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horário de Funcionamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {Object.entries(dayLabels).map(([key, label]) => {
                    const hours =
                      formData.business_hours[
                        key as keyof typeof formData.business_hours
                      ];
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <Button
                          variant={hours ? "default" : "outline"}
                          size="sm"
                          className="w-24"
                          onClick={() => toggleDayOpen(key)}
                        >
                          {label}
                        </Button>
                        {hours ? (
                          <div className="flex flex-1 items-center gap-2">
                            <Input
                              type="time"
                              value={hours.open}
                              onChange={(e) =>
                                updateHours(key, "open", e.target.value)
                              }
                              className="w-28"
                            />
                            <span className="text-muted-foreground">até</span>
                            <Input
                              type="time"
                              value={hours.close}
                              onChange={(e) =>
                                updateHours(key, "close", e.target.value)
                              }
                              className="w-28"
                            />
                          </div>
                        ) : (
                          <span className="flex-1 text-muted-foreground">
                            Fechado
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => setStep("form")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </Button>
                  <Button
                    className="flex-1 gap-2"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      <>
                        Cadastrar Negócio
                        <Check className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Step */}
          {step === "success" && (
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                  <Check className="h-8 w-8 text-accent" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">
                  Cadastro Enviado!
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Seu negócio foi cadastrado e está em análise. Você receberá
                  uma notificação quando for aprovado.
                </p>
                <div className="flex flex-col gap-3">
                  <Button onClick={() => router.push("/painel")}>
                    Ir para o Painel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep("upload");
                      setFormData({
                        name: "",
                        category_id: "",
                        description: "",
                        phone: "",
                        whatsapp: "",
                        email: "",
                        website: "",
                        address: "",
                        city: "",
                        state: "",
                        zip_code: "",
                        business_hours: defaultBusinessHours,
                      });
                      setPreviewImage(null);
                    }}
                  >
                    Cadastrar Outro Negócio
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
