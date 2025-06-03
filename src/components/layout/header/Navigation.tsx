
import React from "react";
import { Link } from "react-router-dom";

const Navigation: React.FC = () => {
  return (
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
  );
};

export default Navigation;
