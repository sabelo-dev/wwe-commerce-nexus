
import { Product } from "@/types";

export const airJordanSample: Product = {
  id: "air-jordan-1-low-mom",
  name: "Air Jordan 1 Low Method of Make",
  slug: "air-jordan-1-low-method-of-make",
  description: "The latest luxe creation from the Method of Make series takes your 'fit beyond the norm. The tonal design is colour-matched throughout, from the tongue to the laces to the outsole. The oversized leather stitch detailing and super-clean metallic accents add a textural touch.",
  price: 2339.96, // R 2,599.95 with 10% off
  compareAtPrice: 2599.95, // Original price
  images: [
    "/lovable-uploads/036486dd-58ef-4820-affc-ada0d6e33abf.png",
    "/lovable-uploads/35181d03-25c2-4dd1-be10-216f8ef71707.png",
    "/lovable-uploads/0f583fc2-9bf5-430d-aac3-50000174d44c.png",
    "/lovable-uploads/cc1c3791-fb45-4e3a-ab5e-627ffbf2324c.png",
    "/lovable-uploads/0173f645-3b83-43a6-8daa-2e2f763357b2.png",
    "/lovable-uploads/5e0d5e6a-1782-450c-ad72-43580758fac5.png",
    "/lovable-uploads/c21e9f19-731a-4c8b-a998-79c7bd282c43.png",
    "/lovable-uploads/ffba5f85-dc45-43ea-944c-a91b03a62681.png"
  ],
  category: "Clothing",
  subcategory: "Women's Shoes",
  rating: 4.8,
  reviewCount: 127,
  inStock: true,
  vendorId: "nike-jordan",
  vendorName: "Jordan Brand",
  createdAt: new Date().toISOString(),
};

export const sampleProducts = [airJordanSample];
