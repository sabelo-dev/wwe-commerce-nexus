
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchWeFulFilProducts, 
  importWeFulFilProductToAdmin,
  importMultipleWeFulFilProducts
} from "@/services/wefullfil";
import { WeFulFilProduct, WeFulFilProductFilter, WeFulFilPagination } from "@/types/wefullfil";
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
import { Search, Package, ArrowLeft, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { AdminProduct } from "@/types/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WeFulFilProductImport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [importing, setImporting] = useState<Record<string, boolean>>({});
  const [bulkImporting, setBulkImporting] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState<WeFulFilProductFilter>({
    page: 1,
    per_page: 10,
    sort_by: "title",
    sort_order: "asc",
  });
  
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['wefullfil-products', filters],
    queryFn: () => fetchWeFulFilProducts({ ...filters, search: searchQuery }),
    enabled: false, // Don't fetch on mount
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 })); // Reset to page 1 when searching
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

  const handleBulkImport = async () => {
    const selectedProductIds = Object.keys(selectedProducts).filter(id => selectedProducts[id]);
    
    if (selectedProductIds.length === 0) {
      toast({
        title: "No Products Selected",
        description: "Please select at least one product to import.",
        variant: "destructive",
      });
      return;
    }
    
    setBulkImporting(true);
    
    try {
      const productsToImport = data?.data.filter(product => 
        selectedProducts[product.id] && product.inventory_quantity > 0
      ) || [];
      
      if (productsToImport.length === 0) {
        toast({
          title: "No Valid Products",
          description: "Selected products are out of stock.",
          variant: "destructive",
        });
        return;
      }
      
      const importedProducts = await importMultipleWeFulFilProducts(productsToImport);
      
      toast({
        title: "Products Imported",
        description: `Successfully imported ${importedProducts.length} products.`,
      });
      
      // Clear selection after successful import
      setSelectedProducts({});
    } catch (error) {
      toast({
        title: "Bulk Import Failed",
        description: `Failed to import products: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setBulkImporting(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!data?.data) return;
    
    const newSelected: Record<string, boolean> = {};
    data.data.forEach(product => {
      newSelected[product.id] = checked;
    });
    setSelectedProducts(newSelected);
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: checked,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    refetch();
  };

  const handleSortChange = (value: string) => {
    let [sort_by, sort_order] = value.split('-') as [WeFulFilProductFilter['sort_by'], WeFulFilProductFilter['sort_order']];
    setFilters(prev => ({ ...prev, sort_by, sort_order }));
    refetch();
  };

  // Generate pagination numbers
  const renderPaginationItems = (pagination?: WeFulFilPagination) => {
    if (!pagination) return null;
    
    const { current_page, total_pages } = pagination;
    const pageItems = [];
    
    // Always show first page
    pageItems.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => handlePageChange(1)}
          isActive={current_page === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Add ellipsis if needed
    if (current_page > 3) {
      pageItems.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Add previous page if not first or second page
    if (current_page > 2) {
      pageItems.push(
        <PaginationItem key={current_page - 1}>
          <PaginationLink onClick={() => handlePageChange(current_page - 1)}>
            {current_page - 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add current page if not first
    if (current_page !== 1) {
      pageItems.push(
        <PaginationItem key={current_page}>
          <PaginationLink 
            onClick={() => handlePageChange(current_page)}
            isActive={true}
          >
            {current_page}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add next page if not last
    if (current_page < total_pages - 1) {
      pageItems.push(
        <PaginationItem key={current_page + 1}>
          <PaginationLink onClick={() => handlePageChange(current_page + 1)}>
            {current_page + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis if needed
    if (current_page < total_pages - 2) {
      pageItems.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if not first
    if (total_pages > 1) {
      pageItems.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => handlePageChange(total_pages)}
            isActive={current_page === total_pages}
          >
            {total_pages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pageItems;
  };

  const selectedCount = Object.values(selectedProducts).filter(Boolean).length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">WeFulFil Product Import</h2>
        <p className="text-gray-600 mb-4">
          Search and import products directly from WeFulFil catalog into your store.
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Options</CardTitle>
            <CardDescription>
              Find products by title, SKU, or categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
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
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label htmlFor="sort" className="block text-sm font-medium mb-1">
                  Sort By
                </label>
                <Select 
                  onValueChange={handleSortChange} 
                  defaultValue={`${filters.sort_by}-${filters.sort_order}`}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                    <SelectItem value="price-asc">Price (Low-High)</SelectItem>
                    <SelectItem value="price-desc">Price (High-Low)</SelectItem>
                    <SelectItem value="created_at-desc">Newest First</SelectItem>
                    <SelectItem value="created_at-asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <div>
              {data && (
                <span className="text-sm text-gray-500">
                  Showing {data.meta.pagination.count} of {data.meta.pagination.total} products
                </span>
              )}
            </div>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              disabled={isLoading}
            >
              Refresh Results
            </Button>
          </CardFooter>
        </Card>
      </div>

      {isLoading && (
        <div className="flex justify-center my-8">
          <p className="text-center">Loading products...</p>
        </div>
      )}

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
        <>
          <div className="bg-gray-50 p-4 rounded-md mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox 
                id="select-all"
                checked={data.data.length > 0 && selectedCount === data.data.length}
                onCheckedChange={(checked) => handleSelectAll(!!checked)}
              />
              <label htmlFor="select-all" className="ml-2 text-sm font-medium">
                Select All ({selectedCount} of {data.data.length} selected)
              </label>
            </div>
            
            <Button 
              onClick={handleBulkImport} 
              disabled={selectedCount === 0 || bulkImporting}
              variant="default"
            >
              <Package className="h-4 w-4 mr-2" />
              {bulkImporting ? `Importing ${selectedCount} Products...` : `Import Selected (${selectedCount})`}
            </Button>
          </div>
          
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
              {data.data.length > 0 ? (
                data.data.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={!!selectedProducts[product.id]}
                        onCheckedChange={(checked) => handleSelectProduct(product.id, !!checked)}
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
                        onClick={() => handleImport(product)}
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
          
          {data.meta.pagination.total_pages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, filters.page! - 1))}
                    isActive={false}
                    className={filters.page === 1 ? "opacity-50 cursor-not-allowed" : ""}
                  />
                </PaginationItem>
                
                {renderPaginationItems(data.meta.pagination)}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(data.meta.pagination.total_pages, filters.page! + 1))}
                    isActive={false}
                    className={filters.page === data.meta.pagination.total_pages ? "opacity-50 cursor-not-allowed" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
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
