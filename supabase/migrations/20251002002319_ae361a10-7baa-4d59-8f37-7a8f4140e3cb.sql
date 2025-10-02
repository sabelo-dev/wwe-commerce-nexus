-- Create storage policies for vendor-banners bucket
-- These policies allow authenticated vendors to upload/manage their banners

-- Policy for viewing vendor banners (public access)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vendor-banners');

-- Policy for inserting vendor banners
CREATE POLICY "Authenticated users can upload banners"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vendor-banners');

-- Policy for updating vendor banners
CREATE POLICY "Authenticated users can update banners"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'vendor-banners');

-- Policy for deleting vendor banners
CREATE POLICY "Authenticated users can delete banners"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'vendor-banners');

-- Also add policies for vendor-logos bucket
CREATE POLICY "Public Access to logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vendor-logos');

CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vendor-logos');

CREATE POLICY "Authenticated users can update logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'vendor-logos');

CREATE POLICY "Authenticated users can delete logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'vendor-logos');

-- Add policies for product-images bucket
CREATE POLICY "Public Access to product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');