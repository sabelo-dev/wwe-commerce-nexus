
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  LogOut,
  Package,
} from "lucide-react";
import CartSheet from "../shop/CartSheet";
import { Badge } from "@/components/ui/badge";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { cart, isCartOpen, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, we would redirect to search results page
      console.log("Searching for:", searchQuery);
    }
  };

  const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="wwe-container">
        {/* Top bar with logo and search */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-wwe-navy">WWE</span>
            <span className="hidden md:block text-sm text-wwe-navy">World Wide Ecommerce</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="search"
                placeholder="Search for products..."
                className="w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Nav Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="hidden sm:flex items-center text-gray-700 hover:text-wwe-navy">
              <Heart size={24} />
            </Link>

            {/* Cart Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center text-gray-700 hover:text-wwe-navy"
                aria-label="Open cart"
              >
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-wwe-gold text-wwe-navy">
                    {cartItemCount}
                  </Badge>
                )}
              </button>
              <CartSheet isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
            </div>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative rounded-full">
                    <User size={24} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/orders">
                    <DropdownMenuItem>
                      <Package className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/wishlist">
                    <DropdownMenuItem>
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Wishlist</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <User size={24} />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar - Only visible on mobile */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Input
              type="search"
              placeholder="Search for products..."
              className="w-full pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex py-2 space-x-8">
          <Link to="/" className="text-gray-700 hover:text-wwe-navy font-medium">Home</Link>
          <Link to="/shop" className="text-gray-700 hover:text-wwe-navy font-medium">Shop</Link>
          <Link to="/categories" className="text-gray-700 hover:text-wwe-navy font-medium">Categories</Link>
          <Link to="/deals" className="text-gray-700 hover:text-wwe-navy font-medium">Deals</Link>
          <Link to="/new-arrivals" className="text-gray-700 hover:text-wwe-navy font-medium">New Arrivals</Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[350px]">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-wwe-navy">WWE</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-6">
            <Link to="/" className="py-2 text-lg" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="py-2 text-lg" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
            <Link to="/categories" className="py-2 text-lg" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
            <Link to="/deals" className="py-2 text-lg" onClick={() => setMobileMenuOpen(false)}>Deals</Link>
            <Link to="/new-arrivals" className="py-2 text-lg" onClick={() => setMobileMenuOpen(false)}>New Arrivals</Link>
            
            <div className="h-[1px] bg-gray-200 my-2"></div>
            
            {user ? (
              <>
                <Link to="/profile" className="py-2 text-lg" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                <Link to="/orders" className="py-2 text-lg" onClick={() => setMobileMenuOpen(false)}>Orders</Link>
                <Link to="/wishlist" className="py-2 text-lg" onClick={() => setMobileMenuOpen(false)}>Wishlist</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="py-2 text-lg text-left">Log Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2 text-lg" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="py-2 text-lg" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
