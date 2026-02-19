import { expect, test } from 'vitest'
import { mapMPStatus } from '../../services/paymentStatusMapper'
import { PaymentStatus } from '../../entities/purchase.entity'

test('mapMPStatus deberia mapear el estado de Mercado Pago al PaymentStatus enum', () => {
  expect(mapMPStatus('approved')).toBe(PaymentStatus.APPROVED)
  expect(mapMPStatus('cancelled')).toBe(PaymentStatus.CANCELLED)
  expect(mapMPStatus('pending')).toBe(PaymentStatus.PENDING)
  expect(mapMPStatus('in_process')).toBe(PaymentStatus.PENDING)
  expect(mapMPStatus('rejected')).toBe(PaymentStatus.REJECTED)
  expect(mapMPStatus('unknown')).toBe(PaymentStatus.REJECTED)
})
