import React from 'react'
import { shallow } from 'enzyme'
import ShoppingCarContainer from '../index'

describe('shopping car container', () => {
  let wrapper, toteCartStore, errors
  errors = [
    'error_subscription_on_hold',
    'error_subscription_on_hold_requested',
    'error_tote_cart_item_unswappable'
  ]
  beforeEach(() => {
    toteCartStore = {
      toteCart: {
        with_free_service: true,
        clothing_items: [],
        accessory_items: [],
        maxClothingCount: 4,
        maxAccessoryCount: 2,
        display_more_product_entry: true,
        validate_result: {
          success: false,
          errors: [
            {
              error_code: 'error_subscription_on_hold',
              message: 'xxxxxx'
            }
          ]
        }
      }
    }
    wrapper = shallow(
      <ShoppingCarContainer.wrappedComponent
        currentCustomerStore={{}}
        modalStore={{}}
        couponStore={{}}
        toteCartStore={toteCartStore}
        guideStore={{ toteCartGuideShowed: true }}
        navigation={{
          addListener: jest.fn()
        }}
      />
    )
  })

  it('用户开通了自在选，显示临时关闭开通自在选模块', () => {
    expect(wrapper.find({ testID: 'toteCartFreeService' }).length).toBe(1)
  })

  it('用户没有开通了自在选，不显示临时关闭开通自在选模块', () => {
    toteCartStore.toteCart.with_free_service = false
    wrapper = shallow(
      <ShoppingCarContainer.wrappedComponent
        currentCustomerStore={{}}
        modalStore={{}}
        guideStore={{}}
        couponStore={{}}
        toteCartStore={toteCartStore}
        navigation={{
          addListener: jest.fn()
        }}
      />
    )
    expect(wrapper.find({ testID: 'toteCartFreeService' }).length).toBe(0)
  })

  it('should display clothing item anyway', () => {
    expect(wrapper.find({ testID: 'clothing-item-list' }).length).toBe(1)
  })

  it('should display accessory item anyway', () => {
    expect(wrapper.find({ testID: 'accessory-item-list' }).length).toBe(1)
  })

  it('should display go to lock anyway', () => {
    expect(wrapper.find({ testID: 'lock-tote' }).length).toBe(1)
  })

  it('should display go to select', () => {
    expect(wrapper.find({ testID: 'select-products' }).length).toBe(1)
  })

  it('有报错的时候，显示报错提示', () => {
    expect(wrapper.find({ testID: 'warning-tips' }).length).toBe(1)
  })
  it('没有报错的时候，不显示报错提示', () => {
    toteCartStore.toteCart.validate_result.success = true
    wrapper = shallow(
      <ShoppingCarContainer.wrappedComponent
        currentCustomerStore={{}}
        modalStore={{}}
        guideStore={{}}
        couponStore={{}}
        toteCartStore={toteCartStore}
        navigation={{
          addListener: jest.fn()
        }}
      />
    )
    expect(wrapper.find({ testID: 'warning-tips' }).length).toBe(0)
  })

  it('被过滤的报错，不显示', () => {
    toteCartStore.toteCart.validate_result = {
      success: false,
      errors: [
        {
          error_code: 'error_already_has_a_new_tote',
          message: 'xxxxxx'
        }
      ]
    }
    wrapper = shallow(
      <ShoppingCarContainer.wrappedComponent
        currentCustomerStore={{}}
        modalStore={{}}
        guideStore={{}}
        couponStore={{}}
        toteCartStore={toteCartStore}
        navigation={{
          addListener: jest.fn()
        }}
      />
    )
    expect(wrapper.find({ testID: 'warning-tips' }).length).toBe(0)
  })

  it('保留的报错，显示', () => {
    let errorIndex = Math.floor(Math.random() * (2 - 0)) + 0
    toteCartStore.toteCart.validate_result = {
      success: false,
      errors: [
        {
          error_code: errors[errorIndex],
          message: 'xxxxxx'
        }
      ]
    }
    wrapper = shallow(
      <ShoppingCarContainer.wrappedComponent
        currentCustomerStore={{}}
        modalStore={{}}
        guideStore={{}}
        couponStore={{}}
        toteCartStore={toteCartStore}
        navigation={{
          addListener: jest.fn()
        }}
      />
    )
    expect(wrapper.find({ testID: 'warning-tips' }).length).toBe(1)
  })
})
