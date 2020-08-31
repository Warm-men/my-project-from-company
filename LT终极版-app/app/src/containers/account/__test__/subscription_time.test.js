import React from 'react'
import JoinMemberContainer from '../join_member'
import { shallow } from 'enzyme'

describe('返回套餐时间', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      <JoinMemberContainer.wrappedComponent
        currentCustomerStore={{
          subscriptionDate: '',
          enablePaymentContract: []
        }}
        subscriptionStore={{
          subscriptionGroups: []
        }}
        navigation={{
          state: ''
        }}
      />
    )
  })
  it('返回套餐时间', () => {
    let obj = {
      id: '8',
      accessory_count: 2,
      clothing_count: 3,
      base_price: 0,
      display_name: '尊享会员',
      interval: 1,
      original_price: 501,
      banner_height: 388,
      banner_url: 'https://static.letote.cn/upgrade_gift/mon_default_1031.png',
      banner_width: 708,
      sub_display_name: '月卡尊享3+2',
      operation_plan: null,
      available_promo_codes: [
        {
          code: 'YUEKA1',
          description: null,
          discount_amount: 50,
          expiration_date: 'Sat, 19 Jan 2019 23:59:59 +0800',
          status: 'Valid',
          title: '月卡减50',
          rules: [],
          type: 'MemberPromoCode',
          condition_display: null,
          discount_percent: null,
          subscription_type_ids: [8, 6, 7]
        }
      ],
      preview: {
        cash_price: 0,
        expiration_date: 'Wed, 20 Feb 2019 11:11:52 +0800',
        final_price: 0,
        name: '尊享会员',
        promo_code_price: 0
      }
    }
    const returnSubscriptionTime = wrapper.instance().returnSubscriptionTime
    expect(returnSubscriptionTime()).toBe(null)
    expect(returnSubscriptionTime(obj)).toBe('2019年02月20日')
  })
})
