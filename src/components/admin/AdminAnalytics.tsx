import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Download, 
  Calendar,
  Users,
  ShoppingCart,
  Loader2
} from "lucide-react";

const AdminAnalytics: React.FC = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Fetch orders data
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders", dateRange],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select("*, order_items(quantity, price)");

      if (dateRange?.from) {
        query = query.gte("created_at", startOfDay(dateRange.from).toISOString());
      }
      if (dateRange?.to) {
        query = query.lte("created_at", endOfDay(dateRange.to).toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch vendors data
  const { data: vendors, isLoading: vendorsLoading } = useQuery({
    queryKey: ["admin-vendors-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select(`
          *,
          stores(
            id,
            products(id),
            orders:order_items(order_id, price, quantity)
          )
        `)
        .eq("status", "approved");
      if (error) throw error;
      return data;
    },
  });

  // Fetch products data
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          stores(name, vendors(business_name)),
          order_items(quantity, price)
        `)
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch profiles count
  const { data: profilesCount } = useQuery({
    queryKey: ["admin-profiles-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const isLoading = ordersLoading || vendorsLoading || productsLoading;

  // Calculate metrics
  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
  const totalOrders = orders?.length || 0;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const handleExport = () => {
    if (!orders || !vendors || !products) {
      toast({
        title: "Export failed",
        description: "Data is still loading. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const csvData = {
      orders: orders.map(order => ({
        id: order.id,
        user_id: order.user_id,
        total: order.total,
        status: order.status,
        date: format(new Date(order.created_at), "yyyy-MM-dd HH:mm"),
      })),
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        dateRange: dateRange?.from && dateRange?.to 
          ? `${format(dateRange.from, "yyyy-MM-dd")} to ${format(dateRange.to, "yyyy-MM-dd")}`
          : "All time",
      },
    };

    const blob = new Blob([JSON.stringify(csvData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-export-${format(new Date(), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Analytics data has been exported.",
    });
  };

  // Calculate vendor performance
  const vendorPerformance = vendors?.map(vendor => {
    const storeOrders = vendor.stores?.flatMap(store => store.orders || []) || [];
    const revenue = storeOrders.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const orderIds = new Set(storeOrders.map(item => item.order_id));
    const productsCount = vendor.stores?.reduce((sum, store) => sum + (store.products?.length || 0), 0) || 0;

    return {
      id: vendor.id,
      name: vendor.business_name,
      revenue,
      orders: orderIds.size,
      products: productsCount,
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 10) || [];

  // Calculate product performance
  const productPerformance = products?.map(product => {
    const sales = product.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const revenue = product.order_items?.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0) || 0;
    const storeName = product.stores?.name || "Unknown";
    const vendorName = product.stores?.vendors?.business_name || "Unknown";

    return {
      id: product.id,
      name: product.name,
      vendor: vendorName,
      store: storeName,
      category: product.category,
      sales,
      revenue,
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 10) || [];

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Analytics & Reports</h2>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Pick a date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" onClick={handleExport} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
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
              {dateRange?.from && dateRange?.to 
                ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`
                : "All time"}
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
              Total orders in period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              Average order value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profilesCount}</div>
            <p className="text-xs text-muted-foreground">
              Total registered users
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
          <Card>
            <CardHeader>
              <CardTitle>Sales Summary</CardTitle>
              <CardDescription>
                {dateRange?.from && dateRange?.to 
                  ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
                  : "All time"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col p-4 border rounded-lg">
                      <span className="text-sm text-muted-foreground">Total Revenue</span>
                      <span className="text-2xl font-bold">{formatCurrency(totalRevenue)}</span>
                    </div>
                    <div className="flex flex-col p-4 border rounded-lg">
                      <span className="text-sm text-muted-foreground">Total Orders</span>
                      <span className="text-2xl font-bold">{totalOrders}</span>
                    </div>
                    <div className="flex flex-col p-4 border rounded-lg">
                      <span className="text-sm text-muted-foreground">Average Order Value</span>
                      <span className="text-2xl font-bold">{formatCurrency(averageOrderValue)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders?.slice(0, 10).map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}</TableCell>
                            <TableCell>{format(new Date(order.created_at), "MMM d, yyyy")}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{order.status}</Badge>
                            </TableCell>
                            <TableCell>{formatCurrency(order.total)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors">
          <Card>
              <CardHeader>
                <CardTitle>Vendor Performance Ranking</CardTitle>
                <CardDescription>Top performing vendors by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableCaption>Vendor performance metrics</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Products</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendorPerformance.map((vendor, index) => (
                        <TableRow key={vendor.id}>
                          <TableCell>
                            <Badge variant="outline">#{index + 1}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{vendor.name}</TableCell>
                          <TableCell>{formatCurrency(vendor.revenue)}</TableCell>
                          <TableCell>{vendor.orders}</TableCell>
                          <TableCell>{vendor.products}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Best selling products</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableCaption>Top performing products</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Sales</TableHead>
                        <TableHead>Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productPerformance.map((product, index) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Badge variant="outline">#{index + 1}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.vendor}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>{product.sales}</TableCell>
                          <TableCell>{formatCurrency(product.revenue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer">
          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>User statistics and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col p-4 border rounded-lg">
                      <span className="text-sm text-muted-foreground">Total Registered Users</span>
                      <span className="text-2xl font-bold">{profilesCount}</span>
                    </div>
                    <div className="flex flex-col p-4 border rounded-lg">
                      <span className="text-sm text-muted-foreground">Total Orders</span>
                      <span className="text-2xl font-bold">{totalOrders}</span>
                    </div>
                    <div className="flex flex-col p-4 border rounded-lg">
                      <span className="text-sm text-muted-foreground">Average Order Value</span>
                      <span className="text-2xl font-bold">{formatCurrency(averageOrderValue)}</span>
                    </div>
                    <div className="flex flex-col p-4 border rounded-lg">
                      <span className="text-sm text-muted-foreground">Total Revenue</span>
                      <span className="text-2xl font-bold">{formatCurrency(totalRevenue)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
