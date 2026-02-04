export enum AlertType {
  WITHDRAWAL_COMPLETE = "withdrawal_complete",
  WITHDRAWAL_REJECTED = "withdrawal_rejected",
  WITHDRAWAL_FAILED = "withdrawal_failed",
  PAYOUT_SUCCESS = "payout_success",
  PAYOUT_FAILED = "payout_failed",
  USER_PAYIN_LIMIT = "user_payin_limit",
}

export enum NotificationType {
  GRAB_PAYOUT = "grab_payout",
  GRAB_TOPUP = "grab_topup",
  PAYOUT_VERIFIED = "payout_verified",
  PAYOUT_REJECTED = "payout_rejected",
  TOPUP_VERIFIED = "topup_verified",
  TOPUP_REJETCED = "topup_rejected",
  PAYIN_FOR_VERIFY = "payin_for_verify",
}
