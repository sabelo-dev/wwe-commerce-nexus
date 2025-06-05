
import React from "react";
import { Link } from "react-router-dom";
import { mockProducts } from "@/data/mockData";
import ProductGrid from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/button";

const KitchenPage: React.FC = () => {
  const kitchenProducts = mockProducts.filter(
    (product) => product.category === "Home & Kitchen" && product.subcategory === "Kitchen"
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="wwe-container py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm">
          <Link to="/" className="text-gray-500 hover:text-wwe-navy">Home</Link>
          {" / "}
          <Link to="/categories" className="text-gray-500 hover:text-wwe-navy">Categories</Link>
          {" / "}
          <Link to="/category/home-kitchen" className="text-gray-500 hover:text-wwe-navy">Home & Kitchen</Link>
          {" / "}
          <span className="text-gray-900">Kitchen</span>
        </div>

        {/* Page Header */}
        <div className="mb-8 relative rounded-lg overflow-hidden bg-gradient-to-r from-orange-600 to-red-600">
          <div className="relative z-10 p-6 md:p-10">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              Kitchen Essentials
            </h1>
            <p className="text-white/80 max-w-xl">
              Everything you need for your culinary adventures. From cookware to gadgets, 
              equip your kitchen with high-quality tools and accessories.
            </p>
          </div>
        </div>

        {/* Products */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Kitchen Products
              <span className="text-gray-500 ml-2">({kitchenProducts.length})</span>
            </h2>
          </div>

          {kitchenProducts.length > 0 ? (
            <ProductGrid products={kitchenProducts} />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                There are currently no kitchen products available.
              </p>
              <Link to="/shop">
                <Button className="bg-wwe-navy hover:bg-wwe-navy/90">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenPage;
