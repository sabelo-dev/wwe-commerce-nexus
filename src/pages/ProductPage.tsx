
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Star, Truck, ShieldCheck, Heart } from "lucide-react";
import { mockProducts } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatCurrency, generateStarRating } from "@/lib/utils";
import FeaturedProducts from "@/components/home/FeaturedProducts";

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = mockProducts.find((p) => p.slug === slug);

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

  // Find related products (same category)
  const relatedProducts = mockProducts
    .filter(
      (p) => p.category === product.category && p.id !== product.id
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="bg-white">
      <div className="wwe-container py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm">
          <Link to="/" className="text-gray-500 hover:text-wwe-navy">
            Home
          </Link>{" "}
          /{" "}
          <Link to="/shop" className="text-gray-500 hover:text-wwe-navy">
            Shop
          </Link>{" "}
          /{" "}
          <Link
            to={`/category/${product.category.toLowerCase()}`}
            className="text-gray-500 hover:text-wwe-navy"
          >
            {product.category}
          </Link>{" "}
          / <span className="text-gray-900">{product.name}</span>
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
                <div className="flex">
                  {generateStarRating(product.rating)}
                </div>
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
                    <span className="text-green-600 font-medium">
                      {Math.round(
                        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
                      )}
                      % off
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Availability */}
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.inStock
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Short Description */}
            <p className="text-gray-700 mt-2">{product.description}</p>

            {/* Vendor Info */}
            <div className="mt-2">
              <span className="text-sm text-gray-600">
                Sold by:{" "}
                <Link
                  to={`/vendor/${product.vendorId}`}
                  className="text-wwe-navy font-medium hover:underline"
                >
                  {product.vendorName}
                </Link>
              </span>
            </div>

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
                <span className="text-sm">Free shipping on orders over $50</span>
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
                <p>{product.description}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                  varius enim in eros elementum tristique. Duis cursus, mi quis viverra
                  ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
                </p>
                <ul>
                  <li>High-quality materials for durability</li>
                  <li>Modern design that fits any environment</li>
                  <li>Easy to use and maintain</li>
                  <li>Energy efficient and eco-friendly</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="specs" className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2">Dimensions</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Width</span>
                    <span>10 inches</span>
                    <span className="text-gray-600">Height</span>
                    <span>8 inches</span>
                    <span className="text-gray-600">Depth</span>
                    <span>6 inches</span>
                    <span className="text-gray-600">Weight</span>
                    <span>2 lbs</span>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2">Material & Care</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Material</span>
                    <span>Premium aluminum alloy</span>
                    <span className="text-gray-600">Finish</span>
                    <span>Matte black</span>
                    <span className="text-gray-600">Care</span>
                    <span>Wipe with damp cloth</span>
                    <span className="text-gray-600">Warranty</span>
                    <span>1-year limited</span>
                  </div>
                </div>
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
                      <div className="flex">
                        {generateStarRating(product.rating)}
                      </div>
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
