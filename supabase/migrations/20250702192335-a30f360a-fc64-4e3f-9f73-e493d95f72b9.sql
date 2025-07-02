-- Add subscription fields to vendors table
ALTER TABLE public.vendors 
ADD COLUMN subscription_tier TEXT DEFAULT 'trial',
ADD COLUMN trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN trial_end_date TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '90 days'),
ADD COLUMN subscription_status TEXT DEFAULT 'trial',
ADD COLUMN subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  billing_period TEXT NOT NULL DEFAULT 'monthly', -- monthly, yearly
  features JSONB NOT NULL DEFAULT '[]',
  max_products INTEGER,
  max_orders INTEGER,
  support_level TEXT DEFAULT 'basic',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, price, billing_period, features, max_products, max_orders, support_level) VALUES
('Trial', 0, 'monthly', '["Basic dashboard", "Up to 10 products", "Basic analytics"]', 10, 50, 'basic'),
('Standard', 29.99, 'monthly', '["Full dashboard", "Up to 100 products", "Basic analytics", "Email support"]', 100, 500, 'standard'),
('Premium', 99.99, 'monthly', '["Full dashboard", "Unlimited products", "Advanced analytics", "Priority support", "Custom branding", "API access"]', NULL, NULL, 'premium');

-- Enable RLS on subscription_plans
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing subscription plans
CREATE POLICY "Anyone can view subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (true);

-- Create function to check if vendor trial has expired
CREATE OR REPLACE FUNCTION public.is_trial_expired(vendor_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT 
    CASE 
      WHEN v.subscription_tier = 'trial' AND v.trial_end_date < now() THEN true
      ELSE false
    END
  FROM vendors v
  WHERE v.id = vendor_id;
$$;

-- Create function to get vendor subscription features
CREATE OR REPLACE FUNCTION public.get_vendor_features(vendor_id UUID)
RETURNS JSONB
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT 
    CASE 
      WHEN v.subscription_tier = 'trial' THEN sp.features
      WHEN v.subscription_tier = 'standard' THEN sp.features
      WHEN v.subscription_tier = 'premium' THEN sp.features
      ELSE '[]'::jsonb
    END
  FROM vendors v
  LEFT JOIN subscription_plans sp ON sp.name = INITCAP(v.subscription_tier)
  WHERE v.id = vendor_id;
$$;

-- Add trigger to update subscription plans updated_at
CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();