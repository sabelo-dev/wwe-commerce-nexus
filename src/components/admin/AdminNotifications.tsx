import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Bell, Users, Store, Globe, Calendar } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "announcement" | "promotion" | "maintenance" | "alert";
  audience: "all" | "vendors" | "consumers" | "admins";
  status: "draft" | "scheduled" | "sent";
  sentAt?: string;
  scheduledFor?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight from 12 AM to 2 AM.",
    type: "maintenance",
    audience: "all",
    status: "sent",
    sentAt: "2024-01-15 14:30"
  },
  {
    id: "2",
    title: "New Vendor Onboarding",
    message: "Welcome to our new vendor partners! Check out their amazing products.",
    type: "announcement",
    audience: "consumers", 
    status: "scheduled",
    scheduledFor: "2024-01-20 09:00"
  }
];

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "announcement" as const,
    audience: "all" as const,
    scheduledFor: ""
  });
  const { toast } = useToast();

  const handleSendNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields."
      });
      return;
    }

    const notification: Notification = {
      id: Date.now().toString(),
      ...newNotification,
      status: newNotification.scheduledFor ? "scheduled" : "sent",
      sentAt: newNotification.scheduledFor ? undefined : new Date().toISOString()
    };

    setNotifications([notification, ...notifications]);
    setNewNotification({
      title: "",
      message: "",
      type: "announcement",
      audience: "all", 
      scheduledFor: ""
    });

    toast({
      title: "Notification sent",
      description: newNotification.scheduledFor 
        ? "Notification has been scheduled successfully."
        : "Notification has been sent to all selected users."
    });
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case "vendors": return <Store className="h-4 w-4" />;
      case "consumers": return <Users className="h-4 w-4" />;
      case "admins": return <Bell className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "alert": return "destructive";
      case "maintenance": return "secondary";
      case "promotion": return "default";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notifications Management</h2>
      </div>

      <Tabs defaultValue="send" className="w-full">
        <TabsList>
          <TabsTrigger value="send">Send Notification</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send New Notification</CardTitle>
              <CardDescription>
                Send announcements, promotions, or alerts to users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Notification Type</label>
                  <Select 
                    value={newNotification.type}
                    onValueChange={(value: any) => setNewNotification({...newNotification, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Target Audience</label>
                  <Select 
                    value={newNotification.audience}
                    onValueChange={(value: any) => setNewNotification({...newNotification, audience: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="vendors">Vendors Only</SelectItem>
                      <SelectItem value="consumers">Consumers Only</SelectItem>
                      <SelectItem value="admins">Admins Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Notification title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Notification message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Schedule For (Optional)</label>
                <Input
                  type="datetime-local"
                  value={newNotification.scheduledFor}
                  onChange={(e) => setNewNotification({...newNotification, scheduledFor: e.target.value})}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to send immediately
                </p>
              </div>

              <Button onClick={handleSendNotification} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                {newNotification.scheduledFor ? "Schedule Notification" : "Send Now"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>Previous notifications sent to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{notification.title}</h4>
                        <Badge variant={getTypeColor(notification.type)}>
                          {notification.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <div className="flex items-center gap-1">
                            {getAudienceIcon(notification.audience)}
                            {notification.audience}
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    
                    <Badge 
                      variant={
                        notification.status === "sent" ? "default" :
                        notification.status === "scheduled" ? "secondary" : "outline"
                      }
                    >
                      {notification.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {notification.sentAt && (
                      <div className="flex items-center gap-1">
                        <Bell className="h-3 w-3" />
                        Sent: {notification.sentAt}
                      </div>
                    )}
                    {notification.scheduledFor && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Scheduled: {notification.scheduledFor}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotifications;