-- Fix auth schema confirmation_token issue
-- The issue is with NULL values in confirmation_token column that should be nullable

-- First, let's check if we can fix the auth.users table confirmation_token column
-- by ensuring it properly handles NULL values

-- Update any existing users with NULL confirmation_token to have empty string
UPDATE auth.users 
SET confirmation_token = COALESCE(confirmation_token, '')
WHERE confirmation_token IS NULL;

-- Also ensure the column is properly configured to handle NULLs
-- This should be handled by Supabase, but we can check constraints

-- Clear any problematic auth data and ensure clean state
DELETE FROM auth.sessions WHERE expires_at < NOW();
DELETE FROM auth.refresh_tokens WHERE expires_at < NOW();

-- Ensure our profiles table trigger is working properly
-- and recreate it if needed
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();