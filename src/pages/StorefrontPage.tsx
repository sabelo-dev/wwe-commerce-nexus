import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductGrid from "@/components/shop/ProductGrid";
import { Product } from "@/types";
import { fetchProductsByStore, fetchStoreBySlug } from "@/services/products";

const StorefrontPage: React.FC = () => {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorefrontData = async () => {
      if (!storeSlug) return;
      
      try {
        setLoading(true);
        const [storeData, productsData] = await Promise.all([
          fetchStoreBySlug(storeSlug),
          fetchProductsByStore(storeSlug),
        ]);
        
        setStore(storeData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading storefront data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStorefrontData();
  }, [storeSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Store Not Found</h1>
            <p className="text-muted-foreground mb-6">The store you're looking for doesn't exist.</p>
            <Link to="/shop">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shop
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const vendor = store.vendors;
  const avgRating = products.length > 0 
    ? products.reduce((sum, p) => sum + p.rating, 0) / products.length 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Store Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            {/* Store Logo */}
            <div className="flex-shrink-0">
              {store.logo_url || vendor?.logo_url ? (
                <img
                  src={store.logo_url || vendor.logo_url}
                  alt={store.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-background shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border-4 border-background shadow-lg">
                  <Store className="h-8 w-8 text-primary" />
                </div>
              )}
            </div>

            {/* Store Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{store.name}</h1>
                <Badge variant="secondary">Verified Vendor</Badge>
              </div>
              
              {vendor?.business_name && vendor.business_name !== store.name && (
                <p className="text-lg text-muted-foreground mb-2">by {vendor.business_name}</p>
              )}
              
              <div className="flex items-center gap-4 mb-3">
                {avgRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{avgRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({products.length} products)</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>South Africa</span>
                </div>
              </div>

              {(store.description || vendor?.description) && (
                <p className="text-muted-foreground max-w-2xl">
                  {store.description || vendor.description}
                </p>
              )}
            </div>

            {/* Back Button */}
            <div className="flex-shrink-0">
              <Link to="/shop">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Shop
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Store Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Products Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Products ({products.length})
            </h2>
          </div>

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-12">
              <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Products Yet</h3>
              <p className="text-muted-foreground">This store hasn't added any products yet.</p>
            </div>
          )}
        </div>

        {/* Store Policies */}
        {(store.shipping_policy || store.return_policy) && (
          <div className="border-t pt-8">
            <h3 className="text-xl font-bold text-foreground mb-6">Store Policies</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {store.shipping_policy && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Shipping Policy</h4>
                  <p className="text-muted-foreground">{store.shipping_policy}</p>
                </div>
              )}
              {store.return_policy && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Return Policy</h4>
                  <p className="text-muted-foreground">{store.return_policy}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorefrontPage;