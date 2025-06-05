
import React from "react";
import { mockProducts } from "@/data/mockData";
import ProductGrid from "@/components/shop/ProductGrid";

const BestSellersPage: React.FC = () => {
  // Filter products by high rating and review count for best sellers
  const bestSellers = mockProducts
    .filter((product) => product.rating >= 4.5 && product.reviewCount >= 50)
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 12);

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
        {bestSellers.length > 0 ? (
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
