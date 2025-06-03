
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Eye,
  Users 
} from "lucide-react";

const VendorOverview = () => {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: "Total Products",
      value: "24",
      change: "+3 this month",
      icon: Package,
      trend: "up"
    },
    {
      title: "Total Orders",
      value: "156",
      change: "+12 this week",
      icon: ShoppingCart,
      trend: "up"
    },
    {
      title: "Revenue",
      value: "$4,562",
      change: "+8% from last month",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Store Views",
      value: "2,341",
      change: "+15% this week",
      icon: Eye,
      trend: "up"
    }
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      product: "Wireless Headphones",
      amount: "$129.99",
      status: "pending",
      date: "2 hours ago"
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      product: "Smart Watch",
      amount: "$249.99",
      status: "processing",
      date: "5 hours ago"
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      product: "Laptop Stand",
      amount: "$79.99",
      status: "shipped",
      date: "1 day ago"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Latest orders from your customers
          </CardDescription>
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
                  <p className="text-sm font-medium">{order.amount}</p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        order.status === "pending" ? "outline" :
                        order.status === "processing" ? "default" :
                        "secondary"
                      }
                    >
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
    </div>
  );
};

export default VendorOverview;
