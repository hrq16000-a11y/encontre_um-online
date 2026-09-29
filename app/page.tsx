const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Encontre Um",
  url: "https://www.encontreum.online",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.encontreum.online/buscar?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { CategoriesSection } from "@/components/categories-section";
import { CitiesSection } from "@/components/cities-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { BusinessCTASection } from "@/components/business-cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Header />
      <main className="pt-16">
        <HeroSection />
        <CategoriesSection />
        <CitiesSection />
        <HowItWorksSection />
        <BusinessCTASection />
      </main>
      <Footer />
    </>
  );
}
