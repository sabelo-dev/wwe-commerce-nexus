
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Eye,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle,
  Star,
  Target,
  Zap,
  Calendar,
  Bell,
  MessageSquare,
  Percent
} from "lucide-react";

const VendorOverview = () => {
  // Mock data - in real app, this would come from API
  const stats = {
    totalProducts: 24,
    activeProducts: 18,
    pendingApproval: 3,
    totalOrders: 156,
    newOrders: 5,
    pendingOrders: 8,
    processingOrders: 12,
    shippedOrders: 23,
    revenue: 4562.50,
    todayRevenue: 342.15,
    weeklyRevenue: 2841.30,
    monthlyRevenue: 12340.75,
    storeViews: 2341,
    todayViews: 89,
    weeklyViews: 567,
    lowStockItems: 4,
    outOfStockItems: 2,
    rating: 4.3,
    reviewCount: 89,
    profileCompletion: 85,
    conversionRate: 3.2,
    avgOrderValue: 78.45,
    returnRate: 2.1,
    activePromotions: 3,
    pendingPayouts: 2
  };

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      product: "Wireless Headphones",
      amount: 129.99,
      status: "new",
      date: "2 hours ago"
    },
    {
      id: "ORD-002", 
      customer: "Jane Smith",
      product: "Smart Watch",
      amount: 249.99,
      status: "processing",
      date: "5 hours ago"
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson", 
      product: "Laptop Stand",
      amount: 79.99,
      status: "shipped",
      date: "1 day ago"
    }
  ];

  const lowStockProducts = [
    { name: "Wireless Mouse", stock: 3, threshold: 10 },
    { name: "USB Cable", stock: 2, threshold: 15 },
    { name: "Phone Case", stock: 1, threshold: 5 },
    { name: "Screen Protector", stock: 4, threshold: 20 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "destructive";
      case "processing": return "default";
      case "shipped": return "secondary";
      case "delivered": return "default";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="text-right space-y-1">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{stats.rating}</span>
            <span className="text-sm text-muted-foreground">({stats.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* Profile Completion Alert */}
      {stats.profileCompletion < 100 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <h3 className="font-medium">Complete your profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete your profile to start listing products
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{stats.profileCompletion}%</div>
                <Progress value={stats.profileCompletion} className="w-24 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.todayRevenue.toFixed(2)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>7d: ${stats.weeklyRevenue.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newOrders}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{stats.pendingOrders} pending • {stats.processingOrders} processing</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              ${stats.avgOrderValue} avg order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Store Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayViews}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.weeklyViews} this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Low Stock</span>
                <span className="font-medium text-orange-600">{stats.lowStockItems} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Out of Stock</span>
                <span className="font-medium text-red-600">{stats.outOfStockItems} items</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
            <Percent className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePromotions}</div>
            <p className="text-xs text-muted-foreground">
              Black Friday ends in 5 days
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayouts}</div>
            <p className="text-xs text-muted-foreground">
              Next: ${(stats.revenue * 0.85).toFixed(2)} on Jan 30
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from your customers</CardDescription>
            </div>
            {stats.newOrders > 0 && (
              <Badge variant="destructive">{stats.newOrders} new</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.product}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">${order.amount}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status === "new" && <Clock className="h-3 w-3 mr-1" />}
                        {order.status === "processing" && <Package className="h-3 w-3 mr-1" />}
                        {order.status === "shipped" && <TrendingUp className="h-3 w-3 mr-1" />}
                        {order.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{order.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Low Stock Alert
              </CardTitle>
              <CardDescription>Products running low on inventory</CardDescription>
            </div>
            <Badge variant="outline">{stats.lowStockItems} items</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Threshold: {product.threshold} units
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive" className="text-xs">
                      {product.stock} left
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              Update Stock Levels
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Automate routine tasks and access key features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-6">
            <Button variant="outline" className="justify-start">
              <Package className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button variant="outline" className="justify-start">
              <Percent className="h-4 w-4 mr-2" />
              Create Promotion
            </Button>
            <Button variant="outline" className="justify-start">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Process Orders
            </Button>
            <Button variant="outline" className="justify-start">
              <DollarSign className="h-4 w-4 mr-2" />
              Request Payout
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" className="justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Set Alerts
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights & Recommendations */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>Actionable recommendations to grow your business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium">Demand Spike Detected</h4>
                <p className="text-sm text-muted-foreground">
                  Your "Wireless Earbuds" are trending. Consider increasing inventory by 20 units.
                </p>
              </div>
              <Button size="sm">Act Now</Button>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
              <Percent className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium">Dynamic Pricing Opportunity</h4>
                <p className="text-sm text-muted-foreground">
                  Increase Smart Watch price by 8% based on competitor analysis (+$3.2K monthly).
                </p>
              </div>
              <Button size="sm" variant="outline">Review</Button>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
              <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium">Seasonal Preparation</h4>
                <p className="text-sm text-muted-foreground">
                  Valentine's Day approaches. Create romantic product bundles to boost sales.
                </p>
              </div>
              <Button size="sm" variant="outline">Plan</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorOverview;
