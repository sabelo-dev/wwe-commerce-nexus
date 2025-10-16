-- Add product_type column to products table
ALTER TABLE products 
ADD COLUMN product_type text NOT NULL DEFAULT 'simple' CHECK (product_type IN ('simple', 'variable', 'downloadable'));

-- Create downloadable_files table
CREATE TABLE downloadable_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size bigint,
  download_limit integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on downloadable_files
ALTER TABLE downloadable_files ENABLE ROW LEVEL SECURITY;

-- Vendors can manage downloadable files for their own products
CREATE POLICY "Vendors can manage downloadable files for their products"
ON downloadable_files
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM products p
    JOIN stores s ON p.store_id = s.id
    JOIN vendors v ON s.vendor_id = v.id
    WHERE p.id = downloadable_files.product_id
    AND v.user_id = auth.uid()
  )
);

-- Customers can view downloadable files for purchased products
CREATE POLICY "Customers can view purchased downloadable files"
ON downloadable_files
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE oi.product_id = downloadable_files.product_id
    AND o.user_id = auth.uid()
    AND o.payment_status = 'paid'
  )
);

-- Add updated_at trigger
CREATE TRIGGER update_downloadable_files_updated_at
  BEFORE UPDATE ON downloadable_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();