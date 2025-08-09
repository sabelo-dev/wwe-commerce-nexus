import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
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
import VendorShopfront from "./dashboard/VendorShopfront";
import VendorProducts from "./dashboard/VendorProducts";
import VendorOrders from "./dashboard/VendorOrders";
import VendorReviews from "./dashboard/VendorReviews";
import VendorInventory from "./dashboard/VendorInventory";
import VendorPromotions from "./dashboard/VendorPromotions";
import VendorPayouts from "./dashboard/VendorPayouts";
import VendorMessages from "./dashboard/VendorMessages";
import VendorSettings from "./dashboard/VendorSettings";
import VendorSupport from "./dashboard/VendorSupport";
import SubscriptionBanner from "./SubscriptionBanner";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  Store,
  Package, 
  ShoppingCart, 
  Star,
  Warehouse,
  Percent,
  DollarSign,
  MessageSquare,
  Settings, 
  Headphones
} from "lucide-react";

const VendorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [vendorData, setVendorData] = useState<any>(null);
  const [isTrialExpired, setIsTrialExpired] = useState(false);

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!user?.id) return;

      try {
        const { data: vendor } = await supabase
          .from('vendors')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (vendor) {
          setVendorData(vendor);
          
          // Check if trial has expired
          if (vendor.subscription_tier === 'trial' && vendor.trial_end_date) {
            const endDate = new Date(vendor.trial_end_date);
            const now = new Date();
            setIsTrialExpired(now > endDate);
          }
        }
      } catch (error) {
        console.error('Error fetching vendor data:', error);
      }
    };

    fetchVendorData();
  }, [user?.id]);

  const sidebarItems = [
    { id: "overview", title: "Dashboard Home", icon: LayoutDashboard },
    { id: "shopfront", title: "Shopfront", icon: Store },
    { id: "products", title: "Products", icon: Package },
    { id: "orders", title: "Orders", icon: ShoppingCart },
    { id: "reviews", title: "Reviews", icon: Star },
    { id: "inventory", title: "Inventory Manager", icon: Warehouse },
    { id: "promotions", title: "Discounts / Coupons", icon: Percent },
    { id: "payouts", title: "Earnings / Wallet", icon: DollarSign },
    { id: "messages", title: "Messages", icon: MessageSquare },
    { id: "settings", title: "Settings", icon: Settings },
    { id: "support", title: "Help / Support", icon: Headphones },
  ];

  return (
    <ProtectedRoute requireAuth requireVendor>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <Sidebar className="border-r">
            <SidebarHeader className="p-4 border-b">
              <div className="flex items-center gap-2">
                <Store className="h-6 w-6 text-primary" />
                <span className="font-semibold text-foreground">Vendor Dashboard</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveTab(item.id)}
                      isActive={activeTab === item.id}
                      className="w-full justify-start"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-lg font-semibold text-foreground">
                {sidebarItems.find(item => item.id === activeTab)?.title}
              </h1>
            </header>
            
            <main className="flex-1 p-6 bg-background">
              {isTrialExpired && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <h3 className="font-semibold text-destructive mb-2">Trial Expired</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your trial period has ended. Please upgrade to continue using the vendor dashboard.
                  </p>
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
                    Upgrade Now
                  </button>
                </div>
              )}
              
              <SubscriptionBanner vendorId={vendorData?.id} />
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
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
                <TabsContent value="shopfront" className="mt-0">
                  <VendorShopfront />
                </TabsContent>
                <TabsContent value="products" className="mt-0">
                  <VendorProducts />
                </TabsContent>
                <TabsContent value="orders" className="mt-0">
                  <VendorOrders />
                </TabsContent>
                <TabsContent value="reviews" className="mt-0">
                  <VendorReviews />
                </TabsContent>
                <TabsContent value="inventory" className="mt-0">
                  <VendorInventory />
                </TabsContent>
                <TabsContent value="promotions" className="mt-0">
                  <VendorPromotions />
                </TabsContent>
                <TabsContent value="payouts" className="mt-0">
                  <VendorPayouts />
                </TabsContent>
                <TabsContent value="messages" className="mt-0">
                  <VendorMessages />
                </TabsContent>
                <TabsContent value="settings" className="mt-0">
                  <VendorSettings />
                </TabsContent>
                <TabsContent value="support" className="mt-0">
                  <VendorSupport />
                </TabsContent>
              </Tabs>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default VendorDashboard;