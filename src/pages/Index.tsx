import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import SignupModal from "@/components/SignupModal";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium" | null>(null);

  const handleSelectPlan = (plan: "free" | "premium") => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Analytics />
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing onSelectPlan={handleSelectPlan} />
      </main>
      <Footer />
      
      <SignupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </div>
  );
};

export default Index;
