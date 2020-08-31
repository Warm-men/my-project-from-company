import React from 'react'
import CouponItem from '../coupon_item'
import { shallow } from 'enzyme'
describe('测试', () => {
  let wrapper, item, onPress
  item = {
    customer_coupon_id: 9268,
    expired_at: 'Sun, 21 Apr 2019 23:59:59 +0800',
    rules: ['衣箱开启状态下使用可增加一个衣位，单次订单有效，不可叠加'],
    sub_title: '新人礼',
    title: '加衣券',
    type: 'ClothingCoupon',
    valid_days: 30,
    status: 'Valid'
  }
  beforeEach(() => {
    onPress = jest.fn()
    wrapper = shallow(
      <CouponItem
        item={item}
        onPress={onPress}
        expiredTime={'2019年04月21日'}
        usedTime={null}
        isUsed={false}
      />
    )
  })

  it('当sub_title有值的时候 显示', () => {
    expect(wrapper.find({ testID: 'sub-title' }).length).toBe(1)
  })

  it('当expiredTime有值usedTime没有值没有使用 显示', () => {
    expect(wrapper.find({ testID: 'time' }).length).toBe(1)
  })

  it('当usedTime有值 expiredTime没有值 未使用 不显示', () => {
    wrapper.setProps({
      usedTime: '2019年04月21日',
      expiredTime: null,
      isUsed: false
    })
    expect(wrapper.find({ testID: 'time' }).length).toBe(0)
  })

  it('当usedTime有值 expiredTime没有值 已经使用 显示', () => {
    wrapper.setProps({
      usedTime: '2019年04月21日',
      expiredTime: null,
      isUsed: true
    })
    expect(wrapper.find({ testID: 'time' }).length).toBe(1)
  })

  it('当sub_title没值的时候 不显示', () => {
    item = {
      customer_coupon_id: 9268,
      expired_at: 'Sun, 21 Apr 2019 23:59:59 +0800',
      rules: ['衣箱开启状态下使用可增加一个衣位，单次订单有效，不可叠加'],
      sub_title: null,
      title: '加衣券',
      type: 'ClothingCoupon',
      valid_days: 30,
      status: 'Valid'
    }
    wrapper.setProps({
      item
    })
    expect(wrapper.find({ testID: 'sub-title' }).length).toBe(0)
  })
})
