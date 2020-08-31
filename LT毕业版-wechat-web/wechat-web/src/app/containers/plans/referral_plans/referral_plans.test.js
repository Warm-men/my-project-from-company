import { shallow } from 'enzyme'
import { addDays } from 'date-fns'
import { ReferralPlans } from './index'

describe('test referral plans render', () => {
  let wrapper, dispatch
  const props = {
    app: {
      isWechat: false,
      hasButtonActivated: false,
      abtestGiftRecieveState: false
    },
    promoCode: {
      discountAmount: 0,
      codeState: 'invalid'
    },
    operation: {
      operation_plan: [
        {
          id: 33333
        }
      ]
    },
    customer: {
      id: 22233333,
      classifyPromoCode: [],
      valid_promo_codes: [],
      promo_codes: '',
      available_purchase_credit: '',
      active_referral_program: {
        sender_amount: 0
      },
      subscription: {
        id: 3333,
        status: 'trial',
        billing_date: addDays(new Date(), 1000),
        subscription_type: {
          accessory_count: 2,
          annual_subscription_type: {
            id: '10',
            base_price: 0.01,
            display_name: '尊享会员',
            interval: 12
          },
          base_price: 499,
          clothing_count: 3,
          display_name: '尊享会员',
          id: '8',
          internal_name: '会员',
          interval: 1,
          is_adminable: false,
          is_maternity: false,
          is_signupable: true,
          is_switchable: true,
          notes: null,
          preview: {
            cash_price: 0,
            final_price: 0,
            name: '尊享会员',
            expiration_date: 'Wed, 28 Nov 2018 21:56:06 +0800'
          },
          quarterly_subscription_type: null
        }
      },
      credit_scores: [
        {
          scores: 1
        },
        {
          scores: 2
        }
      ]
    },
    subscriptionTypes: [
      {
        is_signupable: true,
        id: 33333
      },
      {
        is_signupable: true,
        id: 44444
      },
      {
        is_signupable: false,
        id: 5555
      }
    ],
    data: {
      id: 2
    },
    authentication: {
      isSubscriber: false
    },
    location: {
      query: {}
    }
  }
  beforeEach(() => {
    window.adhoc = jest.fn()
    dispatch = jest.fn()
    wrapper = shallow(<ReferralPlans {...props} dispatch={dispatch} />)
  })

  it('test is render .plans', () => {
    expect(wrapper.find('.plans').length).toBe(1)
  })

  it('test componentWillMount func dispatch be calls', () => {
    expect(dispatch.mock.calls.length).toBe(3)
    expect(dispatch.mock.calls[0][0].type).toEqual(
      'API:FETCH:MEMBER:PROMO:CODE'
    )
    expect(dispatch.mock.calls[1][0].type).toEqual(
      'API:SUBSCRIPTION_TYPES:FETCH'
    )
    expect(dispatch.mock.calls[2][0].type).toEqual(
      'API:NEWEST:SUBSCRIPTION:TYPES'
    )
  })

  it('test window.adhoc abtest', () => {
    expect(window.adhoc.mock.calls[0][0].length).toBe(8)
    expect(window.adhoc.mock.calls[0][0]).toEqual('getFlags')
  })

  it('test optimizePrice func ,original= 499, discounts=100', () => {
    const optimizePriceReturn = wrapper.instance().optimizePrice(499, 100)
    expect(optimizePriceReturn).toEqual('399.00')
  })

  it('test optimizePrice func,original= 100, discounts=100', () => {
    const optimizePriceReturn = wrapper.instance().optimizePrice(100, 100)
    expect(optimizePriceReturn).toEqual(0)
  })

  it('test optimizePrice func,original= 100, discounts=200', () => {
    const optimizePriceReturn = wrapper.instance().optimizePrice(100, 200)
    expect(optimizePriceReturn).toEqual(0)
  })

  it('test getSelectSubType func, annual card', () => {
    const getSelectSubType = wrapper.instance().getSelectSubType({
      interval: 12
    })
    expect(getSelectSubType).toEqual('annual_card')
  })

  it('test getSelectSubType func, quarterly_card', () => {
    const getSelectSubType = wrapper.instance().getSelectSubType({
      interval: 3
    })
    expect(getSelectSubType).toEqual('quarterly_card')
  })

  it('test getSelectSubType func, interval === 1 should reture null', () => {
    const getSelectSubType = wrapper.instance().getSelectSubType({
      interval: 1
    })
    expect(getSelectSubType).toEqual(null)
  })
})
