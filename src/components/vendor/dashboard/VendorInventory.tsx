
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Package, 
  Search, 
  AlertTriangle, 
  Plus,
  Minus,
  RotateCcw,
  Download,
  Upload
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const VendorInventory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [user?.id]);

  const fetchProducts = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Get vendor data first
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (vendorError) throw vendorError;

      // Get stores for this vendor
      const { data: stores, error: storesError } = await supabase
        .from('stores')
        .select('id')
        .eq('vendor_id', vendor.id);

      if (storesError) throw storesError;

      if (stores.length === 0) {
        setProducts([]);
        return;
      }

      const storeIds = stores.map(store => store.id);

      // Get products from all vendor stores
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('store_id', storeIds)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch products",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return;

    try {
      setUpdating(productId);
      
      const { error } = await supabase
        .from('products')
        .update({ quantity: newQuantity })
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === productId ? { ...p, quantity: newQuantity } : p
      ));

      toast({
        title: "Stock updated",
        description: "Product inventory has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update stock",
      });
    } finally {
      setUpdating(null);
    }
  };

  const filteredProducts = products.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (stock: number, lowStockThreshold = 10) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stock <= lowStockThreshold) {
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Low Stock</Badge>;
    } else {
      return <Badge variant="default">In Stock</Badge>;
    }
  };

  const lowStockCount = products.filter(item => item.quantity <= 10 && item.quantity > 0).length;
  const outOfStockCount = products.filter(item => item.quantity === 0).length;

  if (loading) {
    return <div>Loading inventory...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage your product inventory levels.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Inventory Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              Products in inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">
              Products need restocking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">
              Products unavailable
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            Current stock levels and alerts for all products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        item.quantity === 0 ? 'text-red-600' :
                        item.quantity <= 10 ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {item.quantity}
                      </span>
                      <span className="text-muted-foreground">units</span>
                    </div>
                  </TableCell>
                  <TableCell>10</TableCell>
                  <TableCell>
                    {getStatusBadge(item.quantity, 10)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(item.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={updating === item.id}
                        onClick={() => updateStock(item.id, Math.max(0, item.quantity - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input 
                        type="number" 
                        value={item.quantity}
                        className="w-16 h-8 text-center"
                        min="0"
                        disabled={updating === item.id}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value) || 0;
                          updateStock(item.id, newValue);
                        }}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={updating === item.id}
                        onClick={() => updateStock(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
          <CardDescription>
            Perform actions on multiple products at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Auto-Restock Settings</h4>
              <p className="text-sm text-muted-foreground">
                Automatically reorder when stock falls below threshold
              </p>
              <Button variant="outline" size="sm">
                Configure Auto-Restock
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Stock Alerts</h4>
              <p className="text-sm text-muted-foreground">
                Get notified when products are running low
              </p>
              <Button variant="outline" size="sm">
                Notification Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorInventory;
