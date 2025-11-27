import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingProps {
  onSelectPlan: (plan: "free" | "premium") => void;
}

const Pricing = ({ onSelectPlan }: PricingProps) => {
  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Start Your Visa Journey Today
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="relative p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">Standard</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">Free</span>
              </div>
              <p className="text-muted-foreground mt-2">Get started with the basics</p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "Visa Timeline Tracker",
                "Basic Document Checklist",
                "Email Reminders",
                "Government Links Library",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-forest-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              id="btn-select-free"
              variant="free"
              size="lg"
              className="w-full"
              onClick={() => onSelectPlan("free")}
            >
              Start Free Application
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="relative p-6 md:p-8 rounded-2xl bg-card border-2 border-primary shadow-glow">
            {/* Recommended Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Recommended
              </span>
            </div>

            <div className="mb-6 pt-2">
              <h3 className="text-xl font-semibold text-foreground mb-2">Premium</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">£25</span>
                <span className="text-muted-foreground">one-time</span>
              </div>
              <p className="text-muted-foreground mt-2">Peace of mind included</p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "Everything in Standard",
                "Smart Document Autofill",
                "Expert Application Review",
                "Priority Support",
                "Biometrics Booking Guide",
                "Interview Prep Checklist",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-forest-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              id="btn-select-premium"
              variant="premium"
              size="lg"
              className="w-full"
              onClick={() => onSelectPlan("premium")}
            >
              Get Premium Access
            </Button>
          </div>
        </div>

        {/* Trust note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Secure checkout • 30-day money-back guarantee • No payment required to start
        </p>
      </div>
    </section>
  );
};

export default Pricing;
