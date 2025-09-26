-- Fix RLS policies for vendor storage uploads
-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Vendors can upload their own banners" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can update their own banners" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can delete their own banners" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can upload their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can update their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can delete their own logos" ON storage.objects;

-- Create more permissive policies for vendor banners
CREATE POLICY "Vendors can upload banners" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'vendor-banners' AND 
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM vendors 
    WHERE vendors.user_id = auth.uid()
  )
);

CREATE POLICY "Vendors can update banners" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'vendor-banners' AND 
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM vendors 
    WHERE vendors.user_id = auth.uid()
  )
);

CREATE POLICY "Vendors can delete banners" ON storage.objects
FOR DELETE USING (
  bucket_id = 'vendor-banners' AND 
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM vendors 
    WHERE vendors.user_id = auth.uid()
  )
);

-- Create more permissive policies for vendor logos
CREATE POLICY "Vendors can upload logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'vendor-logos' AND 
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM vendors 
    WHERE vendors.user_id = auth.uid()
  )
);

CREATE POLICY "Vendors can update logos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'vendor-logos' AND 
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM vendors 
    WHERE vendors.user_id = auth.uid()
  )
);

CREATE POLICY "Vendors can delete logos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'vendor-logos' AND 
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM vendors 
    WHERE vendors.user_id = auth.uid()
  )
);