
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Star, Truck, ShieldCheck, Heart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import StarRating from "@/components/ui/star-rating";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { Product } from "@/types";
import { fetchProductBySlug, fetchRelatedProducts } from "@/services/products";

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Available sizes for Air Jordan
  const availableSizes = ["UK 2.5", "UK 3", "UK 3.5", "UK 4", "UK 4.5", "UK 5", "UK 5.5", "UK 6", "UK 6.5", "UK 7", "UK 7.5", "UK 9"];

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        const productData = await fetchProductBySlug(slug);
        
        if (productData) {
          setProduct(productData);
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
    if (product.id === "air-jordan-1-low-mom" && !selectedSize) {
      alert("Please select a size first");
      return;
    }
    
    addToCart({
      productId: product.id,
      name: product.name + (selectedSize ? ` - ${selectedSize}` : ""),
      price: product.price,
      image: product.images[0],
    });
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const isAirJordan = product.id === "air-jordan-1-low-mom";
  const discountPercent = product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;

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
                  {formatCurrency(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
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

            {/* Limited Time Offer for Air Jordan */}
            {isAirJordan && (
              <div className="bg-wwe-gold/10 border border-wwe-gold rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-wwe-gold" />
                  <span className="font-semibold text-wwe-navy">Limited Time Offer!</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  10% discount expires in 30 days. Don't miss out!
                </p>
              </div>
            )}

            {/* Availability */}
            <div>
              <Badge className={product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            {/* Short Description */}
            <p className="text-gray-700 mt-2">{product.description}</p>

            {/* Vendor Info */}
            <div className="mt-2">
              <span className="text-sm text-gray-600">
                Brand: <span className="text-wwe-navy font-medium">{product.vendorName}</span>
              </span>
            </div>

            {/* Size Selection for Air Jordan */}
            {isAirJordan && (
              <div className="space-y-3">
                <span className="font-medium text-gray-900">Size:</span>
                <div className="grid grid-cols-4 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? "border-wwe-navy bg-wwe-navy text-white"
                          : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
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
                  disabled={!product.inStock}
                >
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
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
                {isAirJordan && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                      <li>Nike Air in the heel provides lightweight, resilient cushioning.</li>
                      <li>Solid-rubber outsoles give you ample everyday traction.</li>
                      <li>Leather in the upper offers durability and structure.</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold mb-3">Product Details</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Wings logo on heel</li>
                      <li>Stitched Swoosh logo</li>
                      <li>Classic laces</li>
                      <li>Colour Shown: Sail/Sail/Metallic Gold</li>
                      <li>Style: FN5032-100</li>
                      <li>Country/Region of Origin: China</li>
                    </ul>
                  </div>
                )}
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
                    {isAirJordan && (
                      <>
                        <span className="text-gray-600">Style Code</span>
                        <span>FN5032-100</span>
                        <span className="text-gray-600">Colorway</span>
                        <span>Sail/Sail/Metallic Gold</span>
                      </>
                    )}
                  </div>
                </div>
                {isAirJordan && (
                  <div className="border rounded-md p-4">
                    <h3 className="font-semibold mb-2">Available Sizes</h3>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {availableSizes.map((size) => (
                        <span key={size} className="text-gray-700">{size}</span>
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
