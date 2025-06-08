
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Download, 
  Calendar,
  Users,
  ShoppingCart,
  Eye
} from "lucide-react";

interface SalesData {
  period: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  growth: number;
}

interface VendorPerformance {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  products: number;
  rating: number;
  growth: number;
}

interface ProductPerformance {
  id: string;
  name: string;
  vendor: string;
  category: string;
  sales: number;
  revenue: number;
  views: number;
  conversionRate: number;
}

// Mock data
const salesData: SalesData[] = [
  { period: "This Week", revenue: 12450, orders: 89, averageOrderValue: 139.89, growth: 12.5 },
  { period: "Last Week", revenue: 11060, orders: 78, averageOrderValue: 141.79, growth: 8.2 },
  { period: "This Month", revenue: 45230, orders: 324, averageOrderValue: 139.60, growth: 15.3 },
  { period: "Last Month", revenue: 39200, orders: 289, averageOrderValue: 135.64, growth: 11.8 },
];

const vendorPerformance: VendorPerformance[] = [
  {
    id: "v1",
    name: "Tech Shop",
    revenue: 15400,
    orders: 112,
    products: 45,
    rating: 4.8,
    growth: 18.5,
  },
  {
    id: "v2",
    name: "Fashion Boutique",
    revenue: 12800,
    orders: 89,
    products: 78,
    rating: 4.6,
    growth: 12.3,
  },
  {
    id: "v3",
    name: "Home & Garden",
    revenue: 9600,
    orders: 67,
    products: 34,
    rating: 4.4,
    growth: -2.1,
  },
];

const productPerformance: ProductPerformance[] = [
  {
    id: "p1",
    name: "Wireless Headphones Pro",
    vendor: "Tech Shop",
    category: "Electronics",
    sales: 156,
    revenue: 20280,
    views: 5420,
    conversionRate: 2.9,
  },
  {
    id: "p2",
    name: "Summer Dress Collection",
    vendor: "Fashion Boutique",
    category: "Clothing",
    sales: 89,
    revenue: 5340,
    views: 3210,
    conversionRate: 2.8,
  },
  {
    id: "p3",
    name: "Garden Tool Set",
    vendor: "Home & Garden",
    category: "Tools",
    sales: 67,
    revenue: 6030,
    views: 2890,
    conversionRate: 2.3,
  },
];

const AdminAnalytics: React.FC = () => {
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const averageGrowth = salesData.reduce((sum, item) => sum + item.growth, 0) / salesData.length;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Analytics & Reports</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +{averageGrowth.toFixed(1)}% from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.7%</div>
            <p className="text-xs text-muted-foreground">
              +0.3% from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sales">Sales Trends</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Performance</TabsTrigger>
          <TabsTrigger value="products">Product Analytics</TabsTrigger>
          <TabsTrigger value="customer">Customer Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Revenue and order trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Sales data by period</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>AOV</TableHead>
                      <TableHead>Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{data.period}</TableCell>
                        <TableCell>{formatCurrency(data.revenue)}</TableCell>
                        <TableCell>{data.orders}</TableCell>
                        <TableCell>{formatCurrency(data.averageOrderValue)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {data.growth > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className={data.growth > 0 ? "text-green-500" : "text-red-500"}>
                              {data.growth > 0 ? "+" : ""}{data.growth}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>Performance highlights and trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-green-900">Revenue Growth</h4>
                    <p className="text-sm text-green-700">Strong upward trend this month</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">+15.3%</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-blue-900">Order Volume</h4>
                    <p className="text-sm text-blue-700">Consistent increase in orders</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">+12.5%</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-yellow-900">Cart Abandonment</h4>
                    <p className="text-sm text-yellow-700">Needs attention</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">68.2%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance Ranking</CardTitle>
              <CardDescription>Top performing vendors by revenue and growth</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Vendor performance metrics</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorPerformance.map((vendor, index) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="font-medium">{vendor.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(vendor.revenue)}</TableCell>
                      <TableCell>{vendor.orders}</TableCell>
                      <TableCell>{vendor.products}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{vendor.rating}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {vendor.growth > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <span className={vendor.growth > 0 ? "text-green-500" : "text-red-500"}>
                            {vendor.growth > 0 ? "+" : ""}{vendor.growth}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Best selling products and conversion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Top performing products</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Conv. Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productPerformance.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{product.vendor}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>{product.sales}</TableCell>
                      <TableCell>{formatCurrency(product.revenue)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          {product.views.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>{product.conversionRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Behavior</CardTitle>
                <CardDescription>User engagement and conversion metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Session Duration</span>
                  <span className="font-medium">4m 32s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pages per Session</span>
                  <span className="font-medium">3.8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bounce Rate</span>
                  <span className="font-medium">42.3%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Return Customer Rate</span>
                  <span className="font-medium">34.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Customer Lifetime Value</span>
                  <span className="font-medium">{formatCurrency(485.30)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your customers are coming from</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Direct</span>
                  <span className="font-medium">45.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Search Engines</span>
                  <span className="font-medium">28.7%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Social Media</span>
                  <span className="font-medium">15.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Marketing</span>
                  <span className="font-medium">7.3%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Referrals</span>
                  <span className="font-medium">3.0%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
