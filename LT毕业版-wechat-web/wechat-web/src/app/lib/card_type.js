/**
 *On the card type
 */
//NOTE: 创始会员
export const FOUNDING_MEMBER_MONTH_ID = '6'
export const FOUNDING_MEMBER_ANNUAL_ID = '9'
export const FOUNDING_MEMBER_DISPLAY_NAME = '创始会员'

//NOTE: 员工会员
export const STAFF_MEMBER_MONTH_ID = '7'
export const STAFF_MEMBER_ANNUAL_ID = '11'
export const STAFF_MEMBER_DISPLAY_NAME = '员工会员'

//NOTE: 尊享会员
export const TO_ENJOY_THE_MEMBER_MONTH_ID = '8'
export const TO_ENJOY_THE_MEMBER_ANNUAL_ID = '10'
export const TO_ENJOY_THE_MEMBER_DISPLAY_NAME = '尊享会员'

// NOTE：度假套餐
export const OCCASION_MEMBER = 'beach_vacation'

/**
 * annual card type
 */
//NOTE: 年卡
export const ANNUAL_CARD_TYPE = 12
// NOTE: 季卡
export const SEASON_CARD = 3
//NOTE: 月卡
export const ON_THE_CARD = 1

// NOTE: vacation card(10 days)
export const VACATION_CARD = 10

/*
 * NOTE: different env paymen methods
 * -5 JD EVN
 * -2 h5 env exclude jd payment
 * -6 mini app
 * -3 wechat contract payment
 */

export const JD_PAYMENT_METHODS_ID = -5
export const UNWECHAT_PAYMENT_METHODS_ID = -2
export const MINI_APP_PAYMENT_METHODS_ID = -6

// 免密支付
export const WECHAT_CONTRACT_METHODS_ID = -3
export const MINIAPP_CONTRACT_METHODS_ID = -9

// NOTE: 免密支付最大的金额
export const MAX_CONTRACT_PAY_PRICE = 499

export const getCardType = interval => {
  if (interval === ANNUAL_CARD_TYPE) {
    return '年'
  } else if (interval === SEASON_CARD) {
    return '季'
  } else {
    return '月'
  }
}
