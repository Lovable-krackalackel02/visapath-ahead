import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Chrome, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkAndRedirect(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        checkAndRedirect(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAndRedirect = async (userId: string) => {
    const { data } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
    if (data) {
      navigate('/admin');
    } else {
      toast.error("You don't have admin access");
      await supabase.auth.signOut();
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Access</h1>
          <p className="text-muted-foreground">Sign in with your authorized Google account</p>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          size="lg"
          className="w-full"
          variant="outline"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <Chrome className="w-5 h-5 mr-2" />
              Sign in with Google
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Only authorized admins can access the dashboard
        </p>
      </div>
    </div>
  );
};

export default Auth;
