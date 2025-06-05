
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Package, MapPin, CreditCard, Settings, Store } from "lucide-react";
import { Navigate, Link } from "react-router-dom";

const AccountPage: React.FC = () => {
  const { user, isVendor } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Mock order data
  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "Delivered",
      total: "R1,299.99",
      items: 3
    },
    {
      id: "ORD-002", 
      date: "2024-01-10",
      status: "Processing",
      total: "R599.50",
      items: 1
    }
  ];

  // Mock addresses
  const addresses = [
    {
      id: 1,
      type: "Home",
      name: "John Doe",
      street: "123 Main Street",
      city: "Cape Town",
      province: "Western Cape",
      postal: "8001",
      isDefault: true
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="wwe-container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-wwe-navy mb-2">My Account</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-wwe-navy rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-white" />
                </div>
                <CardTitle>{user.name || user.email}</CardTitle>
                <CardDescription>
                  <Badge variant={user.role === 'vendor' ? 'default' : 'secondary'}>
                    {user.role === 'vendor' ? 'Vendor' : 'Consumer'}
                  </Badge>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="addresses" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Addresses
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.name || ""} />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue={user.email} disabled />
                      </div>
                    </div>
                    
                    {user.role === 'consumer' && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-3">
                          <Store className="h-6 w-6 text-blue-600" />
                          <div>
                            <h3 className="font-semibold text-blue-900">Become a Vendor</h3>
                            <p className="text-blue-700 text-sm">Start selling your products on our platform</p>
                          </div>
                        </div>
                        <Link to="/vendor/register" className="mt-3 inline-block">
                          <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                            Apply Now
                          </Button>
                        </Link>
                      </div>
                    )}
                    
                    <Button className="bg-wwe-navy hover:bg-wwe-navy/90">
                      Update Profile
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                      View and track your recent orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                              <h3 className="font-semibold">Order {order.id}</h3>
                              <p className="text-sm text-gray-600">
                                {order.date} • {order.items} item(s)
                              </p>
                            </div>
                            <div className="mt-2 md:mt-0 flex items-center gap-4">
                              <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>
                                {order.status}
                              </Badge>
                              <span className="font-semibold">{order.total}</span>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Shipping Addresses</CardTitle>
                        <CardDescription>
                          Manage your shipping and billing addresses
                        </CardDescription>
                      </div>
                      <Button className="bg-wwe-navy hover:bg-wwe-navy/90">
                        Add Address
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{address.type}</h3>
                                {address.isDefault && (
                                  <Badge variant="outline">Default</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {address.name}<br/>
                                {address.street}<br/>
                                {address.city}, {address.province} {address.postal}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="outline" size="sm">Delete</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Password & Security</CardTitle>
                      <CardDescription>
                        Update your password and security settings
                      </CardDescription>
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
                      <Button className="bg-wwe-navy hover:bg-wwe-navy/90">
                        Update Password
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>
                        Manage your email and notification preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Order Updates</h4>
                          <p className="text-sm text-gray-600">Get notified about order status changes</p>
                        </div>
                        <input type="checkbox" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Promotions</h4>
                          <p className="text-sm text-gray-600">Receive promotional emails and offers</p>
                        </div>
                        <input type="checkbox" defaultChecked />
                      </div>
                      <Button className="bg-wwe-navy hover:bg-wwe-navy/90">
                        Save Preferences
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
