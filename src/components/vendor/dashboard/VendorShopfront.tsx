import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Camera, 
  MapPin, 
  Clock, 
  Star, 
  Edit3, 
  Save, 
  X,
  Store,
  Globe,
  Phone,
  Mail
} from "lucide-react";

const VendorShopfront = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock shop data - in real app, this would come from API
  const [shopData, setShopData] = useState({
    name: "Premium Electronics Store",
    description: "Your trusted partner for high-quality electronics and gadgets. We offer the latest technology products with excellent customer service and competitive prices.",
    logo: "/api/placeholder/120/120",
    banner: "/api/placeholder/800/300",
    location: "New York, NY",
    phone: "+1 (555) 123-4567",
    email: "contact@premiumelectronics.com",
    website: "www.premiumelectronics.com",
    businessHours: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM",
    rating: 4.8,
    totalReviews: 2847,
    established: "2018",
    categories: ["Electronics", "Gadgets", "Accessories"],
    policies: {
      shipping: "Free shipping on orders over $50. Same-day delivery available in NYC.",
      returns: "30-day return policy. Items must be in original condition.",
      warranty: "1-year warranty on all electronics. Extended warranty available."
    }
  });

  const handleSave = () => {
    // In real app, save to API
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset changes in real app
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Shop Frontend</h2>
          <p className="text-muted-foreground">Manage your store's public appearance</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Shop
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Shop Banner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Shop Banner & Logo
          </CardTitle>
          <CardDescription>
            Your shop's visual identity shown to customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Banner Image */}
          <div className="space-y-2">
            <Label>Banner Image (1200x400px recommended)</Label>
            <div className="relative h-48 w-full bg-muted rounded-lg overflow-hidden border-2 border-dashed border-border">
              <img 
                src={shopData.banner} 
                alt="Shop banner"
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Button variant="secondary" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Banner
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Logo */}
          <div className="space-y-2">
            <Label>Shop Logo</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={shopData.logo} alt="Shop logo" />
                  <AvatarFallback>
                    <Store className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Square format recommended (200x200px minimum)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Core details about your shop
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name</Label>
              <Input
                id="shopName"
                value={shopData.name}
                disabled={!isEditing}
                onChange={(e) => setShopData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={shopData.location}
                  disabled={!isEditing}
                  className="pl-10"
                  onChange={(e) => setShopData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Shop Description</Label>
            <Textarea
              id="description"
              value={shopData.description}
              disabled={!isEditing}
              rows={4}
              onChange={(e) => setShopData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your shop and what makes it special..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            How customers can reach you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={shopData.phone}
                  disabled={!isEditing}
                  className="pl-10"
                  onChange={(e) => setShopData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={shopData.email}
                  disabled={!isEditing}
                  className="pl-10"
                  onChange={(e) => setShopData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  value={shopData.website}
                  disabled={!isEditing}
                  className="pl-10"
                  onChange={(e) => setShopData(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Business Hours</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="hours"
                  value={shopData.businessHours}
                  disabled={!isEditing}
                  className="pl-10"
                  onChange={(e) => setShopData(prev => ({ ...prev, businessHours: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shop Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Shop Performance</CardTitle>
          <CardDescription>
            Current shop statistics and ratings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="h-5 w-5 fill-current text-yellow-500" />
                <span className="text-2xl font-bold">{shopData.rating}</span>
              </div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold mb-2">{shopData.totalReviews.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold mb-2">{shopData.established}</div>
              <p className="text-sm text-muted-foreground">Established</p>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold mb-2">{shopData.categories.length}</div>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <Label>Shop Categories</Label>
            <div className="flex flex-wrap gap-2">
              {shopData.categories.map((category, index) => (
                <Badge key={index} variant="secondary">
                  {category}
                </Badge>
              ))}
              {isEditing && (
                <Button variant="outline" size="sm">
                  Add Category
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shop Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Shop Policies</CardTitle>
          <CardDescription>
            Terms and policies shown to customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shippingPolicy">Shipping Policy</Label>
            <Textarea
              id="shippingPolicy"
              value={shopData.policies.shipping}
              disabled={!isEditing}
              rows={2}
              onChange={(e) => setShopData(prev => ({ 
                ...prev, 
                policies: { ...prev.policies, shipping: e.target.value }
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnsPolicy">Returns Policy</Label>
            <Textarea
              id="returnsPolicy"
              value={shopData.policies.returns}
              disabled={!isEditing}
              rows={2}
              onChange={(e) => setShopData(prev => ({ 
                ...prev, 
                policies: { ...prev.policies, returns: e.target.value }
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="warrantyPolicy">Warranty Policy</Label>
            <Textarea
              id="warrantyPolicy"
              value={shopData.policies.warranty}
              disabled={!isEditing}
              rows={2}
              onChange={(e) => setShopData(prev => ({ 
                ...prev, 
                policies: { ...prev.policies, warranty: e.target.value }
              }))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorShopfront;