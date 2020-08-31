import {
  FOUNDING_MEMBER_MONTH_ID,
  FOUNDING_MEMBER_ANNUAL_ID,
  FOUNDING_MEMBER_DISPLAY_NAME,
  STAFF_MEMBER_MONTH_ID,
  STAFF_MEMBER_ANNUAL_ID,
  STAFF_MEMBER_DISPLAY_NAME,
  TO_ENJOY_THE_MEMBER_MONTH_ID,
  TO_ENJOY_THE_MEMBER_ANNUAL_ID,
  TO_ENJOY_THE_MEMBER_DISPLAY_NAME,
  OCCASION_MEMBER,
  ANNUAL_CARD_TYPE,
  SEASON_CARD,
  ON_THE_CARD,
  VACATION_CARD,
  JD_PAYMENT_METHODS_ID,
  UNWECHAT_PAYMENT_METHODS_ID,
  MINI_APP_PAYMENT_METHODS_ID,
  WECHAT_CONTRACT_METHODS_ID,
  MINIAPP_CONTRACT_METHODS_ID,
  MAX_CONTRACT_PAY_PRICE,
  getCardType
} from '../card_type'

describe('test card type constant , 创始会员', () => {
  it('创始会员月卡类型id === 6', () => {
    expect(FOUNDING_MEMBER_MONTH_ID).toBe('6')
  })
  it('创始会员年卡类型id === 9', () => {
    expect(FOUNDING_MEMBER_ANNUAL_ID).toBe('9')
  })
  it('创始会员类型name === 创始会员', () => {
    expect(FOUNDING_MEMBER_DISPLAY_NAME).toBe('创始会员')
  })
})

describe('test card type constant , 员工会员', () => {
  it('月卡类型id === 7', () => {
    expect(STAFF_MEMBER_MONTH_ID).toBe('7')
  })
  it('年卡类型id === 11', () => {
    expect(STAFF_MEMBER_ANNUAL_ID).toBe('11')
  })
  it('类型name === 创始会员', () => {
    expect(STAFF_MEMBER_DISPLAY_NAME).toBe('员工会员')
  })
})

describe('test card type constant , 尊享会员', () => {
  it('月卡类型id === 8', () => {
    expect(TO_ENJOY_THE_MEMBER_MONTH_ID).toBe('8')
  })
  it('年卡类型id === 10', () => {
    expect(TO_ENJOY_THE_MEMBER_ANNUAL_ID).toBe('10')
  })
  it('类型name === 创始会员', () => {
    expect(TO_ENJOY_THE_MEMBER_DISPLAY_NAME).toBe('尊享会员')
  })
})

describe('test card type constant , 度假套餐', () => {
  it('度假套餐 string', () => {
    expect(OCCASION_MEMBER).toBe('beach_vacation')
  })
})

describe('卡的类型', () => {
  it('年卡', () => {
    expect(ANNUAL_CARD_TYPE).toBe(12)
  })
  it('季卡', () => {
    expect(SEASON_CARD).toBe(3)
  })
  it('月卡', () => {
    expect(ON_THE_CARD).toBe(1)
  })
  it('vacation card(10 days)', () => {
    expect(VACATION_CARD).toBe(10)
  })
})

describe('支付时不同平台的payment_method_id', () => {
  it('jd env', () => {
    expect(JD_PAYMENT_METHODS_ID).toBe(-5)
  })
  it('非wechat env', () => {
    expect(UNWECHAT_PAYMENT_METHODS_ID).toBe(-2)
  })
  it('小程序 env', () => {
    expect(MINI_APP_PAYMENT_METHODS_ID).toBe(-6)
  })
})

describe('免费支付不同环境的contact_methods_id', () => {
  it('wechat env', () => {
    expect(WECHAT_CONTRACT_METHODS_ID).toBe(-3)
  })

  it('mini app env', () => {
    expect(MINIAPP_CONTRACT_METHODS_ID).toBe(-9)
  })
})

describe('免费支付最大的金额', () => {
  it('jd env', () => {
    expect(MAX_CONTRACT_PAY_PRICE).toBe(499)
  })
})

describe('不同的interval 展示不同的字', () => {
  it('interval === 12, 展示 年', () => {
    expect(getCardType(12)).toEqual('年')
  })
  it('interval === 3, 展示 季', () => {
    expect(getCardType(3)).toEqual('季')
  })
  it('interval === 1, 展示 月', () => {
    expect(getCardType(1)).toEqual('月')
  })
})
