
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Category } from "@/types";
import { fetchCategories } from "@/services/products";

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await fetchCategories(true); // Only show categories with products
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="wwe-container py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-wwe-navy mb-4">
            Browse Categories
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of product categories and find exactly what you need.
            From electronics to fashion, we've got everything covered.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className="aspect-video relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-white text-xl font-bold">{category.name}</h2>
                </div>
              </div>
              
              <div className="p-4">
                {category.subcategories && category.subcategories.length > 0 ? (
                  <div>
                    <h3 className="font-medium mb-2 text-gray-800">Subcategories:</h3>
                    <ul className="space-y-1">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory.id} className="text-gray-600 hover:text-wwe-navy">
                          • {subcategory.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-600">Explore all products in this category</p>
                )}

                <div className="mt-4 text-wwe-navy font-medium group-hover:underline">
                  Browse {category.name} →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
