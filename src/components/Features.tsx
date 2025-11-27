import { Clock, Shield, Calendar, FileText, CheckSquare, Bell } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Save 20+ Hours",
    description: "Stop searching through decentralized government websites. Everything you need in one place.",
  },
  {
    icon: Shield,
    title: "Zero Mistakes",
    description: "Smart autofill prevents the common errors that lead to visa rejections and delays.",
  },
  {
    icon: Calendar,
    title: "Live Timeline",
    description: "Know exactly when to book biometrics, gather documents, and submit your application.",
  },
  {
    icon: FileText,
    title: "Document Autofill",
    description: "Your travel history and personal details automatically populate across all forms.",
  },
  {
    icon: CheckSquare,
    title: "Smart Checklist",
    description: "Personalized requirements based on your nationality, university, and visa type.",
  },
  {
    icon: Bell,
    title: "Deadline Alerts",
    description: "Never miss a critical date. Get notified before important milestones.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Your Complete Visa Toolkit
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to navigate the UK student visa process with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 md:p-8 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
