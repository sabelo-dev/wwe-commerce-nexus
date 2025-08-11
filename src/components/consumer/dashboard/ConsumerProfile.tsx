import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { User, Store, Shield, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const ConsumerProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5" />
        <span className="text-lg font-medium">Profile Settings</span>
      </div>

      <div className="grid gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue={user?.name?.split(' ')[0] || ""} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={user?.name?.split(' ')[1] || ""} />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed. Contact support if you need to update it.
              </p>
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+27 123 456 789" />
            </div>
            
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" type="date" />
            </div>
            
            <Button>Update Personal Information</Button>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            
            <Button>Update Password</Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Order Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Get notified about order status changes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Promotional Emails</h4>
                <p className="text-sm text-muted-foreground">
                  Receive promotional emails and special offers
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">SMS Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive SMS updates for important order events
                </p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Wishlist Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  Get notified when wishlist items go on sale
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Button>Save Preferences</Button>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Account Type</h4>
                <p className="text-sm text-muted-foreground">
                  Your current account role and permissions
                </p>
              </div>
              <Badge variant="secondary">Consumer</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Member Since</h4>
                <p className="text-sm text-muted-foreground">
                  Your account creation date
                </p>
              </div>
              <span className="text-sm">January 2024</span>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Store className="h-6 w-6 text-primary" />
                <div>
                  <h4 className="font-medium">Become a Vendor</h4>
                  <p className="text-sm text-muted-foreground">
                    Start selling your products on our platform
                  </p>
                </div>
              </div>
              <Link to="/vendor/register" className="mt-3 inline-block">
                <Button variant="outline">
                  Apply to Become a Vendor
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Delete Account</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsumerProfile;