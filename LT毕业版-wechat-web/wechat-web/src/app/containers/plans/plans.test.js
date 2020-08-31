import { shallow } from 'enzyme'
import { addDays } from 'date-fns'
import { Plans } from './index'
import OldVersionPlans from './old_version'

describe('test plans flow', () => {
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
    authentication: {
      isSubscriber: true
    },
    cancelQuestionarie: '',
    newCombo: {
      seletedSubType: {
        id: 1
      },
      seletedCardType: {
        subscription_types: []
      }
    },
    location: {
      query: {}
    },
    router: {
      setRouteLeaveHook: jest.fn()
    },
    subscriptionData: []
  }

  beforeEach(() => {
    dispatch = jest.fn()
    wrapper = shallow(<Plans {...props} dispatch={dispatch} />)
  })

  it('data为空时，render null', () => {
    expect(wrapper.find('.plans').length).toBe(0)
  })

  it('subscriptionData不为空时，fetch new combo', () => {
    expect(dispatch.mock.calls.length).toBe(1)
    expect(dispatch.mock.calls[0][0].type).toEqual(
      'GET:EXTENDABLE:SUBSCRIPTION:TYPES'
    )
  })

  it('subscriptionData长度为1时渲染老套餐，fetch new combo', () => {
    wrapper.setProps({
      subscriptionData: [
        {
          title: '',
          images: ''
        }
      ],
      data: {
        id: 2
      }
    })
    expect(wrapper.containsMatchingElement(<OldVersionPlans />)).toBe(true)
  })
})
