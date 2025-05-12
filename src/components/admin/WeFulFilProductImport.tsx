import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchWeFulFilProducts, 
  importWeFulFilProductToAdmin,
  importMultipleWeFulFilProducts,
  fetchStoredWeFulFilProducts
} from "@/services/wefullfil";
import { WeFulFilProduct, WeFulFilProductFilter, WeFulFilPagination, WeFulFilStoredProduct } from "@/types/wefullfil";
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
import { Search, Package, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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

  // State for stored products
  const [storedPage, setStoredPage] = useState(1);
  const [storedSearchQuery, setStoredSearchQuery] = useState("");
  const [storedProducts, setStoredProducts] = useState<WeFulFilStoredProduct[]>([]);
  const [storedProductsCount, setStoredProductsCount] = useState(0);
  const [storedProductsLoading, setStoredProductsLoading] = useState(false);
  
  const { toast } = useToast();

  const apiQuery = useQuery({
    queryKey: ['wefullfil-api-products', filters],
    queryFn: () => fetchWeFulFilProducts({ ...filters, search: searchQuery }),
    enabled: false, // Don't fetch on mount
  });

  // Load stored products from the database
  useEffect(() => {
    const loadStoredProducts = async () => {
      setStoredProductsLoading(true);
      try {
        const { data, count } = await fetchStoredWeFulFilProducts(storedPage, 10, storedSearchQuery);
        setStoredProducts(data);
        setStoredProductsCount(count);
      } catch (error) {
        console.error("Error loading stored products:", error);
        toast({
          title: "Error Loading Products",
          description: `Failed to load imported products: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive",
        });
      } finally {
        setStoredProductsLoading(false);
      }
    };

    loadStoredProducts();
  }, [storedPage, storedSearchQuery, toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 })); // Reset to page 1 when searching
    apiQuery.refetch();
  };

  const handleStoredSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredPage(1); // Reset to page 1 when searching
  };

  const handleImport = async (product: WeFulFilProduct) => {
    setImporting(prev => ({ ...prev, [product.id]: true }));
    
    try {
      const importedProduct = await importWeFulFilProductToAdmin(product);
      
      toast({
        title: "Product Imported",
        description: `${product.title} has been added to your products.`,
      });
      
      // Refresh the stored products list
      const { data, count } = await fetchStoredWeFulFilProducts(storedPage, 10, storedSearchQuery);
      setStoredProducts(data);
      setStoredProductsCount(count);
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
      const productsToImport = apiQuery.data?.data.filter(product => 
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
      
      // Refresh the stored products list
      const { data, count } = await fetchStoredWeFulFilProducts(storedPage, 10, storedSearchQuery);
      setStoredProducts(data);
      setStoredProductsCount(count);
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
    if (!apiQuery.data?.data) return;
    
    const newSelected: Record<string, boolean> = {};
    apiQuery.data.data.forEach(product => {
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
    apiQuery.refetch();
  };

  const handleStoredPageChange = (page: number) => {
    setStoredPage(page);
  };

  const handleSortChange = (value: string) => {
    let [sort_by, sort_order] = value.split('-') as [WeFulFilProductFilter['sort_by'], WeFulFilProductFilter['sort_order']];
    setFilters(prev => ({ ...prev, sort_by, sort_order }));
    apiQuery.refetch();
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
  
  // Generate pagination for stored products
  const renderStoredPaginationItems = () => {
    const totalPages = Math.ceil(storedProductsCount / 10);
    const currentPage = storedPage;
    
    if (totalPages <= 1) return null;
    
    const pageItems = [];
    
    // Always show first page
    pageItems.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => handleStoredPageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Add ellipsis if needed
    if (currentPage > 3) {
      pageItems.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Add previous page if not first or second page
    if (currentPage > 2) {
      pageItems.push(
        <PaginationItem key={currentPage - 1}>
          <PaginationLink onClick={() => handleStoredPageChange(currentPage - 1)}>
            {currentPage - 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add current page if not first
    if (currentPage !== 1) {
      pageItems.push(
        <PaginationItem key={currentPage}>
          <PaginationLink 
            onClick={() => handleStoredPageChange(currentPage)}
            isActive={true}
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add next page if not last
    if (currentPage < totalPages - 1) {
      pageItems.push(
        <PaginationItem key={currentPage + 1}>
          <PaginationLink onClick={() => handleStoredPageChange(currentPage + 1)}>
            {currentPage + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      pageItems.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if not first
    if (totalPages > 1) {
      pageItems.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => handleStoredPageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
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

        <Tabs defaultValue="api-search">
          <TabsList className="mb-4">
            <TabsTrigger value="api-search">API Search</TabsTrigger>
            <TabsTrigger value="imported">Imported Products</TabsTrigger>
          </TabsList>

          <TabsContent value="api-search">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Search WeFulFil API</CardTitle>
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
                  {apiQuery.data && (
                    <span className="text-sm text-gray-500">
                      Showing {apiQuery.data.meta.pagination.count} of {apiQuery.data.meta.pagination.total} products
                    </span>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => apiQuery.refetch()}
                  disabled={apiQuery.isLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Results
                </Button>
              </CardFooter>
            </Card>

            {apiQuery.isLoading && (
              <div className="flex justify-center my-8">
                <p className="text-center">Loading products...</p>
              </div>
            )}

            {apiQuery.error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
                <p className="font-medium">Error loading products</p>
                <p className="text-sm">{apiQuery.error instanceof Error ? apiQuery.error.message : 'Unknown error occurred'}</p>
                <Button 
                  variant="outline" 
                  onClick={() => apiQuery.refetch()} 
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            )}

            {apiQuery.data && apiQuery.data.data && (
              <>
                <div className="bg-gray-50 p-4 rounded-md mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox 
                      id="select-all"
                      checked={apiQuery.data.data.length > 0 && selectedCount === apiQuery.data.data.length}
                      onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    />
                    <label htmlFor="select-all" className="ml-2 text-sm font-medium">
                      Select All ({selectedCount} of {apiQuery.data.data.length} selected)
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
                    {apiQuery.data.data.length > 0 ? (
                      apiQuery.data.data.map((product) => (
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
                
                {apiQuery.data.meta.pagination.total_pages > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, filters.page! - 1))}
                          isActive={false}
                          className={filters.page === 1 ? "opacity-50 cursor-not-allowed" : ""}
                        />
                      </PaginationItem>
                      
                      {renderPaginationItems(apiQuery.data.meta.pagination)}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(apiQuery.data.meta.pagination.total_pages, filters.page! + 1))}
                          isActive={false}
                          className={filters.page === apiQuery.data.meta.pagination.total_pages ? "opacity-50 cursor-not-allowed" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}

            {!apiQuery.data && !apiQuery.isLoading && !apiQuery.error && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Search for Products</h3>
                <p className="text-gray-600 mb-4">
                  Enter a search term above to find products in the WeFulFil catalog.
                </p>
                <Button onClick={() => apiQuery.refetch()}>
                  Search All Products
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="imported">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Imported Products</CardTitle>
                <CardDescription>
                  View and manage products imported from WeFulFil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStoredSearch} className="flex gap-2 mb-4">
                  <Input
                    type="text"
                    placeholder="Search imported products..."
                    value={storedSearchQuery}
                    onChange={(e) => setStoredSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" className="bg-wwe-navy hover:bg-wwe-navy/90">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <span className="text-sm text-gray-500">
                  {storedProductsCount} total products imported from WeFulFil
                </span>
              </CardFooter>
            </Card>

            {storedProductsLoading && (
              <div className="flex justify-center my-8">
                <p className="text-center">Loading imported products...</p>
              </div>
            )}

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
                {storedProducts.length > 0 ? (
                  storedProducts.map((product) => (
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
                      {storedSearchQuery ? "No products match your search." : "No products have been imported yet."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {storedProductsCount > 10 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handleStoredPageChange(Math.max(1, storedPage - 1))}
                      isActive={false}
                      className={storedPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                    />
                  </PaginationItem>
                  
                  {renderStoredPaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handleStoredPageChange(Math.min(Math.ceil(storedProductsCount / 10), storedPage + 1))}
                      isActive={false}
                      className={storedPage === Math.ceil(storedProductsCount / 10) ? "opacity-50 cursor-not-allowed" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WeFulFilProductImport;
