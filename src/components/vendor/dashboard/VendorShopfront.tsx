import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storeData, setStoreData] = useState<any>(null);
  const [vendorData, setVendorData] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo_url: "",
    banner_url: "",
    shipping_policy: "",
    return_policy: "",
  });

  useEffect(() => {
    fetchStoreData();
  }, [user?.id]);

  const fetchStoreData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // First get vendor data
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (vendorError) throw vendorError;
      setVendorData(vendor);

      // Then get store data
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('vendor_id', vendor.id)
        .maybeSingle();

      if (storeError && storeError.code !== 'PGRST116') throw storeError;

      if (store) {
        setStoreData(store);
        setFormData({
          name: store.name || "",
          description: store.description || "",
          logo_url: store.logo_url || "",
          banner_url: store.banner_url || "",
          shipping_policy: store.shipping_policy || "",
          return_policy: store.return_policy || "",
        });
      }
    } catch (error) {
      console.error('Error fetching store data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load store data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!vendorData?.id) return;

    try {
      setSaving(true);

      if (storeData) {
        // Update existing store
        const { error } = await supabase
          .from('stores')
          .update({
            name: formData.name,
            description: formData.description,
            logo_url: formData.logo_url,
            banner_url: formData.banner_url,
            shipping_policy: formData.shipping_policy,
            return_policy: formData.return_policy,
          })
          .eq('id', storeData.id);

        if (error) throw error;
      } else {
        // Create new store
        const { data: newStore, error } = await supabase
          .from('stores')
          .insert({
            vendor_id: vendorData.id,
            name: formData.name,
            slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            description: formData.description,
            logo_url: formData.logo_url,
            banner_url: formData.banner_url,
            shipping_policy: formData.shipping_policy,
            return_policy: formData.return_policy,
          })
          .select()
          .single();

        if (error) throw error;
        setStoreData(newStore);
      }

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Store information saved successfully",
      });
    } catch (error) {
      console.error('Error saving store data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save store data",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (storeData) {
      setFormData({
        name: storeData.name || "",
        description: storeData.description || "",
        logo_url: storeData.logo_url || "",
        banner_url: storeData.banner_url || "",
        shipping_policy: storeData.shipping_policy || "",
        return_policy: storeData.return_policy || "",
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return <div>Loading store data...</div>;
  }

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
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
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
                src={formData.banner_url || "/api/placeholder/800/300"} 
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
                  <AvatarImage src={formData.logo_url || ""} alt="Shop logo" />
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
                value={formData.name}
                disabled={!isEditing}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Shop Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              disabled={!isEditing}
              rows={4}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your shop and what makes it special..."
            />
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
              value={formData.shipping_policy}
              disabled={!isEditing}
              rows={2}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                shipping_policy: e.target.value
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnsPolicy">Returns Policy</Label>
            <Textarea
              id="returnsPolicy"
              value={formData.return_policy}
              disabled={!isEditing}
              rows={2}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                return_policy: e.target.value
              }))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorShopfront;