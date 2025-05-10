
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import CartSheet from "@/components/shop/CartSheet";
import { Search, ShoppingCart, Menu, X, User, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { cart, toggleCart, isCartOpen, setCartOpen } = useCart();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Get items and subtotal from cart
  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-wwe-navy">WWE Store</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            <Link
              to="/"
              className="text-gray-600 hover:text-wwe-navy transition-colors"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-gray-600 hover:text-wwe-navy transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/categories"
              className="text-gray-600 hover:text-wwe-navy transition-colors"
            >
              Categories
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Button */}
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* User Menu */}
            {user ? (
              <div className="relative inline-block text-left group">
                <Button variant="ghost">
                  <User className="h-5 w-5 mr-2" />
                  {user.name || user.email}
                </Button>
                <div className="hidden group-hover:block absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Account
                  </Link>
                  <Link
                    to="/vendor/register"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Store className="h-4 w-4 inline-block mr-2" />
                    Become a Vendor
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline">Sign in</Button>
              </Link>
            )}

            {/* Cart Button */}
            <Button
              onClick={toggleCart}
              variant="ghost"
              size="icon"
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-wwe-navy text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleCart}
              className="relative p-2 mr-2"
              aria-label="Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-wwe-navy text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "md:hidden",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Shop
          </Link>
          <Link
            to="/categories"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Categories
          </Link>
          <Link
            to="/vendor/register"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Store className="h-4 w-4 inline-block mr-2" />
            Become a Vendor
          </Link>

          {/* Search Bar in Mobile Menu */}
          <div className="px-3 py-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-wwe-navy focus:border-wwe-navy sm:text-sm"
                placeholder="Search"
              />
            </div>
          </div>

          {/* User Actions in Mobile Menu */}
          {user ? (
            <div className="px-3 py-2">
              <div className="font-medium text-gray-800 mb-2">
                {user.name || user.email}
              </div>
              <Link
                to="/account"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Account
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="px-3 py-2">
              <Link
                to="/login"
                className="block w-full text-center px-3 py-2 rounded-md bg-wwe-navy text-white font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Cart Offcanvas */}
      <CartSheet isOpen={isCartOpen} setIsOpen={setCartOpen} />
    </header>
  );
};

export default Header;
