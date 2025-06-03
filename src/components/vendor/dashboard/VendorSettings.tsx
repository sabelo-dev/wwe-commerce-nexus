
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Store, 
  User, 
  Bell, 
  CreditCard,
  Shield,
  Save
} from "lucide-react";

const VendorSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your store and account settings.
        </p>
      </div>

      {/* Store Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Store Information
          </CardTitle>
          <CardDescription>
            Update your store details and branding.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="store-name">Store Name</Label>
              <Input id="store-name" defaultValue="Tech Store" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-slug">Store URL</Label>
              <Input id="store-slug" defaultValue="tech-store" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="store-description">Description</Label>
            <Textarea 
              id="store-description" 
              defaultValue="Your one-stop shop for the latest tech gadgets and accessories."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store-logo">Store Logo URL</Label>
            <Input id="store-logo" placeholder="https://example.com/logo.png" />
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Store Settings
          </Button>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
          <CardDescription>
            Update your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" defaultValue="+1 (555) 123-4567" />
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how you want to be notified about your store activity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Orders</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when you receive new orders
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get alerts when product inventory is low
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and promotions
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Settings
          </CardTitle>
          <CardDescription>
            Manage your payout and payment information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank-account">Bank Account</Label>
              <Input id="bank-account" defaultValue="****1234" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routing-number">Routing Number</Label>
              <Input id="routing-number" defaultValue="****5678" disabled />
            </div>
          </div>
          <Button variant="outline">
            <CreditCard className="h-4 w-4 mr-2" />
            Update Payment Method
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your account security settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">
            Change Password
          </Button>
          <Button variant="outline">
            Enable Two-Factor Authentication
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorSettings;
