const errorHint = {
  error_need_payment: {
    title: '待支付订单提醒',
    buttonText: '去付款',
    link: '/payment_pending'
  },
  error_subscription_inactive: {
    title: '会员已过期',
    buttonText: '去续费',
    link: '/plans'
  },
  error_scheduled_pickup: {
    title: '预约归还提醒',
    buttonText: '去开通',
    link: '/open_free_service'
  },
  error_need_recharge_account: {
    title: '欠款提醒',
    buttonText: '去处理',
    link: '/credit_account'
  },
  error_run_out_of_subscription_totes: {
    title: '续费提醒',
    buttonText: '去续费',
    link: '/plans'
  },
  error_tote_category_rule_valid_fail: {
    buttonText: '我知道了',
    hasCancel: true
  }
}

const getToteCartError = validate_result => {
  if (_.isEmpty(validate_result) || _.isEmpty(validate_result.errors)) {
    return null
  }
  const { errors } = validate_result
  const { error_code, message } = errors[0]
  const hintErrorsObj = errorHint[error_code]
  if (!_.isEmpty(hintErrorsObj)) {
    hintErrorsObj['content'] = message
    return hintErrorsObj
  }
  return message
}

const isNotShowErrorText = [
  'error_tote_delivered_not_long_ago',
  'error_over_two_incomming_totes',
  'error_already_has_a_new_tote',
  'error_tote_cart_not_full',
  'error_need_identity_authentication',
  'error_not_support_subscription_type'
]

export { getToteCartError, isNotShowErrorText }
