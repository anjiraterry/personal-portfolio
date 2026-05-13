-- Add philosophy table
CREATE TABLE IF NOT EXISTS philosophy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Lucide icon name
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE philosophy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read" ON philosophy FOR SELECT USING (true);
CREATE POLICY "Admin All" ON philosophy FOR ALL USING (auth.role() = 'authenticated');

-- Add tech field to focus_areas if not present
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='focus_areas' AND column_name='tech') THEN
    ALTER TABLE focus_areas ADD COLUMN tech TEXT[] DEFAULT '{}';
  END IF;
END $$;
