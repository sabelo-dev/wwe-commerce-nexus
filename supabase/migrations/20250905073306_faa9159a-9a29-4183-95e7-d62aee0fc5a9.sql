-- Clear all existing users and profiles
DELETE FROM public.profiles;
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