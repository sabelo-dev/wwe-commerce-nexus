import React, { useState, useEffect } from "react";
import { Product } from "@/types";
import { fetchPopularProducts } from "@/services/products";
import ProductGrid from "@/components/shop/ProductGrid";

const PopularPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchPopularProducts(20);
        setProducts(data);
      } catch (error) {
        console.error('Error loading popular products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="wwe-container py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-wwe-navy mb-4">
            Popular Products
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the most loved products by our customers. These are the items that keep flying off our virtual shelves!
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading popular products...</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-2">No popular products yet</h3>
            <p className="text-gray-600 mb-4">
              Check back soon as we update our popular products daily!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularPage;