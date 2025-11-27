import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
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
  const [university, setUniversity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !university) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const leads = JSON.parse(localStorage.getItem("visapal_leads") || "[]");
      
      if (leads.some((lead: { email: string }) => lead.email === email.trim().toLowerCase())) {
        toast.error("This email is already registered");
        setIsSubmitting(false);
        return;
      }

      leads.push({
        email: email.trim().toLowerCase(),
        university,
        selected_plan: selectedPlan,
        created_at: new Date().toISOString(),
      });

      localStorage.setItem("visapal_leads", JSON.stringify(leads));
      window.dispatchEvent(new Event("visapal_lead_added"));

      setIsSubmitted(true);
      toast.success("Successfully registered!");
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setUniversity("");
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card">
        {!isSubmitted ? (
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
