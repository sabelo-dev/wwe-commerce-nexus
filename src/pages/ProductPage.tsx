
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Star, Truck, ShieldCheck, Heart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatCurrency, cn } from "@/lib/utils";
import StarRating from "@/components/ui/star-rating";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { Product, ProductVariation } from "@/types";
import { fetchProductBySlug, fetchRelatedProducts } from "@/services/products";

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        const productData = await fetchProductBySlug(slug);
        
        if (productData) {
          setProduct(productData);
          
          // Auto-select first variation if available
          if (productData.variations && productData.variations.length > 0) {
            const firstVariation = productData.variations[0];
            setSelectedVariation(firstVariation);
            setSelectedAttributes(firstVariation.attributes);
          }
          
          const related = await fetchRelatedProducts(productData.id, productData.category, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  // Get unique attribute types and values
  const attributeTypes = React.useMemo(() => {
    if (!product?.variations || product.variations.length === 0) return [];
    const types = new Set<string>();
    product.variations.forEach(v => {
      Object.keys(v.attributes).forEach(key => types.add(key));
    });
    return Array.from(types);
  }, [product?.variations]);

  const getAttributeValues = (type: string) => {
    if (!product?.variations) return [];
    const values = new Set<string>();
    product.variations.forEach(v => {
      if (v.attributes[type]) values.add(v.attributes[type]);
    });
    return Array.from(values);
  };

  // Handle attribute selection
  const handleAttributeSelect = (type: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [type]: value };
    setSelectedAttributes(newAttributes);

    // Find matching variation
    const matchingVariation = product?.variations?.find(v => {
      return Object.keys(newAttributes).every(
        key => v.attributes[key] === newAttributes[key]
      );
    });

    if (matchingVariation) {
      setSelectedVariation(matchingVariation);
      // Update main image if variation has one
      if (matchingVariation.imageUrl) {
        const varImageIndex = product?.images.findIndex(img => img === matchingVariation.imageUrl);
        if (varImageIndex !== -1) {
          setSelectedImage(varImageIndex);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="wwe-container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">Sorry, the product you are looking for does not exist.</p>
        <Link to="/shop">
          <Button className="bg-wwe-navy hover:bg-wwe-navy/90">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: selectedVariation?.price || product.price,
      image: selectedVariation?.imageUrl || product.images[0],
      variationId: selectedVariation?.id,
      variationAttributes: selectedVariation?.attributes,
    });
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const currentPrice = selectedVariation?.price || product.price;
  const discountPercent = product.compareAtPrice ? Math.round(((product.compareAtPrice - currentPrice) / product.compareAtPrice) * 100) : 0;
  const isInStock = selectedVariation ? selectedVariation.quantity > 0 : product.inStock;

  return (
    <div className="bg-white">
      <div className="wwe-container py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm">
          <Link to="/" className="text-gray-500 hover:text-wwe-navy">Home</Link>
          {" "} / {" "}
          <Link to="/shop" className="text-gray-500 hover:text-wwe-navy">Shop</Link>
          {" "} / {" "}
          <Link to={`/category/${product.category.toLowerCase()}`} className="text-gray-500 hover:text-wwe-navy">
            {product.category}
          </Link>
          {" "} / <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border bg-gray-100">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="flex space-x-2 overflow-auto pb-2">
              {product.images.map((image, idx) => (
                <div
                  key={idx}
                  className={`relative w-20 h-20 cursor-pointer rounded border ${
                    selectedImage === idx
                      ? "ring-2 ring-wwe-navy"
                      : "hover:ring-1 hover:ring-gray-300"
                  }`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img
                    src={image}
                    alt={`${product.name} preview ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center space-x-2 mt-2">
                <StarRating rating={product.rating} />
                <span className="text-gray-600 text-sm">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold">
                  {formatCurrency(currentPrice)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > currentPrice && (
                  <>
                    <span className="text-gray-500 line-through">
                      {formatCurrency(product.compareAtPrice)}
                    </span>
                    <Badge className="bg-wwe-gold text-wwe-navy">
                      {discountPercent}% off
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Availability */}
            <div>
              <Badge className={isInStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {isInStock ? "In Stock" : "Out of Stock"}
              </Badge>
              {selectedVariation && (
                <span className="text-sm text-gray-600 ml-2">
                  {selectedVariation.quantity} available
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-700 mt-2">{product.description}</p>

            {/* Vendor Info */}
            <div className="mt-2">
              <span className="text-sm text-gray-600">
                Brand: <span className="text-wwe-navy font-medium">{product.vendorName}</span>
              </span>
            </div>

            {/* Variation Selection */}
            {attributeTypes.length > 0 && (
              <div className="space-y-4 border-t pt-4">
                {attributeTypes.map(attrType => (
                  <div key={attrType} className="space-y-2">
                    <div className="font-medium text-gray-900 capitalize flex items-center gap-2">
                      {attrType}:
                      {selectedAttributes[attrType] && (
                        <span className="text-sm font-normal text-gray-600">
                          {selectedAttributes[attrType]}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getAttributeValues(attrType).map(value => {
                        const isSelected = selectedAttributes[attrType] === value;
                        
                        return (
                          <button
                            key={value}
                            onClick={() => handleAttributeSelect(attrType, value)}
                            className={cn(
                              "px-4 py-2 border rounded-md text-sm font-medium transition-colors",
                              isSelected
                                ? "border-wwe-navy bg-wwe-navy text-white"
                                : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
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

            {/* Actions */}
            <div className="flex flex-col space-y-4 mt-6">
              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Quantity:</span>
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-r-none"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <div className="h-8 w-12 flex items-center justify-center border-y">
                    {quantity}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-l-none"
                    onClick={incrementQuantity}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Add to Cart & Wishlist */}
              <div className="flex space-x-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-wwe-navy hover:bg-wwe-navy/90"
                  disabled={!isInStock}
                >
                  {isInStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => toggleWishlist(product.id)}
                  className={isInWishlist(product.id) ? "text-red-500" : ""}
                >
                  <Heart 
                    className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} 
                  />
                </Button>
              </div>
            </div>

            {/* Shipping & Returns */}
            <div className="border-t border-gray-200 pt-4 mt-6 space-y-3">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-gray-500" />
                <span className="text-sm">Free shipping on orders over R500</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-gray-500" />
                <span className="text-sm">30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mb-12">
          <Tabs defaultValue="details">
            <TabsList className="w-full border-b">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="py-6">
              <div className="prose max-w-none">
                <p className="mb-4">{product.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="specs" className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2">Product Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Brand</span>
                    <span>{product.vendorName}</span>
                    <span className="text-gray-600">Category</span>
                    <span>{product.subcategory || product.category}</span>
                    {selectedVariation?.sku && (
                      <>
                        <span className="text-gray-600">SKU</span>
                        <span>{selectedVariation.sku}</span>
                      </>
                    )}
                  </div>
                </div>
                {product.variations && product.variations.length > 0 && (
                  <div className="border rounded-md p-4">
                    <h3 className="font-semibold mb-2">Available Options</h3>
                    <div className="text-sm space-y-1">
                      {attributeTypes.map(type => (
                        <div key={type}>
                          <span className="text-gray-600 capitalize">{type}s: </span>
                          <span>{getAttributeValues(type).join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="py-6">
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Review Summary</h3>
                    <Button className="bg-wwe-navy hover:bg-wwe-navy/90">Write a Review</Button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl font-bold">{product.rating.toFixed(1)}</div>
                    <div>
                      <StarRating rating={product.rating} />
                      <div className="text-sm text-gray-500">Based on {product.reviewCount} reviews</div>
                    </div>
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-4">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="border-b pb-4">
                      <div className="flex justify-between mb-1">
                        <div className="font-semibold">John D.</div>
                        <div className="text-gray-500 text-sm">3 days ago</div>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < 4 ? "text-wwe-gold fill-wwe-gold" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm">
                        Great product! It exceeded my expectations in terms of quality and
                        functionality. Would definitely recommend to others.
                      </p>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full">
                  Load More Reviews
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <FeaturedProducts
            title="You May Also Like"
            products={relatedProducts}
            viewAllLink={`/category/${product.category.toLowerCase()}`}
          />
        )}
      </div>
    </div>
  );
};

export default ProductPage;
