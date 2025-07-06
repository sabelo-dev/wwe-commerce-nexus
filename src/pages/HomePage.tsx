
import React, { useState, useEffect } from "react";
import Hero from "@/components/home/Hero";
import CategorySection from "@/components/home/CategorySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoSection from "@/components/home/PromoSection";
import { Product, Category } from "@/types";
import { 
  fetchCategories, 
  fetchFeaturedProducts, 
  fetchNewArrivals, 
  fetchPopularProducts 
} from "@/services/products";

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesData, featuredData, newArrivalsData, popularData] = await Promise.all([
          fetchCategories(),
          fetchFeaturedProducts(4),
          fetchNewArrivals(4),
          fetchPopularProducts(4)
        ]);

        setCategories(categoriesData);
        setFeaturedProducts(featuredData);
        setNewArrivals(newArrivalsData);
        setPopularProducts(popularData);
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <CategorySection categories={categories} />
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
