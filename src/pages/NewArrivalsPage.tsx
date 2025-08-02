
import React, { useState, useEffect } from "react";
import { fetchNewArrivals } from "@/services/products";
import ProductGrid from "@/components/shop/ProductGrid";
import { Product } from "@/types";

const NewArrivalsPage: React.FC = () => {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchNewArrivals(16);
        setNewArrivals(products);
      } catch (error) {
        console.error("Error loading new arrivals:", error);
        setNewArrivals([]);
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
            New Arrivals
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest additions to our store. Fresh products, trending styles, 
            and innovative solutions - all newly arrived for you to explore.
          </p>
        </div>

        {/* New Arrivals Banner */}
        <div className="mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-6 md:p-8 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Just In: Latest Products
          </h2>
          <p className="text-lg opacity-90">
            Be the first to get your hands on our newest inventory. Quality and style, freshly arrived.
          </p>
        </div>

        {/* Products */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Latest Products
              <span className="text-gray-500 ml-2">({newArrivals.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading products...</p>
            </div>
          ) : newArrivals.length > 0 ? (
            <ProductGrid products={newArrivals} />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2">No new arrivals</h3>
              <p className="text-gray-600">Check back soon for the latest products!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewArrivalsPage;
