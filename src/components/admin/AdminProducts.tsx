
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface AdminProduct {
  id: string;
  name: string;
  price: number;
  status: "pending" | "approved" | "rejected";
  category: string;
  created_at: string;
  store_id: string;
  store_name?: string;
  vendor_business_name?: string;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // First, get basic product data
        const { data: basicData, error: basicError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (basicError) throw basicError;

        // Then get store and vendor info for each product
        const productsWithDetails = await Promise.all(
          (basicData || []).map(async (product) => {
            let storeName = 'Unknown Store';
            let vendorBusinessName = 'Unknown Vendor';

            if (product.store_id) {
              const { data: storeData } = await supabase
                .from('stores')
                .select(`
                  name,
                  vendors(business_name)
                `)
                .eq('id', product.store_id)
                .single();

              if (storeData) {
                storeName = storeData.name || 'Unknown Store';
                if (storeData.vendors && Array.isArray(storeData.vendors) && storeData.vendors[0]) {
                  vendorBusinessName = storeData.vendors[0].business_name || 'Unknown Vendor';
                } else if (storeData.vendors && !Array.isArray(storeData.vendors)) {
                  vendorBusinessName = (storeData.vendors as any).business_name || 'Unknown Vendor';
                }
              }
            }

            return {
              ...product,
              status: product.status as "pending" | "approved" | "rejected",
              store_name: storeName,
              vendor_business_name: vendorBusinessName
            };
          })
        );

        setProducts(productsWithDetails);
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

    fetchProducts();
  }, []);

  const handleUpdateProductStatus = async (
    productId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', productId);

      if (error) throw error;

      setProducts(
        products.map((product) =>
          product.id === productId
            ? { ...product, status: newStatus }
            : product
        )
      );

      toast({
        title: "Product status updated",
        description: `Product has been ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating product status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product status.",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Product Management</h2>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : (
        <Table>
          <TableCaption>List of all products</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.vendor_business_name || 'N/A'}</TableCell>
                <TableCell>R{(product.price || 0).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product.status === "approved"
                        ? "default"
                        : product.status === "rejected"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(product.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {product.status === "pending" && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            handleUpdateProductStatus(product.id, "approved")
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleUpdateProductStatus(product.id, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {product.status !== "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleUpdateProductStatus(
                            product.id,
                            product.status === "approved" ? "rejected" : "approved"
                          )
                        }
                      >
                        {product.status === "approved" ? "Unpublish" : "Publish"}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminProducts;
