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
