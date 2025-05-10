
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gray-800">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
          alt="Hero background"
          className="w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
      </div>

      <div className="wwe-container relative z-10">
        <div className="flex flex-col items-start py-16 md:py-24 max-w-xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Welcome to World Wide Ecommerce
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Discover millions of products from thousands of trusted sellers around the world. Quality products, competitive prices, fast delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shop">
              <Button size="lg" className="bg-wwe-gold text-wwe-navy hover:bg-wwe-gold/90">
                Shop Now
              </Button>
            </Link>
            <Link to="/categories">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Browse Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
