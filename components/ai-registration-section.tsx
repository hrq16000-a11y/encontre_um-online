"use client";

import { useState, useEffect } from "react";
import { Smartphone, Sparkles, CheckCircle2, Camera, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AIRegistrationSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const steps = [
    { icon: Camera, label: "Tire uma foto", sublabel: "do cartão de visita" },
    { icon: Sparkles, label: "IA escaneia", sublabel: "todas as informações" },
    { icon: Zap, label: "Perfil criado", sublabel: "automaticamente" },
    { icon: CheckCircle2, label: "Você online!", sublabel: "pronto para clientes" },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-foreground text-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/10 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Cadastro com Inteligência Artificial
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
            Do cartão de visita ao perfil digital
            <br />
            <span className="text-primary">em segundos</span>
          </h2>
          <p className="text-lg text-background/70 max-w-2xl mx-auto">
            Sem formulários. Sem digitação. Nossa IA lê seu cartão de visita e cria seu perfil instantaneamente.
          </p>
        </div>

        {/* Visual Demo */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Phone Mockup */}
          <div className="relative flex justify-center">
            <div 
              className="relative w-[280px] h-[560px] sm:w-[320px] sm:h-[640px] bg-background/5 rounded-[3rem] border-4 border-background/20 shadow-2xl overflow-hidden"
              onMouseEnter={() => setIsAnimating(false)}
              onMouseLeave={() => setIsAnimating(true)}
            >
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground rounded-b-2xl z-10" />
              
              {/* Screen Content */}
              <div className="absolute inset-4 top-8 bg-background rounded-2xl overflow-hidden">
                {/* Camera View - Step 0 */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500 ${
                    currentStep === 0 ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  <div className="relative w-full aspect-[3/2] bg-secondary rounded-xl overflow-hidden mb-4">
                    {/* Business Card Mock */}
                    <div className="absolute inset-4 bg-card rounded-lg shadow-lg p-4 border border-border">
                      <div className="h-3 w-24 bg-primary/20 rounded mb-2" />
                      <div className="h-2 w-32 bg-muted rounded mb-4" />
                      <div className="space-y-1.5">
                        <div className="h-2 w-28 bg-muted-foreground/20 rounded" />
                        <div className="h-2 w-24 bg-muted-foreground/20 rounded" />
                        <div className="h-2 w-20 bg-muted-foreground/20 rounded" />
                      </div>
                    </div>
                    {/* Camera corners */}
                    <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-primary" />
                    <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-primary" />
                    <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-primary" />
                    <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground text-foreground">Posicione o cartão</p>
                </div>

                {/* Scanning - Step 1 */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500 ${
                    currentStep === 1 ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  <div className="relative w-full aspect-[3/2] bg-secondary rounded-xl overflow-hidden mb-4">
                    <div className="absolute inset-4 bg-card rounded-lg shadow-lg p-4 border border-border">
                      <div className="h-3 w-24 bg-primary rounded mb-2 animate-pulse" />
                      <div className="h-2 w-32 bg-primary/60 rounded mb-4 animate-pulse" />
                      <div className="space-y-1.5">
                        <div className="h-2 w-28 bg-primary/40 rounded animate-pulse" />
                        <div className="h-2 w-24 bg-primary/40 rounded animate-pulse" />
                        <div className="h-2 w-20 bg-primary/40 rounded animate-pulse" />
                      </div>
                    </div>
                    {/* Scan line */}
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-bounce" style={{ top: '50%' }} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Sparkles className="h-4 w-4 text-primary animate-spin" />
                    Analisando com IA...
                  </div>
                </div>

                {/* Profile Created - Step 2 */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-start p-4 pt-8 transition-all duration-500 ${
                    currentStep === 2 ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold text-primary">JC</span>
                  </div>
                  <h4 className="font-bold text-foreground">João Carlos</h4>
                  <p className="text-sm text-muted-foreground mb-4">Mecânica Express</p>
                  <div className="w-full space-y-2">
                    <div className="flex items-center gap-2 text-xs text-foreground bg-secondary rounded-lg p-2">
                      <CheckCircle2 className="h-3 w-3 text-accent" />
                      (11) 99999-9999
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground bg-secondary rounded-lg p-2">
                      <CheckCircle2 className="h-3 w-3 text-accent" />
                      joao@mecanica.com
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground bg-secondary rounded-lg p-2">
                      <CheckCircle2 className="h-3 w-3 text-accent" />
                      Av. Paulista, 1000
                    </div>
                  </div>
                </div>

                {/* Success - Step 3 */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500 ${
                    currentStep === 3 ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <CheckCircle2 className="h-10 w-10 text-accent-foreground" />
                  </div>
                  <h4 className="font-bold text-lg text-foreground mb-1">Perfil Publicado!</h4>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Seu negócio já está visível para milhares de pessoas
                  </p>
                  <div className="w-full bg-accent text-accent-foreground rounded-xl py-3 text-center font-semibold text-sm">
                    Ver meu perfil
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -right-4 top-1/4 px-4 py-2 bg-background rounded-xl shadow-xl text-foreground text-sm font-medium animate-bounce">
              <Sparkles className="inline h-4 w-4 mr-1 text-primary" />
              IA Ativa
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;
              const isPast = currentStep > index;

              return (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentStep(index);
                    setIsAnimating(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left ${
                    isActive
                      ? "bg-background/10 scale-105"
                      : "hover:bg-background/5"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isPast
                        ? "bg-accent text-accent-foreground"
                        : "bg-background/10 text-background/60"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className={`font-semibold text-lg ${isActive ? "text-background" : "text-background/80"}`}>
                      {step.label}
                    </h4>
                    <p className="text-background/60 text-sm">{step.sublabel}</p>
                  </div>
                  {isPast && (
                    <CheckCircle2 className="ml-auto h-6 w-6 text-accent" />
                  )}
                </button>
              );
            })}

            <Button
              size="lg"
              className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold py-6"
            >
              <Smartphone className="mr-2 h-5 w-5" />
              Cadastrar meu negócio agora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
