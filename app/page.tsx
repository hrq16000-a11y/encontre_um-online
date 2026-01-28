import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { AIRegistrationSection } from "@/components/ai-registration-section";
import { ContactCardsSection } from "@/components/contact-cards-section";
import { SEOCategoriesSection } from "@/components/seo-categories-section";
import { BusinessCTASection } from "@/components/business-cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <HeroSection />
        <AIRegistrationSection />
        <ContactCardsSection />
        <SEOCategoriesSection />
        <BusinessCTASection />
      </main>
      <Footer />
    </>
  );
}
