
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ProductFormModal from "./ProductFormModal";
import ProductViewModal from "./ProductViewModal";

const VendorProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch vendor products from database
  const fetchProducts = async () => {
    if (!user?.id) return;

    try {
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(id, image_url, position),
          stores!inner(vendor_id, vendors!inner(user_id))
        `)
        .eq('stores.vendors.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user?.id]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setFormMode("add");
    setShowFormModal(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setFormMode("edit");
    setShowFormModal(true);
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleDeleteProduct = (product: any) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      // Delete product images from storage first
      const { data: images } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', productToDelete.id);

      if (images) {
        for (const image of images) {
          const path = image.image_url.split('/').pop();
          if (path) {
            await supabase.storage
              .from('product-images')
              .remove([`${productToDelete.id}/${path}`]);
          }
        }
      }

      // Delete product images records
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productToDelete.id);

      // Delete product variations
      await supabase
        .from('product_variations')
        .delete()
        .eq('product_id', productToDelete.id);

      // Delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productToDelete.id));
      toast({
        title: "Product Deleted",
        description: "Product has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product.",
      });
    } finally {
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    fetchProducts();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your product inventory and listings.
          </p>
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No products found. Add your first product to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <img 
                      src={
                        product.product_images?.[0]?.image_url || 
                        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
                      } 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="space-y-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        SKU: {product.sku || 'N/A'}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{product.category}</Badge>
                        <Badge 
                          variant={
                            product.status === "approved" || product.status === "active" ? "default" :
                            product.quantity === 0 ? "destructive" :
                            "outline"
                          }
                        >
                          {product.quantity === 0 ? "Out of Stock" : 
                           product.status === "approved" ? "Active" : product.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">R{product.price}</p>
                      <p className="text-sm text-muted-foreground">
                        Stock: {product.quantity || 0}
                      </p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ProductFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSuccess={handleFormSuccess}
        product={selectedProduct}
        mode={formMode}
      />

      <ProductViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        onEdit={() => {
          setShowViewModal(false);
          handleEditProduct(selectedProduct);
        }}
        product={selectedProduct}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone and will remove all associated images.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VendorProducts;
