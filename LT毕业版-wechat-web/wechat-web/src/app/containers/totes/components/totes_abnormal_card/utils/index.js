const isRoleCard = ['errors_first_tote_gift']

const isOrder = ['errors_need_recharge_account', 'errors_need_payment']

const isSeviceHold = [
  'error_subscription_requesting_resume',
  'errors_subscription_on_hold',
  'errors_subscription_hold_pending'
]

const isCustomerStatus = [
  'errors_subscription_disabled',
  'errors_tote_left_zero'
]

const isToteReturn = [
  'scheduled_but_courier_not_pickup',
  'return_prev_tote_with_free_service',
  'urgently_return_prev_tote_with_free_service',
  'return_prev_tote',
  'urgently_return_prev_tote'
]

export { isRoleCard, isOrder, isSeviceHold, isCustomerStatus, isToteReturn }
