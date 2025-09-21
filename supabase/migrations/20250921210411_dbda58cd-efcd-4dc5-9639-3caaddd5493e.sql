-- Create storage buckets for vendor uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('vendor-logos', 'vendor-logos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('vendor-banners', 'vendor-banners', true);

-- Create RLS policies for vendor logos
CREATE POLICY "Vendors can upload their own logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'vendor-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Vendors can update their own logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'vendor-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view vendor logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'vendor-logos');

CREATE POLICY "Vendors can delete their own logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'vendor-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create RLS policies for vendor banners
CREATE POLICY "Vendors can upload their own banners" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'vendor-banners' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Vendors can update their own banners" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'vendor-banners' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view vendor banners" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'vendor-banners');

CREATE POLICY "Vendors can delete their own banners" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'vendor-banners' AND auth.uid()::text = (storage.foldername(name))[1]);