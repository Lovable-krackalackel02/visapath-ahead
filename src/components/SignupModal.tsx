import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, Mail, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: "free" | "premium" | null;
}

const universities = [
  { value: "imperial", label: "Imperial College London" },
  { value: "ucl", label: "University College London (UCL)" },
  { value: "lse", label: "London School of Economics (LSE)" },
  { value: "oxford", label: "University of Oxford" },
  { value: "cambridge", label: "University of Cambridge" },
  { value: "other", label: "Other" },
];

const SignupModal = ({ isOpen, onClose, selectedPlan }: SignupModalProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDisclosure, setShowDisclosure] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !university) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("leads").insert({
        email: email.trim().toLowerCase(),
        name: name.trim() || null,
        phone: phone.trim() || null,
        university,
        selected_plan: selectedPlan,
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("This email is already registered");
        } else {
          throw error;
        }
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
      setShowDisclosure(true);
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setName("");
    setPhone("");
    setUniversity("");
    setIsSubmitted(false);
    setShowDisclosure(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card">
        {showDisclosure ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            
            <h3 className="text-xl font-semibold text-foreground">
              Research Disclosure
            </h3>
            
            <div className="space-y-3 text-left bg-secondary p-4 rounded-lg">
              <p className="text-sm text-foreground">
                Thank you for your interest in VisaPal!
              </p>
              <p className="text-sm text-foreground">
                We want to be completely transparent with you: <strong>VisaPal is currently a research study</strong> we're conducting as part of our coursework.
              </p>
              <p className="text-sm text-foreground">
                We're not actively developing the application at this time. Your registration helps us understand the demand for this type of service and validate our concept.
              </p>
              <p className="text-sm text-foreground">
                We truly appreciate you taking the time to register your interest. Your input is invaluable to our research.
              </p>
            </div>

            <Button
              variant="default"
              className="mt-6"
              onClick={handleClose}
            >
              I Understand
            </Button>
          </div>
        ) : !isSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-center">
                Create your secure account
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.ac.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+44 7700 900000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="university">Intended University</Label>
                <Select value={university} onValueChange={setUniversity} required>
                  <SelectTrigger id="university" className="h-11 bg-background">
                    <SelectValue placeholder="Select your university" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {universities.map((uni) => (
                      <SelectItem key={uni.value} value={uni.value}>
                        {uni.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-forest-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-forest-600" />
            </div>
            
            {selectedPlan === "free" ? (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Account Created
                </h3>
                <p className="text-muted-foreground mb-4">
                  We are currently verifying university portals. You have been added to the <strong>priority waitlist</strong>.
                </p>
                <div className="p-4 rounded-lg bg-secondary text-sm text-secondary-foreground">
                  <Mail className="w-5 h-5 mx-auto mb-2 text-forest-600" />
                  We'll email you when your account is ready.
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Premium Request Received
                </h3>
                <p className="text-muted-foreground mb-4">
                  We are at capacity for manual verification. We have reserved your <strong>Priority Spot</strong>.
                </p>
                <div className="p-4 rounded-lg bg-secondary text-sm text-secondary-foreground">
                  <Mail className="w-5 h-5 mx-auto mb-2 text-forest-600" />
                  We will email you a secure payment link when a slot opens.
                </div>
              </>
            )}

            <Button
              variant="outline"
              className="mt-6"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
