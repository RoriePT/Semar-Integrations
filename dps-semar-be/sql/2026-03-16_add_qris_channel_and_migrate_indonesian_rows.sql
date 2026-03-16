-- 1) Add QRIS enum label to all relevant channel enum types if missing.
DO $$
DECLARE
  enum_type text;
BEGIN
  FOR enum_type IN
    SELECT DISTINCT t.typname
    FROM pg_type t
    JOIN pg_enum e ON e.enumtypid = t.oid
    WHERE e.enumlabel = 'UPI'
      AND t.typname IN (
        'channel_settings_channel_name_enum',
        'payin_channel_enum',
        'payin_sandbox_channel_enum',
        'payout_channel_enum',
        'withdrawal_channel_enum',
        'config_name_enum',
        'topup_channel_enum'
      )
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_enum pe
      JOIN pg_type pt ON pt.oid = pe.enumtypid
      WHERE pt.typname = enum_type AND pe.enumlabel = 'QRIS'
    ) THEN
      EXECUTE format('ALTER TYPE %I ADD VALUE ''QRIS''', enum_type);
    END IF;
  END LOOP;
END $$;

-- 2) Migrate only Indonesian gateway rows from UPI -> QRIS.
UPDATE channel_settings
SET channel_name = 'QRIS'
WHERE channel_name = 'UPI'
  AND gateway_name IN ('DOKU', 'MIDTRANS', 'XENDIT');

UPDATE payin
SET channel = 'QRIS'
WHERE channel = 'UPI'
  AND gateway_name IN ('DOKU', 'MIDTRANS', 'XENDIT');

UPDATE payin_sandbox
SET channel = 'QRIS'
WHERE channel = 'UPI'
  AND gateway_name IN ('DOKU', 'MIDTRANS', 'XENDIT');

-- 3) Verification queries.
-- SELECT gateway_name, type, channel_name, COUNT(*) FROM channel_settings
-- WHERE gateway_name IN ('DOKU','MIDTRANS','XENDIT')
-- GROUP BY gateway_name, type, channel_name ORDER BY gateway_name, type, channel_name;
--
-- SELECT gateway_name, channel, COUNT(*) FROM payin
-- WHERE gateway_name IN ('DOKU','MIDTRANS','XENDIT')
-- GROUP BY gateway_name, channel ORDER BY gateway_name, channel;
--
-- SELECT gateway_name, channel, COUNT(*) FROM payin_sandbox
-- WHERE gateway_name IN ('DOKU','MIDTRANS','XENDIT')
-- GROUP BY gateway_name, channel ORDER BY gateway_name, channel;
