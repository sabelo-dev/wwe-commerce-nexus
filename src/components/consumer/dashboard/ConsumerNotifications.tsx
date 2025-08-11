import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Package, Tag, MessageCircle, Trash2, Check } from "lucide-react";

const ConsumerNotifications: React.FC = () => {
  const [filter, setFilter] = useState("all");

  // Mock data - replace with actual API calls
  const notifications = [
    {
      id: "1",
      type: "order",
      title: "Order Shipped",
      message: "Your order ORD-001 has been shipped and is on its way!",
      timestamp: "2 hours ago",
      read: false,
      data: {
        orderId: "ORD-001",
        trackingNumber: "TN123456789"
      }
    },
    {
      id: "2",
      type: "promotion",
      title: "Flash Sale Alert",
      message: "Get 25% off on all electronics! Limited time offer.",
      timestamp: "4 hours ago",
      read: false,
      data: {
        discountCode: "FLASH25"
      }
    },
    {
      id: "3",
      type: "message",
      title: "New Message from TechStore",
      message: "Thank you for your order! We've included a free gift.",
      timestamp: "1 day ago",
      read: true,
      data: {
        conversationId: "conv-123"
      }
    },
    {
      id: "4",
      type: "order",
      title: "Order Delivered",
      message: "Your order ORD-002 has been delivered successfully.",
      timestamp: "2 days ago",
      read: true,
      data: {
        orderId: "ORD-002"
      }
    },
    {
      id: "5",
      type: "promotion",
      title: "Wishlist Item on Sale",
      message: "Premium Wireless Headphones from your wishlist is now 20% off!",
      timestamp: "3 days ago",
      read: true,
      data: {
        productId: "prod-123",
        discount: 20
      }
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "promotion":
        return <Tag className="h-5 w-5 text-green-500" />;
      case "message":
        return <MessageCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    const variants = {
      order: "default",
      promotion: "secondary",
      message: "outline"
    } as const;

    return (
      <Badge variant={variants[type as keyof typeof variants] || "secondary"}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    // Implement mark as read functionality
    console.log("Mark as read:", notificationId);
  };

  const deleteNotification = (notificationId: string) => {
    // Implement delete functionality
    console.log("Delete notification:", notificationId);
  };

  const markAllAsRead = () => {
    // Implement mark all as read functionality
    console.log("Mark all as read");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <span className="text-lg font-medium">Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
          <TabsTrigger value="order">Orders</TabsTrigger>
          <TabsTrigger value="promotion">Deals</TabsTrigger>
          <TabsTrigger value="message">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notifications</h3>
                  <p className="text-muted-foreground text-center">
                    {filter === "unread" 
                      ? "You're all caught up! No unread notifications."
                      : `No ${filter === "all" ? "" : filter} notifications to show.`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card key={notification.id} className={`${!notification.read ? 'border-l-4 border-l-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </h4>
                            {getNotificationBadge(notification.type)}
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </div>
                          
                          {/* Notification-specific actions */}
                          {notification.type === "order" && notification.data?.trackingNumber && (
                            <Button variant="link" className="p-0 h-auto text-xs mt-1">
                              Track Order
                            </Button>
                          )}
                          
                          {notification.type === "promotion" && notification.data?.discountCode && (
                            <div className="mt-2 p-2 bg-muted rounded text-xs">
                              Code: <span className="font-mono font-medium">{notification.data.discountCode}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-1 ml-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsumerNotifications;