
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { WeFulFilStoredProduct } from "@/types/wefullfil";

interface StoredProductsTableProps {
  products: WeFulFilStoredProduct[];
  searchQuery: string;
}

export const StoredProductsTable: React.FC<StoredProductsTableProps> = ({
  products,
  searchQuery,
}) => {
  return (
    <Table>
      <TableCaption>Imported WeFulFil Products</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Inventory</TableHead>
          <TableHead>Import Status</TableHead>
          <TableHead>Imported At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length > 0 ? (
          products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>
                <Badge variant={product.inventory_quantity > 0 ? "default" : "destructive"}>
                  {product.inventory_quantity > 0 ? `In Stock (${product.inventory_quantity})` : "Out of Stock"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    product.import_status === 'imported' ? "default" :
                    product.import_status === 'failed' ? "destructive" :
                    "outline"
                  }
                >
                  {product.import_status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(product.imported_at).toLocaleString()}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              {searchQuery ? "No products match your search." : "No products have been imported yet."}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
