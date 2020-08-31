import { shallow } from 'src/utilsTests'
import Account, { getStatusMessage } from './index'

describe('Test getStatusMessage', () => {
  let customer
  beforeEach(() => {
    customer = null
  })
  it('Test customer empty', () => {
    expect(getStatusMessage(customer)).toEqual('')
  })
  it('Test customer subscription empty', () => {
    customer = {
      id: 1,
      subscription: null
    }
    expect(getStatusMessage(customer)).toEqual('')
  })
  it('Test billing_date_extending true', () => {
    const days = 15
    customer = {
      id: 1,
      subscription: {
        billing_date_extending: true,
        remain_additional_days: days
      }
    }
    expect(getStatusMessage(customer)).toEqual(
      `会员期从首个衣箱寄出或${days}天后开始计算`
    )
  })
  it('Test Status unequal cancelled', () => {
    customer = {
      id: 1,
      subscription: {
        status: 'pending',
        billing_date: 'Sun, 07 Apr 2019 16:27:39 +0800'
      }
    }
    expect(getStatusMessage(customer)).toEqual(`会员有效期至2019年04月07日`)
  })
  it('Test status cancelled', () => {
    customer = {
      id: 1,
      subscription: {
        status: 'cancelled',
        promo_code: 'LTCN_FREE_TOTE'
      }
    }
    expect(getStatusMessage(customer)).toEqual(`7天体验会员已结束`)
    customer = {
      id: 1,
      subscription: {
        status: 'cancelled',
        promo_code: 'LTCN_FREE_TOTE_79'
      }
    }
    expect(getStatusMessage(customer)).toEqual(`7天体验会员已结束`)
    customer = {
      id: 1,
      subscription: {
        status: 'cancelled',
        promo_code: '',
        subscription_type: {
          occasion: 'beach_vacation'
        },
        display_name: '6+4套餐'
      }
    }
    expect(getStatusMessage(customer)).toEqual(`6+4套餐已结束`)
    customer = {
      id: 1,
      subscription: {
        status: 'cancelled',
        promo_code: '',
        subscription_type: null
      }
    }
    expect(getStatusMessage(customer)).toEqual(`会员已过期`)
  })
})

describe('Test Account AbTest', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      Account,
      {
        app: {
          isWechat: true
        },
        customer: {
          referral_banner: {
            referred_program_entry_banner_url: ''
          }
        }
      },
      {
        abTestReferral: 1,
        hasFetchAllPromoCode: false
      }
    )
  })
  it('ABTest null', () => {
    wrapper.setState({
      abTestReferral: null,
      hasFetchAllPromoCode: true
    })
    expect(wrapper.find('.referral-entry').length).toBe(0)
  })
  it('ABTest undefine', () => {
    wrapper.setState({
      abTestReferral: undefined,
      hasFetchAllPromoCode: true
    })
    expect(wrapper.find('.referral-entry').length).toBe(0)
  })
  it('ABTest 2', () => {
    wrapper.setState({
      abTestReferral: 2,
      hasFetchAllPromoCode: true
    })
    expect(wrapper.find('.referral-entry').length).toBe(0)
  })
  it('ABTest string', () => {
    wrapper.setState({
      abTestReferral: '1',
      hasFetchAllPromoCode: true
    })
    expect(wrapper.find('.referral-entry').length).toBe(0)
  })
})
