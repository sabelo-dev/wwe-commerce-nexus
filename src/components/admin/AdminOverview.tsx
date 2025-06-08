
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
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
  // Mock data - replace with real data from your API
  const kpiData = {
    totalVendors: 125,
    activeVendors: 98,
    totalSales: 45234.50,
    todaySales: 2341.20,
    pendingOrders: 23,
    fulfilledOrders: 567,
    lowStockAlerts: 12,
    outOfStockAlerts: 5,
    openTickets: 8,
    commissionToday: 234.12,
    commissionMonth: 4523.45,
    newVendorSignups: 5,
    newCustomerSignups: 34
  };

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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">New vendor application</p>
                  <p className="text-xs text-muted-foreground">Tech Store Inc.</p>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Product flagged for review</p>
                  <p className="text-xs text-muted-foreground">Wireless Headphones</p>
                </div>
                <Badge variant="destructive">Urgent</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Large order placed</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(2500)}</p>
                </div>
                <Badge variant="default">Completed</Badge>
              </div>
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
