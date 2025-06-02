
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";
import { WeFulFilProduct } from "@/types/wefullfil";

interface WeFulFilProductTableProps {
  products: WeFulFilProduct[];
  selectedProducts: Record<string, boolean>;
  importing: Record<string, boolean>;
  onSelectProduct: (productId: string, checked: boolean) => void;
  onImport: (product: WeFulFilProduct) => void;
}

export const WeFulFilProductTable: React.FC<WeFulFilProductTableProps> = ({
  products,
  selectedProducts,
  importing,
  onSelectProduct,
  onImport,
}) => {
  return (
    <Table>
      <TableCaption>WeFulFil Products Catalog</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Product</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Inventory</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length > 0 ? (
          products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Checkbox
                  checked={!!selectedProducts[product.id]}
                  onCheckedChange={(checked) => onSelectProduct(product.id, !!checked)}
                  disabled={product.inventory_quantity <= 0}
                />
              </TableCell>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>
                <Badge variant={product.inventory_quantity > 0 ? "default" : "destructive"}>
                  {product.inventory_quantity > 0 ? `In Stock (${product.inventory_quantity})` : "Out of Stock"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={importing[product.id] || product.inventory_quantity <= 0}
                  onClick={() => onImport(product)}
                >
                  {importing[product.id] ? "Importing..." : "Import"}
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              No products found. Try a different search term.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
