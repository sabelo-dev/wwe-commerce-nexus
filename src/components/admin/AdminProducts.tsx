
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminProduct } from "@/types/admin";
import WeFulFilProductImport from "./WeFulFilProductImport";

// Mock data for demonstration
const mockProducts: AdminProduct[] = [
  {
    id: "p1",
    name: "Wireless Headphones",
    vendorName: "Tech Shop",
    price: 1299.99,
    status: "approved",
    category: "Electronics",
    dateAdded: "2023-05-10",
    storeId: "store1",
  },
  {
    id: "p2",
    name: "Summer Dress",
    vendorName: "Fashion Boutique",
    price: 599.99,
    status: "pending",
    category: "Clothing",
    dateAdded: "2023-06-15",
    storeId: "store2",
  },
  {
    id: "p3",
    name: "Organic Honey",
    vendorName: "Organic Foods",
    price: 149.99,
    status: "rejected",
    category: "Food",
    dateAdded: "2023-06-20",
    storeId: "store3",
  },
];

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>(mockProducts);
  const { toast } = useToast();

  const handleUpdateProductStatus = (
    productId: string,
    newStatus: "approved" | "rejected"
  ) => {
    // In a real app, this would be an API call
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
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Product Management</h2>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-4">
          <TabsTrigger value="products">My Products</TabsTrigger>
          <TabsTrigger value="import">Import from WeFulFil</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
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
                  <TableCell>{product.vendorName}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
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
                  <TableCell>{product.dateAdded}</TableCell>
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
        </TabsContent>

        <TabsContent value="import">
          <WeFulFilProductImport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProducts;
