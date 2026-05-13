-- Add philosophy column to personal table as JSONB
ALTER TABLE personal ADD COLUMN IF NOT EXISTS philosophy JSONB DEFAULT '[]'::jsonb;

-- We can drop the philosophy table if it was created but not working
DROP TABLE IF EXISTS philosophy;
