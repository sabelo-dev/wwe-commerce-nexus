-- Create shipping_zones table for region-based shipping
CREATE TABLE public.shipping_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  countries JSONB NOT NULL DEFAULT '[]'::jsonb,
  provinces JSONB DEFAULT '[]'::jsonb,
  postal_codes JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shipping_rates table
CREATE TABLE public.shipping_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id UUID NOT NULL REFERENCES public.shipping_zones(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rate_type TEXT NOT NULL CHECK (rate_type IN ('flat', 'weight_based', 'order_value')),
  min_order_value NUMERIC DEFAULT 0,
  max_order_value NUMERIC,
  min_weight NUMERIC DEFAULT 0,
  max_weight NUMERIC,
  price NUMERIC NOT NULL DEFAULT 0,
  free_shipping_threshold NUMERIC,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;

-- Policies for shipping_zones
CREATE POLICY "Anyone can view active shipping zones"
ON public.shipping_zones
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage shipping zones"
ON public.shipping_zones
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Policies for shipping_rates
CREATE POLICY "Anyone can view active shipping rates"
ON public.shipping_rates
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage shipping rates"
ON public.shipping_rates
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_shipping_zones_updated_at
BEFORE UPDATE ON public.shipping_zones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipping_rates_updated_at
BEFORE UPDATE ON public.shipping_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default shipping zones for South Africa
INSERT INTO public.shipping_zones (name, countries, provinces) VALUES
('South Africa - Major Cities', '["ZA"]'::jsonb, '["Gauteng", "Western Cape", "KwaZulu-Natal"]'::jsonb),
('South Africa - Other Regions', '["ZA"]'::jsonb, '["Eastern Cape", "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"]'::jsonb),
('International', '["*"]'::jsonb, '[]'::jsonb);

-- Insert default shipping rates
INSERT INTO public.shipping_rates (zone_id, name, rate_type, min_order_value, max_order_value, price, free_shipping_threshold)
SELECT 
  z.id,
  'Standard Shipping',
  'order_value',
  0,
  500,
  50,
  1000
FROM public.shipping_zones z
WHERE z.name = 'South Africa - Major Cities';

INSERT INTO public.shipping_rates (zone_id, name, rate_type, min_order_value, max_order_value, price, free_shipping_threshold)
SELECT 
  z.id,
  'Standard Shipping',
  'order_value',
  0,
  500,
  75,
  1500
FROM public.shipping_zones z
WHERE z.name = 'South Africa - Other Regions';

INSERT INTO public.shipping_rates (zone_id, name, rate_type, min_order_value, price)
SELECT 
  z.id,
  'International Shipping',
  'order_value',
  0,
  150
FROM public.shipping_zones z
WHERE z.name = 'International';