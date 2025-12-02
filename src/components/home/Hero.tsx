import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ShoppingBag } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 min-h-[60vh] flex items-center">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
          alt="Shopping lifestyle"
          className="w-full h-full object-cover object-center opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/85"></div>
      </div>

      <div className="wwe-container relative z-10">
        <div className="flex flex-col items-center justify-center text-center py-16 md:py-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span className="text-sm text-white font-medium">Coming Soon</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
            Welcome to <span className="text-yellow-300">1145 Lifestyle</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-4 animate-fade-in">
            The future of shopping, reimagined.
          </p>

          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl animate-fade-in">
            Discover a world where fashion, beauty, gadgets, and home essentials meet effortless style — all in one place.
          </p>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 mb-8 animate-scale-in">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              🎉 We're launching soon!
            </h2>
            <p className="text-white/90 text-lg mb-6">
              Be among the first to experience the 1145 Lifestyle.<br />
              Sign up now to unlock your <span className="font-bold text-yellow-300">exclusive pre-launch discount</span> and get early access to our grand opening deals.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              Join the Lifestyle. Live the Experience.
            </h3>
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
