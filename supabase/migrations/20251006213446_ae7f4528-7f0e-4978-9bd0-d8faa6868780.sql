-- Add courier and delivery tracking fields to orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS courier_name TEXT,
ADD COLUMN IF NOT EXISTS courier_phone TEXT,
ADD COLUMN IF NOT EXISTS courier_company TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery DATE,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add refund/return tracking fields
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS refund_status TEXT CHECK (refund_status IN ('none', 'requested', 'approved', 'rejected', 'completed')),
ADD COLUMN IF NOT EXISTS refund_amount NUMERIC,
ADD COLUMN IF NOT EXISTS refund_reason TEXT,
ADD COLUMN IF NOT EXISTS return_status TEXT CHECK (return_status IN ('none', 'requested', 'approved', 'rejected', 'completed')),
ADD COLUMN IF NOT EXISTS return_reason TEXT;

-- Set default values
UPDATE orders SET refund_status = 'none' WHERE refund_status IS NULL;
UPDATE orders SET return_status = 'none' WHERE return_status IS NULL;

-- Create order history table for tracking all changes
CREATE TABLE IF NOT EXISTS order_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on order_history
ALTER TABLE order_history ENABLE ROW LEVEL SECURITY;

-- Policies for order_history
CREATE POLICY "Admins can view all order history"
  ON order_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Vendors can view order history for their orders"
  ON order_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      JOIN stores s ON s.id = oi.store_id
      JOIN vendors v ON v.id = s.vendor_id
      WHERE o.id = order_history.order_id
      AND v.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert order history"
  ON order_history FOR INSERT
  WITH CHECK (true);

-- Create function to log order changes
CREATE OR REPLACE FUNCTION log_order_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO order_history (order_id, user_id, action, details)
  VALUES (
    NEW.id,
    auth.uid(),
    TG_OP,
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for order updates
DROP TRIGGER IF EXISTS track_order_changes ON orders;
CREATE TRIGGER track_order_changes
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION log_order_change();