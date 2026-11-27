import { Search, MapPin, MessageCircle } from "lucide-react";

const steps = [
  { number: "01", title: "Diga o que precisa", description: "Pesquise livremente por um serviço, profissional, comércio ou solução.", icon: Search },
  { number: "02", title: "Informe a região", description: "Use cidade ou bairro para aproximar a procura de quem pode atender.", icon: MapPin },
  { number: "03", title: "Entre em contato", description: "Quando houver opções disponíveis, consulte as informações e fale diretamente.", icon: MessageCircle },
];

export function HowItWorksSection() {
  return (
    <section aria-labelledby="home-how-title" className="bg-secondary/45 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-9 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.15em] text-primary">Da procura ao contato</p>
            <h2 id="home-how-title" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Como funciona</h2>
          </div>
          <p className="max-w-xs leading-relaxed text-muted-foreground sm:text-right">Procura simples, localização e contato direto.</p>
        </div>
        <ol className="grid gap-0 overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.number} className={`min-w-0 p-6 sm:p-7 ${index ? "border-t border-border md:border-t-0 md:border-l" : ""}`}>
                <div className="mb-5 flex items-center justify-between">
                  <span aria-hidden="true" className="font-mono text-xs font-semibold tracking-wider text-primary">{step.number}</span>
                  <span className="rounded-lg bg-primary/10 p-2.5 text-primary"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                </div>
                <h3 className="mb-2 text-xl font-bold tracking-tight text-card-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
