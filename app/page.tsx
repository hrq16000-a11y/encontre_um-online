import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { CategoriesSection } from "@/components/categories-section";
import { FeaturedProfessionalsSection } from "@/components/featured-professionals-section";
import { RecentProfessionalsSection } from "@/components/recent-professionals-section";
import { CitiesSection } from "@/components/cities-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { BusinessCTASection } from "@/components/business-cta-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FinalCTASection } from "@/components/final-cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <HeroSection />
        <CategoriesSection />
        <FeaturedProfessionalsSection />
        <RecentProfessionalsSection />
        <CitiesSection />
        <HowItWorksSection />
        <BusinessCTASection />
        <TestimonialsSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
