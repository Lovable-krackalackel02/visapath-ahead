// Use the static logo served from `public/visapal-logo.png`

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <a href="/" className="flex items-center gap-4 group">
          <div className="w-16 h-16 rounded-lg bg-none flex items-center justify-center overflow-hidden">
            <img src="/visapal-logo.png" alt="VisaPal" className="w-14 h-14 object-contain" />
          </div>
          <span className="text-3xl font-semibold text-foreground">
            Visa<span className="text-forest-500">Pal</span>
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
