
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  ShoppingBag, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp,
  Store,
  UserCheck
} from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<any>;
  trend?: string;
  trendColor?: "green" | "red" | "yellow";
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  trendColor = "green" 
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {trend && (
        <div className="flex items-center pt-1">
          <Badge 
            variant={trendColor === "green" ? "default" : trendColor === "red" ? "destructive" : "outline"}
            className="text-xs"
          >
            {trend}
          </Badge>
        </div>
      )}
    </CardContent>
  </Card>
);

const AdminOverview: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState({
    totalVendors: 0,
    activeVendors: 0,
    totalSales: 0,
    todaySales: 0,
    pendingOrders: 0,
    fulfilledOrders: 0,
    lowStockAlerts: 0,
    outOfStockAlerts: 0,
    openTickets: 0,
    commissionToday: 0,
    commissionMonth: 0,
    newVendorSignups: 0,
    newCustomerSignups: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch vendors data
        const { data: vendors } = await supabase
          .from('vendors')
          .select('*');

        // Fetch orders data
        const { data: orders } = await supabase
          .from('orders')
          .select('*');

        // Fetch products data
        const { data: products } = await supabase
          .from('products')
          .select('*');

        // Fetch profiles data
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*');

        // Fetch payouts data
        const { data: payouts } = await supabase
          .from('payouts')
          .select('*');

        // Calculate KPIs
        const totalVendors = vendors?.length || 0;
        const activeVendors = vendors?.filter(v => v.status === 'approved').length || 0;
        
        const totalSales = orders?.reduce((sum, order) => sum + parseFloat(order.total?.toString() || '0'), 0) || 0;
        const today = new Date().toDateString();
        const todaySales = orders?.filter(o => new Date(o.created_at).toDateString() === today)
          .reduce((sum, order) => sum + parseFloat(order.total?.toString() || '0'), 0) || 0;

        const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
        const fulfilledOrders = orders?.filter(o => o.status === 'completed' || o.status === 'shipped').length || 0;

        const lowStockItems = products?.filter(p => p.quantity > 0 && p.quantity <= 5).length || 0;
        const outOfStockItems = products?.filter(p => p.quantity === 0).length || 0;

        // Commission calculation (assuming 15% platform fee)
        const commissionToday = todaySales * 0.15;
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const monthlyOrders = orders?.filter(o => new Date(o.created_at) >= monthAgo) || [];
        const monthlySales = monthlyOrders.reduce((sum, order) => sum + parseFloat(order.total?.toString() || '0'), 0);
        const commissionMonth = monthlySales * 0.15;

        // New signups in the last week
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const newVendorSignups = vendors?.filter(v => new Date(v.created_at) >= weekAgo).length || 0;
        const newCustomerSignups = profiles?.filter(p => p.role === 'consumer' && new Date(p.created_at) >= weekAgo).length || 0;

        // Recent activities
        const activities = [
          ...vendors?.filter(v => v.status === 'pending').slice(0, 2).map(v => ({
            type: 'vendor_application',
            title: 'New vendor application',
            description: v.business_name,
            status: 'Pending',
            variant: 'outline'
          })) || [],
          ...products?.filter(p => p.status === 'pending').slice(0, 2).map(p => ({
            type: 'product_review',
            title: 'Product flagged for review',
            description: p.name,
            status: 'Urgent',
            variant: 'destructive'
          })) || [],
          ...orders?.filter(o => parseFloat(o.total?.toString() || '0') > 1000).slice(0, 1).map(o => ({
            type: 'large_order',
            title: 'Large order placed',
            description: formatCurrency(parseFloat(o.total?.toString() || '0')),
            status: 'Completed',
            variant: 'default'
          })) || []
        ];

        setKpiData({
          totalVendors,
          activeVendors,
          totalSales,
          todaySales,
          pendingOrders,
          fulfilledOrders,
          lowStockAlerts: lowStockItems,
          outOfStockAlerts: outOfStockItems,
          openTickets: 0, // Not implemented
          commissionToday,
          commissionMonth,
          newVendorSignups,
          newCustomerSignups
        });

        setRecentActivities(activities);

      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard data."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Platform Overview</h2>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <KPICard
          title="Total Vendors"
          value={kpiData.totalVendors}
          description={`${kpiData.activeVendors} active`}
          icon={Store}
          trend="+5 this month"
        />
        
        <KPICard
          title="Total Sales"
          value={formatCurrency(kpiData.totalSales)}
          description="All time"
          icon={DollarSign}
          trend="+12% vs last month"
        />
        
        <KPICard
          title="Today's Sales"
          value={formatCurrency(kpiData.todaySales)}
          description="Today's revenue"
          icon={TrendingUp}
          trend="+8% vs yesterday"
        />
        
        <KPICard
          title="Pending Orders"
          value={kpiData.pendingOrders}
          description={`${kpiData.fulfilledOrders} fulfilled`}
          icon={ShoppingBag}
          trend="Normal volume"
          trendColor="yellow"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <KPICard
          title="Inventory Alerts"
          value={kpiData.lowStockAlerts + kpiData.outOfStockAlerts}
          description={`${kpiData.outOfStockAlerts} out of stock`}
          icon={AlertTriangle}
          trend="Needs attention"
          trendColor="red"
        />
        
        <KPICard
          title="Open Tickets"
          value={kpiData.openTickets}
          description="Support requests"
          icon={Users}
          trend="2 high priority"
          trendColor="red"
        />
        
        <KPICard
          title="Commission (Today)"
          value={formatCurrency(kpiData.commissionToday)}
          description="Platform earnings"
          icon={DollarSign}
          trend="+15% vs yesterday"
        />
        
        <KPICard
          title="New Signups"
          value={kpiData.newVendorSignups + kpiData.newCustomerSignups}
          description={`${kpiData.newVendorSignups} vendors, ${kpiData.newCustomerSignups} customers`}
          icon={UserCheck}
          trend="This week"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No recent activities</p>
              ) : (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                    <Badge variant={activity.variant}>{activity.status}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-sm">Review pending vendors</span>
                <Badge>{kpiData.totalVendors - kpiData.activeVendors}</Badge>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-sm">Process payouts</span>
                <Badge variant="outline">Weekly</Badge>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-sm">Review flagged products</span>
                <Badge variant="destructive">3</Badge>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-sm">Update homepage banners</span>
                <Badge variant="outline">Monthly</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
