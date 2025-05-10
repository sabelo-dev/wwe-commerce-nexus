
import React from "react";
import { Link } from "react-router-dom";
import { Category } from "@/types";

interface CategorySectionProps {
  categories: Category[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="wwe-container">
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-wwe-navy mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Browse our wide selection of products across popular categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover object-center transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-medium text-center">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
