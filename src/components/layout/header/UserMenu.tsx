
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Store, Shield } from "lucide-react";
import { User as UserType } from "@/types";

interface UserMenuProps {
  user: UserType | null;
  isAdmin: boolean;
  isVendor: boolean;
  logout: () => Promise<void>;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, isAdmin, isVendor, logout }) => {
  if (!user) {
    return (
      <Link to="/login">
        <Button variant="outline">Sign in</Button>
      </Link>
    );
  }

  return (
    <div className="relative inline-block text-left group">
      <Button variant="ghost">
        <User className="h-5 w-5 mr-2" />
        {user.name || user.email}
        {isAdmin && <Shield className="h-4 w-4 ml-2 text-red-500" />}
      </Button>
      <div className="hidden group-hover:block absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
        <Link
          to="/account"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Account
        </Link>
        {user?.role === 'consumer' && (
          <Link
            to="/vendor/register"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Store className="h-4 w-4 inline-block mr-2" />
            Become a Vendor
          </Link>
        )}
        {isVendor && (
          <Link
            to="/vendor/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Store className="h-4 w-4 inline-block mr-2" />
            Vendor Dashboard
          </Link>
        )}
        {isAdmin && (
          <Link
            to="/admin/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Shield className="h-4 w-4 inline-block mr-2" />
            Admin Dashboard
          </Link>
        )}
        <button
          onClick={() => logout()}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
