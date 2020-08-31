import React from 'react'
import { shallow } from 'enzyme'
import ShoppingCarItemList from '../shopping_car_item_list'
import { addDays } from 'date-fns'
describe('购物车服饰列表', () => {
  let wrapper
  beforeEach(() => {
    const clothing_items = [
      {
        product: {
          id: 1,
          title: '连衣裙',
          tote_slot: 1,
          catalogue_photos: [
            {
              medium_url: 'https://xxx'
            }
          ]
        },
        product_size: {
          size_abbreviation: 'S'
        }
      }
    ]
    const couponStore = {
      validCoupons: [
        {
          customer_coupon_id: 31264,
          expired_at: addDays(new Date(), 7),
          rules: [],
          status: 'Valid',
          sub_title: '新人礼',
          title: '加衣券',
          type: 'ClothingCoupon',
          valid_days: 30
        }
      ]
    }
    wrapper = shallow(
      <ShoppingCarItemList
        withFreeService={true}
        column={'衣服'}
        products={clothing_items}
        maxCount={3}
        nowCount={1}
        couponStore={couponStore}
        customerCouponId={123123}
      />
    )
  })

  it('should display two empty item when maxCount - length = 2', () => {
    expect(wrapper.find({ testID: 'empty-item' }).length).toBe(2)
  })

  it('已经使用优惠券', () => {
    expect(
      wrapper.find({ testID: 'couponTipsLeftTitle' }).props().children
    ).toEqual('已使用加衣券，增加1个衣位')
  })

  it('优惠券即将过期，没有使用', () => {
    wrapper.setProps({
      customerCouponId: null
    })
    expect(
      wrapper.find({ testID: 'couponTipsLeftTitle' }).props().children
    ).toEqual('你有1张加衣券即将过期')
  })

  it('优惠券没那么快过期，没有使用', () => {
    const couponStore = {
      validCoupons: [
        {
          customer_coupon_id: 31264,
          expired_at: addDays(new Date(), 16),
          rules: [],
          status: 'Valid',
          sub_title: '新人礼',
          title: '加衣券',
          type: 'ClothingCoupon',
          valid_days: 30
        }
      ]
    }
    wrapper.setProps({
      customerCouponId: null,
      couponStore
    })
    expect(
      wrapper.find({ testID: 'couponTipsLeftTitle' }).props().children
    ).toEqual(`你有${couponStore.validCoupons.length}张加衣券可使用`)
  })

  it('should not display empty item when reach maxCount', () => {
    wrapper.setProps({
      maxCount: 1
    })
    expect(wrapper.find({ testID: 'empty-item' }).length).toBe(0)
  })

  it('should display 3 empty item if no clothing', () => {
    wrapper.setProps({
      nowCount: 0
    })
    expect(wrapper.find({ testID: 'empty-item' }).length).toBe(3)
    expect(wrapper.find({ testID: 'product-item' }).length).toBe(0)
  })
})
