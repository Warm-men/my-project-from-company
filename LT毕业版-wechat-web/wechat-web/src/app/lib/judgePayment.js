// braintree
// wechat
// wechat_native
// wechat_web
// wechat_contract_official
// wechat_contract_native
// wechat_mini_app
// jd_pay_web
// jd_pay_native
// alipay_native
// wechat_contract_mini

export const judgePayment = gatewat => {
  if (_.includes(gatewat, 'wechat')) {
    return '微信支付'
  } else if (_.includes(gatewat, 'alipay')) {
    return '支付宝支付'
  } else if (_.includes(gatewat, 'jd_pay')) {
    return '京东支付'
  }
  return '其他支付'
}
