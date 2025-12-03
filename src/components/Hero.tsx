import { Button } from "@/components/ui/button";
import { ArrowDown, Shield, CheckCircle2 } from "lucide-react";

const Hero = () => {
  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-50/50 to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6 animate-fade-in-up">
            <Shield className="w-4 h-4" />
            <span>Trusted by 2,000+ UK student visa applicants</span>
          </div>

          {/* Main headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in-up-delay-1 text-balance">
            The Stress-Free Way to Secure Your{" "}
            <span className="text-primary">UK Student Visa</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up-delay-2 text-balance">
            Auto-fill your application, track your timeline, and avoid the mistakes that cause rejection.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up-delay-3">
            <Button variant="hero" size="xl" onClick={scrollToPricing}>
              Sign up for beta access
              <ArrowDown className="w-5 h-5 ml-1" />
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest-500" />
                <span>98% approval rate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest-500" />
                <span>20+ hours saved</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest-500" />
                <span>UKVI compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
