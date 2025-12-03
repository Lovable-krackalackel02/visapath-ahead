import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Crown, TrendingUp, RefreshCw, LogOut, Building2, Clock, Calendar, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// 1. Expanded Interfaces
interface Stats {
    total: number;
    free: number;
    premium: number;
    today: number; // New metric
}

interface Lead {
    id: string;
    email: string;
    university: string;
    selected_plan: "free" | "premium";
    created_at: string;
}

interface UniversityStat {
    name: string;
    count: number;
    percentage: string;
}

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<Stats>({ total: 0, free: 0, premium: 0, today: 0 });
    const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
    const [topUnis, setTopUnis] = useState<UniversityStat[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

    const toggleReveal = (id: string) => {
        setRevealedIds((prev) => {
            const s = new Set(prev);
            if (s.has(id)) s.delete(id);
            else s.add(id);
            return s;
        });
    };
    const [chartData, setChartData] = useState<{date: string; count: number;}[]>([]);

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            // 2. Fetch specific columns needed for new analytics
            // Ordered by created_at desc for the "Recent Activity" feed
            const { data, error } = await supabase
                .from("leads")
                .select("id, email, university, selected_plan, created_at")
                .order('created_at', { ascending: false });

            if (error) throw error;

            const leads = data as Lead[] || [];

            // --- Calculation Logic ---

            // A. Basic Counts
            const free = leads.filter((l) => l.selected_plan === "free").length;
            const premium = leads.filter((l) => l.selected_plan === "premium").length;

            // B. "Today" Calculation
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const joinedToday = leads.filter(l => l.created_at.startsWith(todayStr)).length;

            // C. Top Universities Calculation
            const uniMap = leads.reduce((acc, lead) => {
                acc[lead.university] = (acc[lead.university] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const sortedUnis = Object.entries(uniMap)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5) // Top 5
                .map(([name, count]) => ({
                    name,
                    count,
                    percentage: ((count / leads.length) * 100).toFixed(1)
                }));

            // --- State Updates ---
            setStats({
                total: leads.length,
                free,
                premium,
                today: joinedToday
            });
            setRecentLeads(leads.slice(0, 5)); // Last 5 signups
            setTopUnis(sortedUnis);

            // Build chart data for the last 14 days
            const days = 14;
            const dateMap: Record<string, number> = {};
            leads.forEach(l => {
                const d = new Date(l.created_at).toISOString().split('T')[0];
                dateMap[d] = (dateMap[d] || 0) + 1;
            });
            const chartArr: {date: string; count: number;}[] = [];
            for (let i = days - 1; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const key = d.toISOString().split('T')[0];
                chartArr.push({ date: key, count: dateMap[key] || 0 });
            }
            setChartData(chartArr);

        } catch (error) {
            console.error("Error fetching stats:", error);
            toast.error("Failed to fetch stats");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        toast.success("Signed out successfully");
        navigate("/");
    };

    useEffect(() => {
        fetchStats();
        const channel = supabase
            .channel("leads-changes")
            .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => {
                fetchStats();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const conversionRate = stats.total > 0 ? ((stats.premium / stats.total) * 100).toFixed(1) : "0";

    // Simple SVG sparkline/area chart component for signups over time
    const SignupsChart = ({ data }: { data: { date: string; count: number }[] }) => {
        if (!data || data.length === 0) return <div className="text-sm text-muted-foreground">No data</div>;

        const width = 600;
        const height = 120;
        const padding = 20;
        const max = Math.max(...data.map(d => d.count), 1);

        const points = data.map((d, i) => {
            const x = padding + (i * (width - padding * 2)) / Math.max(1, data.length - 1);
            const y = padding + (1 - d.count / max) * (height - padding * 2);
            return { x, y };
        });

        const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

        return (
            <div>
                <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="160" className="rounded-md bg-card">
                    <defs>
                        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>
                    <path d={areaD} fill="url(#g1)" stroke="none" />
                    <path d={pathD} fill="none" stroke="#F59E0B" strokeWidth={2} />
                    {points.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#F59E0B" />
                    ))}
                    {/* X labels (every other tick to avoid crowding) */}
                    {data.map((d, i) => (
                        i % 2 === 0 && (
                            <text key={i} x={padding + (i * (width - padding * 2)) / Math.max(1, data.length - 1)} y={height - 4} fontSize={10} textAnchor="middle" fill="#6B7280">
                                {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </text>
                        )
                    ))}
                </svg>
            </div>
        );
    };

    return (
        <section className="py-16 bg-muted/50 min-h-screen">
            <div className="container mx-auto px-4 max-w-6xl">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
                        <p className="text-muted-foreground text-sm">Overview of user growth and demographics</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={fetchStats} disabled={isLoading}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleSignOut}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Total Signups */}
                    <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Total Leads</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                    </div>

                    {/* Premium Users */}
                    <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                <Crown className="w-5 h-5 text-amber-600" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Premium</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{stats.premium}</p>
                        <p className="text-xs text-muted-foreground mt-1">{conversionRate}% Conversion Rate</p>
                    </div>

                    {/* New Today */}
                    <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">New Today</span>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{stats.today}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                             {stats.today > 0 ? "🚀 Growing fast" : "No signups yet"}
                        </p>
                    </div>

                    {/* Conversion/Trend Placeholder */}
                    <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Plan Split</span>
                        </div>
                        <div className="flex items-end gap-2 h-10">
                            <div className="w-full bg-muted rounded-sm h-2 overflow-hidden flex">
                                <div style={{ width: `${100 - Number(conversionRate)}%` }} className="bg-slate-300 h-full" />
                                <div style={{ width: `${conversionRate}%` }} className="bg-amber-500 h-full" />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 flex justify-between">
                            <span>Free: {stats.free} ({stats.total > 0 ? Math.round((stats.free / stats.total) * 100) : 0}%)</span>
                            <span>Prem: {stats.premium} ({stats.total > 0 ? Math.round((stats.premium / stats.total) * 100) : 0}%)</span>
                        </p>
                    </div>
                </div>

                {/* Detailed Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Top Universities */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Building2 className="w-5 h-5 text-muted-foreground" />
                            <h3 className="font-semibold text-lg">Top Universities</h3>
                        </div>
                        <div className="space-y-4">
                            {topUnis.map((uni, index) => (
                                <div key={uni.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                                            {index + 1}
                                        </span>
                                        <span className="font-medium text-sm">{uni.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden hidden sm:block">
                                            <div 
                                                className="h-full bg-primary" 
                                                style={{ width: `${uni.percentage}%` }} 
                                            />
                                        </div>
                                        <span className="text-sm text-muted-foreground w-8 text-right">{uni.count}</span>
                                    </div>
                                </div>
                            ))}
                            {topUnis.length === 0 && (
                                <p className="text-center text-muted-foreground py-4">No data available yet</p>
                            )}
                        </div>
                        <div className="mt-6">
                            <h4 className="text-sm font-medium text-foreground mb-3">Signups (last 14 days)</h4>
                            <SignupsChart data={chartData} />
                        </div>
                    </div>

                    {/* Recent Signups Feed */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Clock className="w-5 h-5 text-muted-foreground" />
                            <h3 className="font-semibold text-lg">Recent Activity</h3>
                        </div>
                        <div className="space-y-4">
                            {recentLeads.map((lead) => (
                                <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-transparent hover:border-border transition-colors">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                          <span className={`font-medium text-sm truncate max-w-[200px] transition-all ${revealedIds.has(lead.id) ? 'blur-none' : 'blur-sm select-none'}`}>
                                            {lead.email}
                                          </span>
                                          <button type="button" onClick={() => toggleReveal(lead.id)} className="text-muted-foreground hover:text-foreground">
                                            {revealedIds.has(lead.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                          </button>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{lead.university}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                            lead.selected_plan === 'premium' 
                                            ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                                        }`}>
                                            {lead.selected_plan}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {recentLeads.length === 0 && (
                                <p className="text-center text-muted-foreground py-4">No leads yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminDashboard;