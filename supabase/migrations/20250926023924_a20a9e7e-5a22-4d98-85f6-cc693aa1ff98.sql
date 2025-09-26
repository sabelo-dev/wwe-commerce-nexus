-- Insert default categories
INSERT INTO public.categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Electronic devices and gadgets'),
('Clothing', 'clothing', 'Fashion and apparel'),
('Home & Garden', 'home-garden', 'Home improvement and gardening supplies'),
('Sports & Outdoors', 'sports-outdoors', 'Sporting goods and outdoor equipment'),
('Books', 'books', 'Books and educational materials'),
('Toys & Games', 'toys-games', 'Toys, games, and entertainment'),
('Health & Beauty', 'health-beauty', 'Health, beauty, and personal care'),
('Automotive', 'automotive', 'Auto parts and accessories');

-- Insert subcategories for Electronics
INSERT INTO public.subcategories (category_id, name, slug) 
SELECT c.id, sub.name, sub.slug FROM public.categories c
CROSS JOIN (VALUES 
  ('Smartphones', 'smartphones'),
  ('Laptops', 'laptops'),
  ('Tablets', 'tablets'),
  ('Cameras', 'cameras'),
  ('Headphones', 'headphones'),
  ('Smart Home', 'smart-home')
) AS sub(name, slug)
WHERE c.slug = 'electronics';

-- Insert subcategories for Clothing
INSERT INTO public.subcategories (category_id, name, slug) 
SELECT c.id, sub.name, sub.slug FROM public.categories c
CROSS JOIN (VALUES 
  ('Mens Clothing', 'mens-clothing'),
  ('Womens Clothing', 'womens-clothing'),
  ('Kids Clothing', 'kids-clothing'),
  ('Shoes', 'shoes'),
  ('Accessories', 'accessories')
) AS sub(name, slug)
WHERE c.slug = 'clothing';

-- Insert subcategories for Home & Garden
INSERT INTO public.subcategories (category_id, name, slug) 
SELECT c.id, sub.name, sub.slug FROM public.categories c
CROSS JOIN (VALUES 
  ('Furniture', 'furniture'),
  ('Kitchen & Dining', 'kitchen-dining'),
  ('Appliances', 'appliances'),
  ('Garden Tools', 'garden-tools'),
  ('Decor', 'decor')
) AS sub(name, slug)
WHERE c.slug = 'home-garden';

-- Insert subcategories for Sports & Outdoors
INSERT INTO public.subcategories (category_id, name, slug) 
SELECT c.id, sub.name, sub.slug FROM public.categories c
CROSS JOIN (VALUES 
  ('Fitness Equipment', 'fitness-equipment'),
  ('Outdoor Gear', 'outdoor-gear'),
  ('Team Sports', 'team-sports'),
  ('Water Sports', 'water-sports')
) AS sub(name, slug)
WHERE c.slug = 'sports-outdoors';