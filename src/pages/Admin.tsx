import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminDashboard from "@/components/AdminDashboard";
import { Loader2 } from "lucide-react";

const ALLOWED_ADMIN_EMAIL = "paulkallarackel@gmail.com";

const Admin = () => {
  // const navigate = useNavigate();
  // const [isLoading, setIsLoading] = useState(true);
  // const [isAuthorized, setIsAuthorized] = useState(false);

  // useEffect(() => {
  //   checkAuth();

  //   const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  //     if (event === 'SIGNED_OUT' || !session) {
  //       navigate('/auth');
  //     } else if (session.user.email === ALLOWED_ADMIN_EMAIL) {
  //       setIsAuthorized(true);
  //       setIsLoading(false);
  //     } else {
  //       navigate('/');
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, [navigate]);

  // const checkAuth = async () => {
  //   const { data: { session } } = await supabase.auth.getSession();
    
  //   if (!session) {
  //     navigate('/auth');
  //     return;
  //   }

  //   if (session.user.email === ALLOWED_ADMIN_EMAIL) {
  //     setIsAuthorized(true);
  //   } else {
  //     navigate('/');
  //   }
    
  //   setIsLoading(false);
  // };

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-background">
  //       <Loader2 className="w-8 h-8 animate-spin text-primary" />
  //     </div>
  //   );
  // }

  // if (!isAuthorized) {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-background">
      <AdminDashboard />
    </div>
  );
};

export default Admin;
