-- Create a sample vendor and store for the Air Jordan product with proper UUIDs
INSERT INTO vendors (id, user_id, business_name, description, status, subscription_tier, subscription_status)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567891'::uuid,
  'Jordan Brand',
  'Official Jordan Brand store offering premium athletic footwear and apparel',
  'approved',
  'premium',
  'active'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO stores (id, vendor_id, name, slug, description)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567892'::uuid,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
  'Jordan Brand Official Store',
  'jordan-brand-official',
  'The official Jordan Brand store featuring the latest releases and classic designs'
) ON CONFLICT (id) DO NOTHING;

-- Insert the Air Jordan product
INSERT INTO products (
  id,
  store_id,
  name,
  slug,
  description,
  price,
  compare_at_price,
  quantity,
  category,
  subcategory,
  status,
  rating,
  review_count,
  sku
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567893'::uuid,
  'a1b2c3d4-e5f6-7890-abcd-ef1234567892'::uuid,
  'Air Jordan 1 Low Method of Make',
  'air-jordan-1-low-method-of-make',
  'The latest luxe creation from the Method of Make series takes your ''fit beyond the norm. The tonal design is colour-matched throughout, from the tongue to the laces to the outsole. The oversized leather stitch detailing and super-clean metallic accents add a textural touch.

Benefits:
• Nike Air in the heel provides lightweight, resilient cushioning
• Solid-rubber outsoles give you ample everyday traction
• Leather in the upper offers durability and structure

Product Details:
• Wings logo on heel
• Stitched Swoosh logo
• Classic laces
• Colour: Sail/Sail/Metallic Gold
• Style: FN5032-100
• Origin: China

Available Sizes: UK 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 9',
  2339.96,
  2599.95,
  50,
  'Clothing',
  'Women''s Shoes',
  'approved',
  4.8,
  127,
  'FN5032-100'
) ON CONFLICT (id) DO NOTHING;

-- Insert product images
INSERT INTO product_images (product_id, image_url, position) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567893'::uuid, '/lovable-uploads/036486dd-58ef-4820-affc-ada0d6e33abf.png', 0),
('a1b2c3d4-e5f6-7890-abcd-ef1234567893'::uuid, '/lovable-uploads/35181d03-25c2-4dd1-be10-216f8ef71707.png', 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567893'::uuid, '/lovable-uploads/0f583fc2-9bf5-430d-aac3-50000174d44c.png', 2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567893'::uuid, '/lovable-uploads/cc1c3791-fb45-4e3a-ab5e-627ffbf2324c.png', 3),
('a1b2c3d4-e5f6-7890-abcd-ef1234567893'::uuid, '/lovable-uploads/0173f645-3b83-43a6-8daa-2e2f763357b2.png', 4),
('a1b2c3d4-e5f6-7890-abcd-ef1234567893'::uuid, '/lovable-uploads/5e0d5e6a-1782-450c-ad72-43580758fac5.png', 5),
('a1b2c3d4-e5f6-7890-abcd-ef1234567893'::uuid, '/lovable-uploads/c21e9f19-731a-4c8b-a998-79c7bd282c43.png', 6),
('a1b2c3d4-e5f6-7890-abcd-ef1234567893'::uuid, '/lovable-uploads/ffba5f85-dc45-43ea-944c-a91b03a62681.png', 7)
ON CONFLICT DO NOTHING;