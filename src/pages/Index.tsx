import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSlider } from "@/components/home/HeroSlider";
import { AgeGroupSection } from "@/components/home/AgeGroupSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSlider />
        <AgeGroupSection />
        <CategoriesSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
