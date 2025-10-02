
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import StarRating from "@/components/ui/star-rating";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addToCart } = useCart();
  const [selectedVariation, setSelectedVariation] = React.useState<string | null>(null);

  // Get unique attribute types (e.g., color, size)
  const attributeTypes = React.useMemo(() => {
    if (!product.variations || product.variations.length === 0) return [];
    const types = new Set<string>();
    product.variations.forEach(v => {
      Object.keys(v.attributes).forEach(key => types.add(key));
    });
    return Array.from(types);
  }, [product.variations]);

  // Get unique values for each attribute type
  const getAttributeValues = (type: string) => {
    if (!product.variations) return [];
    const values = new Set<string>();
    product.variations.forEach(v => {
      if (v.attributes[type]) values.add(v.attributes[type]);
    });
    return Array.from(values);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const variation = product.variations?.find(v => v.id === selectedVariation);
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: variation?.price || product.price,
      image: variation?.imageUrl || product.images[0],
      variationId: selectedVariation || undefined,
      variationAttributes: variation?.attributes,
    });
  };

  const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = isOnSale
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

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
          
          {/* Vendor Info */}
          {product.vendorName && product.vendorSlug && (
            <div className="text-xs text-gray-500 mb-2">
              <Link 
                to={`/store/${product.vendorSlug}`}
                className="hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                by {product.vendorName}
              </Link>
            </div>
          )}
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-semibold">{formatCurrency(product.price)}</span>
            {isOnSale && (
              <span className="text-gray-500 text-sm line-through">
                {formatCurrency(product.compareAtPrice!)}
              </span>
            )}
          </div>
          <div className="flex items-center mb-3">
            <StarRating rating={product.rating} />
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
          </div>

          {/* Variation Selection */}
          {product.variations && product.variations.length > 0 && (
            <div className="mb-3 space-y-2" onClick={(e) => e.stopPropagation()}>
              {attributeTypes.slice(0, 1).map(attrType => (
                <div key={attrType} className="space-y-1">
                  <div className="text-xs text-gray-500 capitalize">{attrType}:</div>
                  <div className="flex flex-wrap gap-1">
                    {getAttributeValues(attrType).slice(0, 4).map(value => {
                      const matchingVariation = product.variations?.find(
                        v => v.attributes[attrType] === value
                      );
                      const isSelected = selectedVariation === matchingVariation?.id;
                      
                      return (
                        <button
                          key={value}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedVariation(matchingVariation?.id || null);
                          }}
                          className={cn(
                            "px-2 py-1 text-xs border rounded transition-colors",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary"
                          )}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

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
