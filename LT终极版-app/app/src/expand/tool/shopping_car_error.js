import _ from 'lodash'
const getError = errors => {
  let alertError = []
  let tipError = []
  let toastError = []
  let alertErrorCodes = [
    'error_need_payment',
    'error_need_recharge_account',
    'error_subscription_inactive',
    'error_run_out_of_subscription_totes',
    'error_scheduled_pickup',
    'error_scheduled_pickup_without_free_service',
    'error_need_identity_authentication',
    'error_not_support_subscription_type',
    'error_tote_category_rule_valid_fail'
  ]
  let tipErrorCodes = [
    'error_subscription_on_hold',
    'error_subscription_on_hold_requested',
    'error_tote_cart_item_unswappable'
  ]
  alertErrorCodes.forEach(i => {
    let errorItem = errors.find(function(item) {
      return item.error_code === i
    })
    if (errorItem) {
      alertError.push(errorItem)
    }
  })
  tipErrorCodes.forEach(i => {
    let errorItem = errors.find(function(item) {
      return item.error_code === i
    })
    if (errorItem) {
      tipError.push(errorItem)
    }
  })
  toastError = _.difference(errors, alertError)
  return { tipError, alertError, toastError }
}

const translationErrorCode = errorCode => {
  let title = ''
  let buttonTitle = ''
  let cancelButtonTitle = '取消' //默认有取消按钮
  switch (errorCode) {
    case 'error_need_payment':
      title = '待支付订单提醒'
      buttonTitle = '去付款'
      break
    case 'error_subscription_inactive':
      title = '会员已过期'
      buttonTitle = '去续费'
      break
    case 'error_scheduled_pickup':
      title = '预约归还提醒'
      buttonTitle = '去开通'
      break
    case 'error_scheduled_pickup_without_free_service':
      title = '预约归还提醒'
      buttonTitle = '好的'
      cancelButtonTitle = null
      break
    case 'error_need_recharge_account':
      title = '欠款提醒'
      buttonTitle = '去处理'
      break
    case 'error_run_out_of_subscription_totes':
      title = '续费提醒'
      buttonTitle = '去续费'
      break
    case 'error_tote_category_rule_valid_fail':
      buttonTitle = '我知道了'
      cancelButtonTitle = null
      break
  }
  return { title, buttonTitle, cancelButtonTitle }
}

export { getError, translationErrorCode }
