
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VendorOverview from "./dashboard/VendorOverview";
import VendorProfile from "./dashboard/VendorProfile";
import VendorProducts from "./dashboard/VendorProducts";
import VendorOrders from "./dashboard/VendorOrders";
import VendorInventory from "./dashboard/VendorInventory";
import VendorPayouts from "./dashboard/VendorPayouts";
import VendorAnalytics from "./dashboard/VendorAnalytics";
import VendorSettings from "./dashboard/VendorSettings";
import { 
  LayoutDashboard, 
  User,
  Package, 
  ShoppingCart, 
  Warehouse,
  DollarSign,
  BarChart3,
  Settings, 
  Store 
} from "lucide-react";

const VendorDashboard = () => {
  const { user, isVendor, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Only perform redirects after loading is complete
    if (!isLoading) {
      if (!user || !isVendor) {
        navigate("/vendor/register", { replace: true });
      }
    }
  }, [user, isVendor, isLoading, navigate]);

  // Show loading while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!user || !isVendor) {
    return null;
  }

  const sidebarItems = [
    {
      id: "overview",
      title: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "profile",
      title: "Profile",
      icon: User,
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
      id: "inventory",
      title: "Inventory",
      icon: Warehouse,
    },
    {
      id: "payouts",
      title: "Payouts",
      icon: DollarSign,
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: BarChart3,
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
              
              <TabsContent value="profile" className="mt-0">
                <VendorProfile />
              </TabsContent>
              
              <TabsContent value="products" className="mt-0">
                <VendorProducts />
              </TabsContent>
              
              <TabsContent value="orders" className="mt-0">
                <VendorOrders />
              </TabsContent>

              <TabsContent value="inventory" className="mt-0">
                <VendorInventory />
              </TabsContent>

              <TabsContent value="payouts" className="mt-0">
                <VendorPayouts />
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <VendorAnalytics />
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
