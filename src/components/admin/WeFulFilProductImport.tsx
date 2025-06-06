
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchWeFulFilProducts, 
  importWeFulFilProductToAdmin,
  importMultipleWeFulFilProducts,
  fetchStoredWeFulFilProducts,
  clearWeFulFilCache
} from "@/services/wefullfil";
import { WeFulFilProduct, WeFulFilProductFilter, WeFulFilStoredProduct } from "@/types/wefullfil";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
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
import { WeFulFilSearchForm } from "./wefullfil/WeFulFilSearchForm";
import { WeFulFilImportControls } from "./wefullfil/WeFulFilImportControls";
import { WeFulFilProductTable } from "./wefullfil/WeFulFilProductTable";
import { WeFulFilPagination } from "./wefullfil/WeFulFilPagination";
import { StoredProductsTable } from "./wefullfil/StoredProductsTable";
import { StoredProductsPagination } from "./wefullfil/StoredProductsPagination";

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

  // State for stored products with optimized updates
  const [storedPage, setStoredPage] = useState(1);
  const [storedSearchQuery, setStoredSearchQuery] = useState("");
  const [storedProducts, setStoredProducts] = useState<WeFulFilStoredProduct[]>([]);
  const [storedProductsCount, setStoredProductsCount] = useState(0);
  const [storedProductsLoading, setStoredProductsLoading] = useState(false);
  
  const { toast } = useToast();

  // Optimized API query with better caching
  const apiQuery = useQuery({
    queryKey: ['wefullfil-api-products', filters, searchQuery],
    queryFn: () => fetchWeFulFilProducts({ ...filters, search: searchQuery }),
    enabled: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    retry: (failureCount, error) => {
      // Don't retry on client errors
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Memoized stored products loader to prevent unnecessary re-renders
  const loadStoredProducts = useCallback(async () => {
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
  }, [storedPage, storedSearchQuery, toast]);

  // Load stored products with optimized dependency array
  useEffect(() => {
    loadStoredProducts();
  }, [loadStoredProducts]);

  // Optimized search handlers
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
    apiQuery.refetch();
  }, [apiQuery]);

  const handleStoredSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setStoredPage(1);
  }, []);

  // Optimized import handler with better error handling
  const handleImport = useCallback(async (product: WeFulFilProduct) => {
    if (importing[product.id]) return; // Prevent duplicate imports
    
    setImporting(prev => ({ ...prev, [product.id]: true }));
    
    try {
      await importWeFulFilProductToAdmin(product);
      
      toast({
        title: "Product Imported Successfully",
        description: `${product.title} has been added to your products.`,
      });
      
      // Refresh stored products list
      await loadStoredProducts();
    } catch (error) {
      toast({
        title: "Import Failed",
        description: `Failed to import product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setImporting(prev => ({ ...prev, [product.id]: false }));
    }
  }, [importing, toast, loadStoredProducts]);

  // Optimized bulk import with progress tracking
  const handleBulkImport = useCallback(async () => {
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
          description: "Selected products are out of stock or invalid.",
          variant: "destructive",
        });
        return;
      }
      
      const importedProducts = await importMultipleWeFulFilProducts(productsToImport);
      
      toast({
        title: "Bulk Import Completed",
        description: `Successfully imported ${importedProducts.length} out of ${productsToImport.length} products.`,
      });
      
      setSelectedProducts({});
      await loadStoredProducts();
    } catch (error) {
      toast({
        title: "Bulk Import Failed",
        description: `Failed to import products: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setBulkImporting(false);
    }
  }, [selectedProducts, apiQuery.data?.data, toast, loadStoredProducts]);

  // Optimized selection handlers
  const handleSelectAll = useCallback((checked: boolean) => {
    if (!apiQuery.data?.data) return;
    
    const newSelected: Record<string, boolean> = {};
    apiQuery.data.data.forEach(product => {
      newSelected[product.id] = checked && product.inventory_quantity > 0;
    });
    setSelectedProducts(newSelected);
  }, [apiQuery.data?.data]);

  const handleSelectProduct = useCallback((productId: string, checked: boolean) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: checked,
    }));
  }, []);

  // Optimized pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
    apiQuery.refetch();
  }, [apiQuery]);

  const handleStoredPageChange = useCallback((page: number) => {
    setStoredPage(page);
  }, []);

  // Optimized refresh handler with cache clearing
  const handleRefresh = useCallback(() => {
    clearWeFulFilCache();
    apiQuery.refetch();
  }, [apiQuery]);

  // Memoized computed values
  const selectedProductsCount = useMemo(() => 
    Object.values(selectedProducts).filter(Boolean).length,
    [selectedProducts]
  );

  const availableProductsCount = useMemo(() => 
    apiQuery.data?.data.filter(product => product.inventory_quantity > 0).length || 0,
    [apiQuery.data?.data]
  );

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
            <TabsTrigger value="imported">Imported Products ({storedProductsCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="api-search">
            <WeFulFilSearchForm
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filters={filters}
              setFilters={setFilters}
              onSearch={handleSearch}
              onRefresh={handleRefresh}
              isLoading={apiQuery.isLoading}
              pagination={apiQuery.data?.meta.pagination}
            />

            {apiQuery.isLoading && (
              <div className="flex justify-center my-8">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <p className="text-center">Loading products...</p>
                </div>
              </div>
            )}

            {apiQuery.error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
                <p className="font-medium">Error loading products</p>
                <p className="text-sm">{apiQuery.error instanceof Error ? apiQuery.error.message : 'Unknown error occurred'}</p>
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => apiQuery.refetch()} 
                    size="sm"
                  >
                    Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleRefresh} 
                    size="sm"
                  >
                    Clear Cache & Retry
                  </Button>
                </div>
              </div>
            )}

            {apiQuery.data && apiQuery.data.data && (
              <>
                <WeFulFilImportControls
                  products={apiQuery.data.data}
                  selectedProducts={selectedProducts}
                  onSelectAll={handleSelectAll}
                  onBulkImport={handleBulkImport}
                  bulkImporting={bulkImporting}
                />
                
                <WeFulFilProductTable
                  products={apiQuery.data.data}
                  selectedProducts={selectedProducts}
                  importing={importing}
                  onSelectProduct={handleSelectProduct}
                  onImport={handleImport}
                />
                
                {apiQuery.data.meta.pagination.total_pages > 1 && (
                  <WeFulFilPagination
                    pagination={apiQuery.data.meta.pagination}
                    onPageChange={handlePageChange}
                  />
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
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <p className="text-center">Loading imported products...</p>
                </div>
              </div>
            )}

            <StoredProductsTable
              products={storedProducts}
              searchQuery={storedSearchQuery}
            />

            {storedProductsCount > 10 && (
              <StoredProductsPagination
                currentPage={storedPage}
                totalCount={storedProductsCount}
                itemsPerPage={10}
                onPageChange={handleStoredPageChange}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WeFulFilProductImport;
