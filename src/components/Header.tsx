import { Plane } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Plane className="w-5 h-5 text-primary-foreground rotate-45" />
          </div>
          <span className="text-xl font-semibold text-foreground">
            visa<span className="text-forest-500">pal</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
