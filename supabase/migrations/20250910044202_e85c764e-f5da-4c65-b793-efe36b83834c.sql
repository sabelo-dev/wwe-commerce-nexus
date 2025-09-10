-- Fix all auth schema NULL value issues
-- The problem is with multiple columns in auth.users that have NULL values 
-- but the auth system expects them to be non-NULL strings

-- Fix all potential NULL string columns in auth.users
UPDATE auth.users 
SET 
  confirmation_token = COALESCE(confirmation_token, ''),
  email_change = COALESCE(email_change, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  recovery_token = COALESCE(recovery_token, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, '')
WHERE 
  confirmation_token IS NULL 
  OR email_change IS NULL 
  OR email_change_token_new IS NULL 
  OR email_change_token_current IS NULL 
  OR recovery_token IS NULL 
  OR phone_change IS NULL 
  OR phone_change_token IS NULL;