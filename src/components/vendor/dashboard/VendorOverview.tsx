
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
  Star
} from "lucide-react";

const VendorOverview = () => {
  // Mock data - in real app, this would come from API
  const stats = {
    totalProducts: 24,
    activeProducts: 18,
    pendingApproval: 3,
    totalOrders: 156,
    newOrders: 5,
    revenue: 4562.50,
    monthlyRevenue: 12340.75,
    storeViews: 2341,
    lowStockItems: 4,
    rating: 4.3,
    reviewCount: 89,
    profileCompletion: 85
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

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{stats.activeProducts} active</span>
              {stats.pendingApproval > 0 && (
                <>
                  <span className="mx-1">•</span>
                  <span className="text-orange-600">{stats.pendingApproval} pending</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>{stats.newOrders} new today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.monthlyRevenue.toFixed(2)} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Store Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.storeViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% this week
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start">
              <Package className="h-4 w-4 mr-2" />
              Add Product
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
              <Users className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorOverview;
