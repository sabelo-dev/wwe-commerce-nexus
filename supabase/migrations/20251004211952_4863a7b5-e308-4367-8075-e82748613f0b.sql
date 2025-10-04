-- Create platform_settings table
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_name text NOT NULL DEFAULT 'WWE Marketplace',
  platform_email text NOT NULL,
  platform_fee numeric NOT NULL DEFAULT 5,
  vendor_fee numeric NOT NULL DEFAULT 10,
  support_email text NOT NULL,
  terms_of_service text,
  privacy_policy text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can view platform settings
CREATE POLICY "Admins can view platform settings"
  ON public.platform_settings
  FOR SELECT
  USING (is_admin());

-- Only admins can update platform settings
CREATE POLICY "Admins can update platform settings"
  ON public.platform_settings
  FOR UPDATE
  USING (is_admin());

-- Only admins can insert platform settings
CREATE POLICY "Admins can insert platform settings"
  ON public.platform_settings
  FOR INSERT
  WITH CHECK (is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO public.platform_settings (
  platform_name,
  platform_email,
  platform_fee,
  vendor_fee,
  support_email,
  terms_of_service,
  privacy_policy
) VALUES (
  'WWE Marketplace',
  'support@wwe-marketplace.com',
  5,
  10,
  'help@wwe-marketplace.com',
  'Standard terms of service for WWE marketplace...',
  'Privacy policy for WWE marketplace...'
);