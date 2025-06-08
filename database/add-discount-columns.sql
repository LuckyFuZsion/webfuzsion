-- Add discount_percentage column if it doesn't exist
ALTER TABLE invoice_items 
ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL DEFAULT 0;

-- Add discount_amount column if it doesn't exist
ALTER TABLE invoice_items 
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL DEFAULT 0;

-- Add original_amount column if it doesn't exist
ALTER TABLE invoice_items 
ADD COLUMN IF NOT EXISTS original_amount DECIMAL DEFAULT 0;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'invoice_items' 
AND column_name IN ('discount_percentage', 'discount_amount', 'original_amount');
