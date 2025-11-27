import { Plane } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Plane className="w-4 h-4 text-primary-foreground rotate-45" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              visa<span className="text-forest-500">pal</span>
            </span>
          </div>
          
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </nav>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VisaPal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
