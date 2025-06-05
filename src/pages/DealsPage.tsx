
import React from "react";
import { mockProducts } from "@/data/mockData";
import ProductGrid from "@/components/shop/ProductGrid";
import { Badge } from "@/components/ui/badge";

const DealsPage: React.FC = () => {
  // Filter products with compare_at_price (on sale)
  const dealsProducts = mockProducts.filter(
    (product) => product.compareAtPrice && product.compareAtPrice > product.price
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="wwe-container py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge variant="destructive" className="mb-4 text-lg px-4 py-2">
            🔥 Hot Deals
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-wwe-navy mb-4">
            Deals & Promotions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these amazing deals! Limited time offers on your favorite products. 
            Save big while stocks last.
          </p>
        </div>

        {/* Deals Banner */}
        <div className="mb-8 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg p-6 md:p-8 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Up to 50% Off Selected Items!
          </h2>
          <p className="text-lg opacity-90">
            Hurry! These deals won't last forever. Shop now and save big on quality products.
          </p>
        </div>

        {/* Products on Sale */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Products on Sale
              <span className="text-gray-500 ml-2">({dealsProducts.length})</span>
            </h2>
          </div>

          {dealsProducts.length > 0 ? (
            <ProductGrid products={dealsProducts} />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2">No deals available</h3>
              <p className="text-gray-600">Check back soon for exciting promotions and discounts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
