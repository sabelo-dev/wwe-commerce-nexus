
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import ProductGrid from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/button";

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
  columns?: number;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title,
  subtitle,
  products,
  viewAllLink,
  columns = 4,
}) => {
  return (
    <section className="py-12">
      <div className="wwe-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-wwe-navy mb-2">
              {title}
            </h2>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
          {viewAllLink && (
            <Link to={viewAllLink}>
              <Button variant="outline" className="mt-4 md:mt-0">
                View All
              </Button>
            </Link>
          )}
        </div>

        <ProductGrid products={products} columns={columns} />
      </div>
    </section>
  );
};

export default FeaturedProducts;
