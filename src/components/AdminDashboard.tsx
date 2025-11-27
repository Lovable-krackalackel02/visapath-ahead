import { useEffect, useState } from "react";
import { Users, Crown, TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Stats {
  total: number;
  free: number;
  premium: number;
}

interface Lead {
  email: string;
  university: string;
  selected_plan: "free" | "premium";
  created_at: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ total: 0, free: 0, premium: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = () => {
    setIsLoading(true);
    try {
      const leads: Lead[] = JSON.parse(localStorage.getItem("visapal_leads") || "[]");
      const free = leads.filter((lead) => lead.selected_plan === "free").length;
      const premium = leads.filter((lead) => lead.selected_plan === "premium").length;

      setStats({
        total: leads.length,
        free,
        premium,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Listen for storage changes
    const handleStorageChange = () => {
      fetchStats();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("visapal_lead_added", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("visapal_lead_added", handleStorageChange);
    };
  }, []);

  const conversionRate = stats.total > 0 
    ? ((stats.premium / stats.total) * 100).toFixed(1) 
    : "0";

  return (
    <section className="py-16 bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-foreground">Admin Dashboard</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchStats}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Signups */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Total Signups</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            </div>

            {/* Free Plan */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Users className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">Free Plan</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.free}</p>
            </div>

            {/* Premium Plan */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-forest-100 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-forest-600" />
                </div>
                <span className="text-sm text-muted-foreground">Premium Plan</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.premium}</p>
            </div>

            {/* Conversion Rate */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-forest-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-forest-600" />
                </div>
                <span className="text-sm text-muted-foreground">Premium Rate</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{conversionRate}%</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Data stored locally • Enable Supabase for persistent storage
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
