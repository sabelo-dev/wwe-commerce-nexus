
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WeFulFilProductFilter, WeFulFilPagination } from "@/types/wefullfil";

interface WeFulFilSearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: WeFulFilProductFilter;
  setFilters: (filters: WeFulFilProductFilter) => void;
  onSearch: (e: React.FormEvent) => void;
  onRefresh: () => void;
  isLoading: boolean;
  pagination?: WeFulFilPagination;
}

export const WeFulFilSearchForm: React.FC<WeFulFilSearchFormProps> = ({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  onSearch,
  onRefresh,
  isLoading,
  pagination,
}) => {
  const handleSortChange = (value: string) => {
    let [sort_by, sort_order] = value.split('-') as [WeFulFilProductFilter['sort_by'], WeFulFilProductFilter['sort_order']];
    setFilters({ ...filters, sort_by, sort_order });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Search WeFulFil API</CardTitle>
        <CardDescription>
          Find products by title, SKU, or categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSearch} className="flex gap-2 mb-4">
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
          {pagination && (
            <span className="text-sm text-gray-500">
              Showing {pagination.count} of {pagination.total} products
            </span>
          )}
        </div>
        <Button 
          variant="outline" 
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Results
        </Button>
      </CardFooter>
    </Card>
  );
};
