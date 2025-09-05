-- Clear all data in the correct order to handle foreign key constraints

-- Clear order items first
DELETE FROM public.order_items;

-- Clear orders 
DELETE FROM public.orders;

-- Clear product variations and images
DELETE FROM public.product_variations;
DELETE FROM public.product_images;

-- Clear collection products
DELETE FROM public.collection_products;

-- Clear products
DELETE FROM public.products;

-- Clear collections
DELETE FROM public.collections;

-- Clear store categories
DELETE FROM public.store_categories;

-- Clear stores
DELETE FROM public.stores;

-- Clear vendor documents and notifications
DELETE FROM public.vendor_documents;
DELETE FROM public.vendor_notifications;

-- Clear payouts
DELETE FROM public.payouts;

-- Clear import jobs
DELETE FROM public.import_jobs;

-- Clear WeFulFil data
DELETE FROM public.wefullfil_product_variants;
DELETE FROM public.wefullfil_products;

-- Clear vendors
DELETE FROM public.vendors;

-- Clear profiles
DELETE FROM public.profiles;

-- Now clear auth.users
DELETE FROM auth.users;

-- Create new test users directly in auth.users table
-- Note: This is for development/testing only. In production, users should be created through the signup flow.

-- Insert consumer user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'zwidekasabelo@gmail.com',
  crypt('Hermes@143', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"name": "Consumer User", "role": "consumer"}'::jsonb,
  false
);

-- Insert admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'lsigroupapi@gmail.com',
  crypt('Hermes@143', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"name": "Admin User", "role": "admin"}'::jsonb,
  false
);

-- Insert vendor user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'lsigroupafrica@gmail.com',
  crypt('Hermes@143', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"name": "Vendor User", "role": "vendor"}'::jsonb,
  false
);

-- The profiles will be automatically created by the handle_new_user trigger