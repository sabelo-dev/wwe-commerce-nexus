
import React from "react";
import Hero from "@/components/home/Hero";
import CategorySection from "@/components/home/CategorySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoSection from "@/components/home/PromoSection";
import { mockCategories, featuredProducts, newArrivals, popularProducts } from "@/data/mockData";

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <CategorySection categories={mockCategories} />
      <FeaturedProducts
        title="Featured Products"
        subtitle="Discover our handpicked selection of top products"
        products={featuredProducts}
        viewAllLink="/shop"
      />
      <PromoSection />
      <FeaturedProducts
        title="New Arrivals"
        subtitle="The latest additions to our catalog"
        products={newArrivals}
        viewAllLink="/new-arrivals"
      />
      <FeaturedProducts
        title="Popular Products"
        subtitle="Loved by our customers"
        products={popularProducts}
        viewAllLink="/popular"
      />
    </div>
  );
};

export default HomePage;
