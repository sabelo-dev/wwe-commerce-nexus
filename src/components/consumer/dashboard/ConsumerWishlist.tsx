import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

const ConsumerWishlist: React.FC = () => {
  // Mock data - replace with actual API calls
  const wishlistItems = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      price: 1299.99,
      originalPrice: 1599.99,
      image: "/public/lovable-uploads/0173f645-3b83-43a6-8daa-2e2f763357b2.png",
      vendor: "TechStore",
      inStock: true,
      rating: 4.5,
      addedDate: "2024-01-10"
    },
    {
      id: "2",
      name: "Organic Cotton T-Shirt",
      price: 299.99,
      originalPrice: null,
      image: "/public/lovable-uploads/036486dd-58ef-4820-affc-ada0d6e33abf.png",
      vendor: "FashionHub",
      inStock: true,
      rating: 4.2,
      addedDate: "2024-01-08"
    },
    {
      id: "3",
      name: "Smart Kitchen Scale",
      price: 599.99,
      originalPrice: 799.99,
      image: "/public/lovable-uploads/0f583fc2-9bf5-430d-aac3-50000174d44c.png",
      vendor: "HomeGoods",
      inStock: false,
      rating: 4.7,
      addedDate: "2024-01-05"
    }
  ];

  const removeFromWishlist = (itemId: string) => {
    // Implement remove functionality
    console.log("Remove item:", itemId);
  };

  const addToCart = (itemId: string) => {
    // Implement add to cart functionality
    console.log("Add to cart:", itemId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          <span className="text-lg font-medium">My Wishlist</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {wishlistItems.length} saved items
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground text-center mb-4">
              Save products you love for later by clicking the heart icon
            </p>
            <Button>Continue Shopping</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary">Out of Stock</Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-medium line-clamp-2">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.vendor}</p>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">
                      R{item.price.toFixed(2)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        R{item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < Math.floor(item.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({item.rating})
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Added {item.addedDate}
                  </p>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    className="flex-1"
                    disabled={!item.inStock}
                    onClick={() => addToCart(item.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    {item.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsumerWishlist;