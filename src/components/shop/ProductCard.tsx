
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
  };

  const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = isOnSale
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className={cn("product-card group", className)}>
      <Link to={`/product/${product.slug}`} className="block h-full">
        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform group-hover:scale-105"
          />
          <button
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full opacity-70 hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle wishlist toggle (to be implemented)
            }}
          >
            <Heart size={18} className="text-gray-600" />
          </button>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && <Badge className="bg-wwe-info text-white">New</Badge>}
            {isOnSale && (
              <Badge className="bg-wwe-gold text-wwe-navy">-{discountPercent}%</Badge>
            )}
            {!product.inStock && <Badge variant="destructive">Out of Stock</Badge>}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="text-xs text-gray-500 mb-1">{product.category}</div>
          <h3 className="font-medium text-gray-900 text-sm md:text-base mb-1 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-semibold">{formatPrice(product.price)}</span>
            {isOnSale && (
              <span className="text-gray-500 text-sm line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
          <div className="flex items-center mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "text-wwe-gold"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-wwe-navy hover:bg-wwe-navy/90 mt-2"
            size="sm"
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
