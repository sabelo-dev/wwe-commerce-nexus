-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for product images storage
CREATE POLICY "Anyone can view product images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Vendors can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM vendors 
    WHERE vendors.user_id = auth.uid()
  )
);

CREATE POLICY "Vendors can update their product images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM vendors 
    WHERE vendors.user_id = auth.uid()
  )
);

CREATE POLICY "Vendors can delete their product images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM vendors 
    WHERE vendors.user_id = auth.uid()
  )
);