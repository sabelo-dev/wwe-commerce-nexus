
import React from "react";
import { Link } from "react-router-dom";
import { Search, Store, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { User as UserType } from "@/types";

interface MobileMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  user: UserType | null;
  isAdmin: boolean;
  isVendor: boolean;
  logout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  user,
  isAdmin,
  isVendor,
  logout,
}) => {
  return (
    <div className={cn("md:hidden", mobileMenuOpen ? "block" : "hidden")}>
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
        {user?.role === 'consumer' && (
          <Link
            to="/vendor/register"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Store className="h-4 w-4 inline-block mr-2" />
            Become a Vendor
          </Link>
        )}
        {isVendor && (
          <Link
            to="/vendor/dashboard"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Store className="h-4 w-4 inline-block mr-2" />
            Vendor Dashboard
          </Link>
        )}
        {isAdmin && (
          <Link
            to="/admin/dashboard"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Shield className="h-4 w-4 inline-block mr-2" />
            Admin Dashboard
          </Link>
        )}

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
  );
};

export default MobileMenu;
