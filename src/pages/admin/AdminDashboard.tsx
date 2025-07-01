
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
import { 
  LayoutDashboard, 
  Users,
  Store,
  Package, 
  ShoppingCart, 
  MessageSquare,
  DollarSign,
  FileText,
  Megaphone,
  BarChart3,
  FileText as AuditIcon,
  Settings,
  Shield 
} from "lucide-react";

const AdminDashboard = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Only perform redirects after loading is complete
    if (!isLoading && !redirecting) {
      if (!user) {
        setRedirecting(true);
        navigate("/admin/login", { replace: true });
      } else if (user.role !== 'admin' && !isAdmin) {
        setRedirecting(true);
        navigate("/", { replace: true });
      }
    }
  }, [user, isAdmin, isLoading, navigate, redirecting]);

  // Show loading while auth is initializing or redirecting
  if (isLoading || redirecting) {
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
  if (!user || (user.role !== 'admin' && !isAdmin)) {
    return null;
  }

  const sidebarItems = [
    {
      id: "overview",
      title: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "users",
      title: "Users",
      icon: Users,
    },
    {
      id: "vendors",
      title: "Vendors",
      icon: Store,
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
      id: "customers",
      title: "Customers",
      icon: Users,
    },
    {
      id: "disputes",
      title: "Support",
      icon: MessageSquare,
    },
    {
      id: "financials",
      title: "Financials",
      icon: DollarSign,
    },
    {
      id: "content",
      title: "Content",
      icon: FileText,
    },
    {
      id: "promotions",
      title: "Marketing",
      icon: Megaphone,
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: BarChart3,
    },
    {
      id: "audit",
      title: "Audit Logs",
      icon: AuditIcon,
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
              <Shield className="h-6 w-6" />
              <span className="font-semibold">Admin Dashboard</span>
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
                <AdminOverview />
              </TabsContent>
              
              <TabsContent value="users" className="mt-0">
                <AdminUsers />
              </TabsContent>
              
              <TabsContent value="vendors" className="mt-0">
                <AdminVendors />
              </TabsContent>
              
              <TabsContent value="products" className="mt-0">
                <AdminProducts />
              </TabsContent>
              
              <TabsContent value="orders" className="mt-0">
                <AdminOrders />
              </TabsContent>

              <TabsContent value="customers" className="mt-0">
                <AdminCustomers />
              </TabsContent>

              <TabsContent value="disputes" className="mt-0">
                <AdminDisputes />
              </TabsContent>

              <TabsContent value="financials" className="mt-0">
                <AdminFinancials />
              </TabsContent>

              <TabsContent value="content" className="mt-0">
                <AdminContent />
              </TabsContent>

              <TabsContent value="promotions" className="mt-0">
                <AdminPromotions />
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <AdminAnalytics />
              </TabsContent>
              
              <TabsContent value="audit" className="mt-0">
                <AdminAuditLogs />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <AdminSettings />
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
