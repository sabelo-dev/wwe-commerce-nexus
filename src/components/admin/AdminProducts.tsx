
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
  stores?: {
    name: string;
    vendors?: {
      business_name: string;
    };
  };
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: productsData, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            price,
            status,
            category,
            created_at,
            store_id,
            stores!inner(
              name,
              vendors!inner(
                business_name
              )
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setProducts((productsData || []).map(p => ({
          ...p,
          status: p.status as "pending" | "approved" | "rejected"
        })));
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
                <TableCell>{product.stores?.vendors?.business_name || 'N/A'}</TableCell>
                <TableCell>R{product.price.toFixed(2)}</TableCell>
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
