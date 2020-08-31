import {
  JD_PAYMENT_METHODS_ID,
  UNWECHAT_PAYMENT_METHODS_ID,
  MINI_APP_PAYMENT_METHODS_ID
} from 'src/app/lib/card_type.js'

export const paymentMethodId = (platform, payment_methods) => {
  let payment_method_id = ''
  const payment_method = _.find(payment_methods, {
    payment_gateway: platform
  })
  if (platform === 'mini_app') {
    payment_method_id = MINI_APP_PAYMENT_METHODS_ID
  } else if (platform === 'wechat') {
    payment_method_id = !_.isEmpty(payment_method) && payment_method.id
  } else if (platform === 'jd') {
    payment_method_id = JD_PAYMENT_METHODS_ID
  } else {
    payment_method_id = UNWECHAT_PAYMENT_METHODS_ID
  }
  return payment_method_id
}
