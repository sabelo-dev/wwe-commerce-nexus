
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchWeFulFilProducts, importWeFulFilProductToAdmin } from "@/services/wefullfil";
import { WeFulFilProduct } from "@/types/wefullfil";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { AdminProduct } from "@/types/admin";

const WeFulFilProductImport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [importing, setImporting] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['wefullfil-products', searchQuery],
    queryFn: () => fetchWeFulFilProducts(searchQuery),
    enabled: false, // Don't fetch on mount
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleImport = async (product: WeFulFilProduct) => {
    setImporting(prev => ({ ...prev, [product.id]: true }));
    
    try {
      const importedProduct = await importWeFulFilProductToAdmin(product);
      
      toast({
        title: "Product Imported",
        description: `${product.title} has been added to your products.`,
      });
      
      // In a real app, you might want to update your products list
    } catch (error) {
      toast({
        title: "Import Failed",
        description: `Failed to import product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setImporting(prev => ({ ...prev, [product.id]: false }));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">WeFulFil Product Import</h2>
        <p className="text-gray-600 mb-4">
          Search and import products directly from WeFulFil catalog into your store.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Search for products by title or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="bg-wwe-navy hover:bg-wwe-navy/90">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      {isLoading && <p>Loading products...</p>}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
          <p className="font-medium">Error loading products</p>
          <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
          <Button 
            variant="outline" 
            onClick={() => refetch()} 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {data && data.data && (
        <Table>
          <TableCaption>WeFulFil Products Catalog</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.length > 0 ? (
              data.data.map((product) => (
                <TableRow key={product.id}>
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
                      onClick={() => handleImport(product)}
                    >
                      {importing[product.id] ? "Importing..." : "Import"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No products found. Try a different search term.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {!data && !isLoading && !error && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Search for Products</h3>
          <p className="text-gray-600 mb-4">
            Enter a search term above to find products in the WeFulFil catalog.
          </p>
        </div>
      )}
    </div>
  );
};

export default WeFulFilProductImport;
