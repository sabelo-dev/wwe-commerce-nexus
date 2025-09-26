-- Add image support to product_variations table
ALTER TABLE product_variations ADD COLUMN image_url text;

-- Create a separate table for variation images to support multiple images per variation
CREATE TABLE IF NOT EXISTS public.variation_images (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    variation_id uuid NOT NULL REFERENCES product_variations(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    position integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on variation_images
ALTER TABLE public.variation_images ENABLE ROW LEVEL SECURITY;

-- Create policies for variation_images
CREATE POLICY "Admins can view all variation_images" 
ON public.variation_images 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::app_role
));

CREATE POLICY "Anyone can view variation images for approved products" 
ON public.variation_images 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM product_variations pv
    JOIN products p ON p.id = pv.product_id
    WHERE pv.id = variation_images.variation_id 
    AND (p.status = 'approved' OR p.status = 'active')
));

CREATE POLICY "Vendors can manage variation images for their own products" 
ON public.variation_images 
FOR ALL 
USING (EXISTS (
    SELECT 1 FROM product_variations pv
    JOIN products p ON p.id = pv.product_id
    JOIN stores s ON p.store_id = s.id
    JOIN vendors v ON s.vendor_id = v.id
    WHERE pv.id = variation_images.variation_id 
    AND v.user_id = auth.uid()
));