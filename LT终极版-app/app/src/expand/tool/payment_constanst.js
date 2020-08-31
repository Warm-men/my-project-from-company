class PaymentConstants {
  id = {
    WECHAT_NATIVE_PAYMENT_ID: -1,
    JD_PAY_NATIVE_PAYMENT_ID: -7,
    ALPAY_NATIVE_PAYMENT_ID: -8,
    CONTRACT_PAYMENT_METHOD_ID: -4
  }
  type = {
    WECHAT_NATIVE: 'wechat_native',
    JD_PAY_NATIVE: 'jd_pay_native',
    ALIPAY_NATIVE: 'alipay_native',
    DEFAULT_PAYMENT_NATIVE: 'wechat_native'
  }
  icon = {
    WECHAT: require('../../../assets/images/account/wechatpay.png'),
    JDPAY: require('../../../assets/images/account/jdpay.png'),
    ALIPAY: require('../../../assets/images/account/alipay.png')
  }
}
export default new PaymentConstants()
