-- Fix security issue: Add search_path to log_order_change function
-- Drop trigger first
DROP TRIGGER IF EXISTS track_order_changes ON orders;

-- Drop and recreate function with search_path
DROP FUNCTION IF EXISTS log_order_change();

CREATE OR REPLACE FUNCTION log_order_change()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Recreate trigger
CREATE TRIGGER track_order_changes
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION log_order_change();