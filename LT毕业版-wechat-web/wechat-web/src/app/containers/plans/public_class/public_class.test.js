import PublicClass from './index'

describe('test public class flow', () => {
  let wrapper, dispatch
  let platform = {
    subscription_type_id: 1,
    promoCode: {
      codeState: 'Valid',
      code: 11111
    },
    platform: 'wechat',
    payment_methods: [
      {
        id: 1,
        payment_gateway: 'wechat'
      },
      {
        id: 2,
        payment_gateway: 'wechat_web'
      }
    ]
  }
  beforeEach(() => {
    dispatch = jest.fn()
    wrapper = new PublicClass({
      customer: {
        valid_promo_codes: [
          {
            discount_amount: 888
          },
          {
            discount_amount: 4444
          }
        ]
      },
      data: {
        available_promo_codes: []
      },
      location: {
        query: {}
      },
      operation_plan: {
        promo_code: {
          code: 11111
        }
      },
      app: {
        abtestGiftRecieveState: false
      },
      promoCode: {
        code: '121212'
      },
      dispatch
    })
  })
  it('test fetchPlans func', () => {
    wrapper.fetchPlans()
  })

  it('test initMaxPromoCode func', () => {
    const propsData = {
      customer: {
        valid_promo_codes: [
          {
            discount_amount: 888
          },
          {
            discount_amount: 4444
          }
        ]
      }
    }
    wrapper.initMaxPromoCode(propsData)
    expect(dispatch.mock.calls[0][0].type).toEqual('PROMO_CODE:SET')
  })

  it('test sortMaxPromoCode func', () => {
    const promo_code = [
      {
        discount_amount: 888
      },
      {
        discount_amount: 4444
      }
    ]
    expect(wrapper.sortMaxPromoCode(promo_code)).toEqual(promo_code[1])
  })

  it('test platformSubscriptionInput func, wechat', () => {
    expect(
      wrapper.platformSubscriptionInput(
        platform.subscription_type_id,
        platform.promoCode,
        platform.platform,
        platform.payment_methods
      )
    ).toEqual({
      marketing_attribution: {},
      payment_method_id: 1,
      promo_code: 11111,
      subscription_type_id: 1,
      unlock_tote_inventory: true
    })
  })

  it('test platformSubscriptionInput func, jd', () => {
    platform.platform = 'jd'
    expect(
      wrapper.platformSubscriptionInput(
        platform.subscription_type_id,
        platform.promoCode,
        platform.platform,
        platform.payment_methods
      )
    ).toEqual({
      marketing_attribution: {},
      payment_method_id: -5,
      promo_code: 11111,
      subscription_type_id: 1,
      unlock_tote_inventory: true
    })
  })

  it('test platformSubscriptionInput func, wechat_web', () => {
    platform.platform = 'wechat_web'
    expect(
      wrapper.platformSubscriptionInput(
        platform.subscription_type_id,
        platform.promoCode,
        platform.platform,
        platform.payment_methods
      )
    ).toEqual({
      marketing_attribution: {},
      payment_method_id: -2,
      promo_code: 11111,
      subscription_type_id: 1,
      unlock_tote_inventory: true
    })
  })

  it('test extendSubscriptionError func', () => {
    wrapper.extendSubscriptionError()
    expect(dispatch.mock.calls[0][0]).toEqual({
      btnState: 'reset',
      type: 'CHANGE:BUTTON:STATE'
    })
  })

  it('test fetchNewPromoCode func', () => {
    wrapper.fetchNewPromoCode()

    expect(dispatch.mock.calls.length).toEqual(2)
    expect(dispatch.mock.calls[0][0].type).toEqual('API:FETCH:CURRENT:CUSTOMER')
    expect(dispatch.mock.calls[1][0].type).toEqual('PROMO_CODE:RESET')
  })

  it('test showPaymentTipsText func', () => {
    expect(
      wrapper.showPaymentTipsText(true, 'Mon, 27 May 2019 23:59:59 +0800')
    ).toEqual('有效期至2019年05月27日')
    expect(wrapper.showPaymentTipsText(true, '')).toEqual(
      '会员期从衣箱寄出后开始计算'
    )
    expect(
      wrapper.showPaymentTipsText(false, 'Mon, 27 May 2019 23:59:59 +0800')
    ).toEqual('会员期从衣箱寄出后开始计算')
    expect(wrapper.showPaymentTipsText(false, '')).toEqual(
      '会员期从衣箱寄出后开始计算'
    )
  })
})
