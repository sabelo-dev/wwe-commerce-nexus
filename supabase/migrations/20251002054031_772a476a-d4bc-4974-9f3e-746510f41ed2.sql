-- Add comprehensive vendor business information fields
-- These fields are required for complete vendor verification and compliance

ALTER TABLE public.vendors
ADD COLUMN IF NOT EXISTS business_email TEXT,
ADD COLUMN IF NOT EXISTS business_phone TEXT,
ADD COLUMN IF NOT EXISTS business_address TEXT,
ADD COLUMN IF NOT EXISTS business_type TEXT CHECK (business_type IN ('sole_proprietor', 'partnership', 'llc', 'corporation', 'other')),
ADD COLUMN IF NOT EXISTS tax_id TEXT,
ADD COLUMN IF NOT EXISTS website TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.vendors.business_email IS 'Primary business contact email';
COMMENT ON COLUMN public.vendors.business_phone IS 'Primary business contact phone number';
COMMENT ON COLUMN public.vendors.business_address IS 'Physical business address for verification';
COMMENT ON COLUMN public.vendors.business_type IS 'Legal structure of the business';
COMMENT ON COLUMN public.vendors.tax_id IS 'Tax identification number or VAT number for compliance';
COMMENT ON COLUMN public.vendors.website IS 'Optional business website URL';