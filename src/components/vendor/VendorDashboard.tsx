
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VendorOverview from "./dashboard/VendorOverview";
import VendorProducts from "./dashboard/VendorProducts";
import VendorOrders from "./dashboard/VendorOrders";
import VendorSettings from "./dashboard/VendorSettings";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  Store 
} from "lucide-react";
import { Navigate } from "react-router-dom";

const VendorDashboard = () => {
  const { user, isVendor } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if user is not a vendor
  if (!user || !isVendor) {
    return <Navigate to="/vendor/register" replace />;
  }

  const sidebarItems = [
    {
      id: "overview",
      title: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "products",
      title: "Products",
      icon: Package,
    },
    {
      id: "orders",
      title: "Orders",
      icon: ShoppingCart,
    },
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <Store className="h-6 w-6" />
              <span className="font-semibold">Vendor Dashboard</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    isActive={activeTab === item.id}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">
              {sidebarItems.find(item => item.id === activeTab)?.title}
            </h1>
          </header>
          
          <main className="flex-1 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="hidden">
                {sidebarItems.map((item) => (
                  <TabsTrigger key={item.id} value={item.id}>
                    {item.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
                <VendorOverview />
              </TabsContent>
              
              <TabsContent value="products" className="mt-0">
                <VendorProducts />
              </TabsContent>
              
              <TabsContent value="orders" className="mt-0">
                <VendorOrders />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <VendorSettings />
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default VendorDashboard;
