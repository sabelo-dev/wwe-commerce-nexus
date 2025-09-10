-- Create test users for each role to verify authentication is working
-- These will help test the login/register functionality

-- First, let's insert test profile data directly since we now have proper auth handling
INSERT INTO public.profiles (id, email, name, role) VALUES 
(
  gen_random_uuid(),
  'consumer@test.com',
  'Test Consumer',
  'consumer'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO public.profiles (id, email, name, role) VALUES 
(
  gen_random_uuid(),
  'vendor@test.com', 
  'Test Vendor',
  'vendor'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO public.profiles (id, email, name, role) VALUES 
(
  gen_random_uuid(),
  'admin@test.com',
  'Test Admin', 
  'admin'
) ON CONFLICT (email) DO NOTHING;