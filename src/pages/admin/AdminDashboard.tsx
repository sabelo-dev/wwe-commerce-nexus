
import React from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminVendors from "@/components/admin/AdminVendors";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminCustomers from "@/components/admin/AdminCustomers";
import AdminDisputes from "@/components/admin/AdminDisputes";
import AdminFinancials from "@/components/admin/AdminFinancials";
import AdminContent from "@/components/admin/AdminContent";
import AdminPromotions from "@/components/admin/AdminPromotions";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminAuditLogs from "@/components/admin/AdminAuditLogs";
import AdminSettings from "@/components/admin/AdminSettings";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  React.useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name || "Admin"}
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-8 flex flex-wrap gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="disputes">Support</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="promotions">Marketing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="p-4 border rounded-md">
          <AdminOverview />
        </TabsContent>
        <TabsContent value="vendors" className="p-4 border rounded-md">
          <AdminVendors />
        </TabsContent>
        <TabsContent value="products" className="p-4 border rounded-md">
          <AdminProducts />
        </TabsContent>
        <TabsContent value="orders" className="p-4 border rounded-md">
          <AdminOrders />
        </TabsContent>
        <TabsContent value="customers" className="p-4 border rounded-md">
          <AdminCustomers />
        </TabsContent>
        <TabsContent value="disputes" className="p-4 border rounded-md">
          <AdminDisputes />
        </TabsContent>
        <TabsContent value="financials" className="p-4 border rounded-md">
          <AdminFinancials />
        </TabsContent>
        <TabsContent value="content" className="p-4 border rounded-md">
          <AdminContent />
        </TabsContent>
        <TabsContent value="promotions" className="p-4 border rounded-md">
          <AdminPromotions />
        </TabsContent>
        <TabsContent value="analytics" className="p-4 border rounded-md">
          <AdminAnalytics />
        </TabsContent>
        <TabsContent value="audit" className="p-4 border rounded-md">
          <AdminAuditLogs />
        </TabsContent>
        <TabsContent value="settings" className="p-4 border rounded-md">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
