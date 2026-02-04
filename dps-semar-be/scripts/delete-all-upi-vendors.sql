-- ============================================================================
-- Script to delete all UPI vendors and their related data
-- ============================================================================
-- 
-- WARNING: This script will permanently delete:
--   - All UPI vendors
--   - All UPI IDs associated with UPI vendors (where isUpiVendor = true)
--   - All Payin orders that reference UPI vendors (all payin_made_on values)
--   - All Transaction Updates related to UPI vendors (all user types for UPI vendor identities)
--   - All Transaction Updates that reference Payin orders belonging to UPI vendors
--   - All Fund Records related to UPI vendors (all balance types)
--   - All Settlements related to UPI vendors
--   - All Identities with userType = 'UPI_VENDOR'
--
-- IMPORTANT: 
--   1. BACKUP YOUR DATABASE BEFORE RUNNING THIS SCRIPT
--   2. Run the PREVIEW QUERIES first to see what will be deleted
--   3. This script is wrapped in a transaction - you can ROLLBACK if needed
--   4. Review the results before committing
--
-- Usage:
--   Option 1: Run preview queries first, then the deletion script
--     psql -h <host> -U <username> -d <database> -f delete-all-upi-vendors.sql
--
--   Option 2: Copy and paste into psql, then COMMIT or ROLLBACK at the end
--
-- ============================================================================

-- ============================================================================
-- PREVIEW QUERIES - Run these first to see what will be deleted
-- ============================================================================

-- Preview: Count of records that will be deleted
SELECT 
    'Fund Records (All)' as table_name,
    COUNT(*) as count
FROM fund_record
WHERE identity_id IN (SELECT id FROM identity WHERE user_type = 'UPI_VENDOR')
UNION ALL
SELECT 
    'Transaction Updates (All for UPI Vendor Identities)' as table_name,
    COUNT(*) as count
FROM transaction_update
WHERE identity_id IN (SELECT id FROM identity WHERE user_type = 'UPI_VENDOR')
UNION ALL
SELECT 
    'Transaction Updates (Referencing UPI Vendor Payins)' as table_name,
    COUNT(*) as count
FROM transaction_update
WHERE payin_order_id IN (
    SELECT id FROM payin 
    WHERE upi_vendor_id IN (SELECT id FROM upi_vendor)
)
UNION ALL
SELECT 
    'Settlements' as table_name,
    COUNT(*) as count
FROM settlement
WHERE upi_vendor_id IN (SELECT id FROM upi_vendor)
UNION ALL
SELECT 
    'Payin Orders (All referencing UPI Vendors)' as table_name,
    COUNT(*) as count
FROM payin
WHERE upi_vendor_id IN (SELECT id FROM upi_vendor)
UNION ALL
SELECT 
    'UPI Records' as table_name,
    COUNT(*) as count
FROM upi
WHERE identity_id IN (SELECT id FROM identity WHERE user_type = 'UPI_VENDOR')
AND is_upi_vendor = true
UNION ALL
SELECT 
    'Identities' as table_name,
    COUNT(*) as count
FROM identity
WHERE user_type = 'UPI_VENDOR'
UNION ALL
SELECT 
    'UPI Vendors' as table_name,
    COUNT(*) as count
FROM upi_vendor;

-- Preview: List of UPI vendors that will be deleted
SELECT 
    uv.id, 
    uv.first_name, 
    uv.last_name, 
    uv.phone, 
    i.email 
FROM upi_vendor uv
LEFT JOIN identity i ON uv.identity = i.id
ORDER BY uv.id;

-- ============================================================================
-- DELETION SCRIPT - Run this in a transaction
-- ============================================================================

BEGIN;

-- Step 1: Delete Fund Records related to UPI vendors
-- Delete ALL fund records that reference UPI vendor identities (to avoid FK constraint violations)
-- This includes UPI_VENDOR_COMMISSION and any other balance types that might reference UPI vendors
DELETE FROM fund_record
WHERE identity_id IN (
    SELECT id FROM identity WHERE user_type = 'UPI_VENDOR'
);

-- Step 2: Delete Transaction Updates related to UPI vendors
-- Delete ALL transaction updates that reference UPI vendor identities (to avoid FK constraint violations)
DELETE FROM transaction_update
WHERE identity_id IN (
    SELECT id FROM identity WHERE user_type = 'UPI_VENDOR'
);

-- Also delete transaction updates that reference Payin orders belonging to UPI vendors
-- (These might be orphaned after we delete the payins, so delete them first)
-- Delete ALL transaction updates that reference ANY payin belonging to UPI vendors
DELETE FROM transaction_update
WHERE payin_order_id IN (
    SELECT id FROM payin 
    WHERE upi_vendor_id IN (SELECT id FROM upi_vendor)
);

-- Step 3: Delete Settlements related to UPI vendors
DELETE FROM settlement
WHERE upi_vendor_id IN (
    SELECT id FROM upi_vendor
);

-- Step 4: Delete Payin orders related to UPI vendors
-- Delete ALL payins that reference UPI vendors (regardless of payin_made_on value)
-- This is necessary to avoid FK constraint violations when deleting upi_vendor records
DELETE FROM payin
WHERE upi_vendor_id IN (
    SELECT id FROM upi_vendor
);

-- Step 5: Delete UPI records related to UPI vendor identities
-- UPI records where the identity is a UPI vendor identity and isUpiVendor is true
DELETE FROM upi
WHERE identity_id IN (
    SELECT id FROM identity WHERE user_type = 'UPI_VENDOR'
)
AND is_upi_vendor = true;

-- Step 6: Delete UPI Vendors FIRST (before identities, since upi_vendor has FK to identity)
-- We need to delete upi_vendor records before deleting the identity records they reference
DELETE FROM upi_vendor
WHERE identity IN (
    SELECT id FROM identity WHERE user_type = 'UPI_VENDOR'
);

-- Step 7: Delete Identities related to UPI vendors
-- Now that upi_vendor records are deleted, we can safely delete the identities
DELETE FROM identity
WHERE user_type = 'UPI_VENDOR';

-- Display summary
DO $$
DECLARE
    fund_records_deleted INTEGER;
    transaction_updates_deleted INTEGER;
    settlements_deleted INTEGER;
    payins_deleted INTEGER;
    upi_records_deleted INTEGER;
    identities_deleted INTEGER;
    upi_vendors_deleted INTEGER;
BEGIN
    -- Note: These counts are approximate as we can't get exact counts after deletion
    -- They show what was attempted to be deleted
    RAISE NOTICE 'Deletion completed. Summary:';
    RAISE NOTICE '- Fund Records: Deleted (related to UPI vendors)';
    RAISE NOTICE '- Transaction Updates: Deleted (UPI_VENDOR_COMMISSION)';
    RAISE NOTICE '- Settlements: Deleted (related to UPI vendors)';
    RAISE NOTICE '- Payin Orders: Deleted (all that reference UPI vendors)';
    RAISE NOTICE '- UPI Records: Deleted (where isUpiVendor = true)';
    RAISE NOTICE '- Identities: Deleted (where userType = UPI_VENDOR)';
    RAISE NOTICE '- UPI Vendors: Deleted';
    RAISE NOTICE '';
    RAISE NOTICE 'Transaction is ready to COMMIT or ROLLBACK.';
    RAISE NOTICE 'To commit: COMMIT;';
    RAISE NOTICE 'To rollback: ROLLBACK;';
END $$;

-- IMPORTANT: Review the changes before committing
-- Uncomment the line below to commit the transaction:
-- COMMIT;

-- To rollback instead, uncomment the line below:
-- ROLLBACK;

