import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

const benefits = [
  "Cadastro inicial gratuito",
  "Perfil sujeito à aprovação",
  "Contato direto com interessados",
];

export function BusinessCTASection() {
  return (
    <section aria-labelledby="home-business-title" className="bg-background px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-9 overflow-hidden rounded-[1.75rem] bg-[#092b4f] p-7 text-white sm:p-12 lg:grid-cols-[1.12fr_.88fr] lg:gap-16">
        <div className="min-w-0">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[.15em] text-blue-200">Para profissionais e negócios</p>
          <h2 id="home-business-title" className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Presta serviço ou tem um negócio?
          </h2>
          <p className="mt-4 max-w-lg leading-relaxed text-blue-100">
            Cadastre sua atividade para aparecer quando alguém procurar pelo que você oferece na sua região.
          </p>
          <Link href="/cadastrar" className="group mt-7 inline-flex min-h-12 items-center gap-3 rounded-xl bg-white px-5 py-3 font-semibold text-[#092b4f] hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-safe:transition-colors motion-safe:duration-150">
            Cadastrar meu negócio <ArrowRight aria-hidden="true" className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-0.5" />
          </Link>
        </div>
        <ul className="min-w-0 space-y-0 border-t border-white/20 lg:border-t-0 lg:border-l lg:pl-10">
          {benefits.map((benefit, index) => (
            <li key={benefit} className={`flex items-center gap-3 py-4 text-sm leading-relaxed text-blue-50 sm:text-base ${index ? "border-t border-white/15" : ""}`}>
              <CheckCircle aria-hidden="true" className="h-5 w-5 shrink-0 text-blue-200" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
