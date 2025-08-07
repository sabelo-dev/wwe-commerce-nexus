-- Update the app_role enum to include consumer if not already present
DO $$ 
BEGIN
    -- Check if consumer role exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'consumer' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
        ALTER TYPE app_role ADD VALUE 'consumer';
    END IF;
END $$;

-- Ensure profiles table has proper default role
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'consumer'::app_role;

-- Update any existing profiles without roles to consumer
UPDATE profiles SET role = 'consumer'::app_role WHERE role IS NULL;