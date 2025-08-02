
import React, { useState, useEffect } from "react";
import { fetchBestSellers } from "@/services/products";
import ProductGrid from "@/components/shop/ProductGrid";
import { Product } from "@/types";

const BestSellersPage: React.FC = () => {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchBestSellers(12);
        setBestSellers(products);
      } catch (error) {
        console.error("Error loading best sellers:", error);
        setBestSellers([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="wwe-container py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-wwe-navy mb-4">
            Best Sellers
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular products loved by thousands of customers. 
            These top-rated items have earned their place through quality and customer satisfaction.
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading best sellers...</p>
          </div>
        ) : bestSellers.length > 0 ? (
          <ProductGrid products={bestSellers} />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-2">No best sellers found</h3>
            <p className="text-gray-600">Check back soon for our top products!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSellersPage;
