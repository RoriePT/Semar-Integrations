ALTER TABLE IF EXISTS midtrans
  ADD COLUMN IF NOT EXISTS disbursement_merchant_id character varying,
  ADD COLUMN IF NOT EXISTS disbursement_creator_api_key character varying,
  ADD COLUMN IF NOT EXISTS disbursement_creator_merchant_key character varying,
  ADD COLUMN IF NOT EXISTS disbursement_approver_api_key character varying,
  ADD COLUMN IF NOT EXISTS disbursement_approver_merchant_key character varying,
  ADD COLUMN IF NOT EXISTS sandbox_disbursement_merchant_id character varying,
  ADD COLUMN IF NOT EXISTS sandbox_disbursement_creator_api_key character varying,
  ADD COLUMN IF NOT EXISTS sandbox_disbursement_creator_merchant_key character varying,
  ADD COLUMN IF NOT EXISTS sandbox_disbursement_approver_api_key character varying,
  ADD COLUMN IF NOT EXISTS sandbox_disbursement_approver_merchant_key character varying;
