import {PaymentStatus} from "../entities/purchase.entity.js"

export function mapMPStatus(mpStatus: string): PaymentStatus {
  switch (mpStatus) {
    case "approved":
      return PaymentStatus.APPROVED;

    case "cancelled":
      return PaymentStatus.CANCELLED;

    case "pending":
    case "in_process":
      return PaymentStatus.PENDING;

    default:
      return PaymentStatus.REJECTED;
  }
}