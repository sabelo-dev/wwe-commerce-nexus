import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Package,
  Heart,
  MapPin,
  User,
  Star,
  MessageCircle,
  Wallet,
  Bell,
  HelpCircle,
} from "lucide-react";

// Import dashboard components
import ConsumerOrders from "@/components/consumer/dashboard/ConsumerOrders";
import ConsumerWishlist from "@/components/consumer/dashboard/ConsumerWishlist";
import ConsumerAddresses from "@/components/consumer/dashboard/ConsumerAddresses";
import ConsumerProfile from "@/components/consumer/dashboard/ConsumerProfile";
import ConsumerReviews from "@/components/consumer/dashboard/ConsumerReviews";
import ConsumerMessages from "@/components/consumer/dashboard/ConsumerMessages";
import ConsumerWallet from "@/components/consumer/dashboard/ConsumerWallet";
import ConsumerNotifications from "@/components/consumer/dashboard/ConsumerNotifications";
import ConsumerSupport from "@/components/consumer/dashboard/ConsumerSupport";

const ConsumerDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeModule, setActiveModule] = useState("orders");

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

  if (!user || user.role !== 'consumer') {
    return <Navigate to="/" replace />;
  }

  const sidebarItems = [
    {
      id: "orders",
      title: "My Orders",
      icon: Package,
      description: "Track orders, cancel, return/refund, reorder"
    },
    {
      id: "wishlist",
      title: "Wishlist",
      icon: Heart,
      description: "Save products for later"
    },
    {
      id: "addresses",
      title: "Addresses",
      icon: MapPin,
      description: "Add/edit/delete shipping addresses"
    },
    {
      id: "profile",
      title: "Profile",
      icon: User,
      description: "Edit name, email, phone, password"
    },
    {
      id: "reviews",
      title: "Reviews",
      icon: Star,
      description: "Write/view submitted reviews"
    },
    {
      id: "messages",
      title: "Messages",
      icon: MessageCircle,
      description: "Communicate with vendor/support"
    },
    {
      id: "wallet",
      title: "Wallet & Payments",
      icon: Wallet,
      description: "Saved cards, transactions, loyalty points"
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      description: "Order updates, deals, messages"
    },
    {
      id: "support",
      title: "Support",
      icon: HelpCircle,
      description: "Contact help desk or view ticket status"
    }
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case "orders":
        return <ConsumerOrders />;
      case "wishlist":
        return <ConsumerWishlist />;
      case "addresses":
        return <ConsumerAddresses />;
      case "profile":
        return <ConsumerProfile />;
      case "reviews":
        return <ConsumerReviews />;
      case "messages":
        return <ConsumerMessages />;
      case "wallet":
        return <ConsumerWallet />;
      case "notifications":
        return <ConsumerNotifications />;
      case "support":
        return <ConsumerSupport />;
      default:
        return <ConsumerOrders />;
    }
  };

  const activeItem = sidebarItems.find(item => item.id === activeModule);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="w-64">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Consumer Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveModule(item.id)}
                        className={cn(
                          "w-full justify-start",
                          activeModule === item.id && "bg-accent"
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-xl font-semibold">
                  {activeItem?.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {activeItem?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Welcome back,</span>
              <span className="font-medium">{user.name || user.email}</span>
            </div>
          </header>

          <div className="flex-1 p-6">
            {renderActiveModule()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ConsumerDashboard;