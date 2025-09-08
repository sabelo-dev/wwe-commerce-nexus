-- Fix auth schema confirmation_token issue (simplified approach)
-- The issue is with NULL values in confirmation_token column

-- Update any existing users with NULL confirmation_token to have empty string
UPDATE auth.users 
SET confirmation_token = COALESCE(confirmation_token, '')
WHERE confirmation_token IS NULL;

-- Ensure our profiles table trigger is working properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();