
import React from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminVendors from "@/components/admin/AdminVendors";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminOrders from "@/components/admin/AdminOrders";
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

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-8 flex flex-wrap">
          <TabsTrigger value="users">Users & Vendors</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="p-4 border rounded-md">
          <AdminUsers />
        </TabsContent>
        <TabsContent value="products" className="p-4 border rounded-md">
          <AdminProducts />
        </TabsContent>
        <TabsContent value="orders" className="p-4 border rounded-md">
          <AdminOrders />
        </TabsContent>
        <TabsContent value="settings" className="p-4 border rounded-md">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
