import React from 'react'
import { shallow } from 'enzyme'
import CustomerPhotoCenterHeader, { Column } from '../header'
describe('晒单个人中心头部', () => {
  let wrapper, wrapperTwo, currentCustomerStore, popPanelShow
  beforeEach(() => {
    currentCustomerStore = {
      roles: [],
      avatarUrl: null,
      customer_photo: {
        customer_photo_count: 0,
        featured_count: 0,
        liked_count: 0
      },
      telephone: '13312341234',
      nickname: 'test',
      localShippingAddresses: [],
      style: {
        height_inches: null
      }
    }
    popPanelShow = jest.fn()
    wrapper = shallow(
      <CustomerPhotoCenterHeader.wrappedComponent
        popPanelShow={popPanelShow}
        currentCustomerStore={currentCustomerStore}
      />
    )
    wrapperTwo = shallow(<Column title={'获赞'} count={10} />)
  })

  it('获赞少于20', () => {
    expect(wrapperTwo.find({ testID: 'NumberTicker' }).length).toBe(0)
  })

  it('获赞等于20', () => {
    wrapperTwo.setProps({
      count: 20
    })
    expect(wrapperTwo.find({ testID: 'NumberTicker' }).length).toBe(1)
  })

  it('获赞大于20', () => {
    wrapperTwo.setProps({
      count: 21
    })
    expect(wrapperTwo.find({ testID: 'NumberTicker' }).length).toBe(1)
  })

  it('没有头像,不是stylist', () => {
    expect(wrapper.find({ testID: 'camera_icon' }).length).toBe(1)
    expect(wrapper.find({ testID: 'stylist_tip' }).length).toBe(0)
    expect(wrapper.find({ testID: 'Bubble' }).length).toBe(1)
  })

  it('没有头像,是stylist', () => {
    currentCustomerStore.roles = [{ type: 'stylist' }]
    wrapper = shallow(
      <CustomerPhotoCenterHeader.wrappedComponent
        popPanelShow={popPanelShow}
        currentCustomerStore={currentCustomerStore}
      />
    )
    expect(wrapper.find({ testID: 'camera_icon' }).length).toBe(1)
    expect(wrapper.find({ testID: 'stylist_tip' }).length).toBe(0)
    expect(wrapper.find({ testID: 'Bubble' }).length).toBe(1)
  })
  it('有头像,不是stylist', () => {
    currentCustomerStore.avatarUrl = '123'
    wrapper = shallow(
      <CustomerPhotoCenterHeader.wrappedComponent
        popPanelShow={popPanelShow}
        currentCustomerStore={currentCustomerStore}
      />
    )
    expect(wrapper.find({ testID: 'camera_icon' }).length).toBe(0)
    expect(wrapper.find({ testID: 'stylist_tip' }).length).toBe(0)
    expect(wrapper.find({ testID: 'Bubble' }).length).toBe(0)
  })

  it('有头像,是stylist', () => {
    currentCustomerStore.avatarUrl = '123'
    currentCustomerStore.roles = [{ type: 'stylist' }]
    wrapper = shallow(
      <CustomerPhotoCenterHeader.wrappedComponent
        popPanelShow={popPanelShow}
        currentCustomerStore={currentCustomerStore}
      />
    )
    expect(wrapper.find({ testID: 'camera_icon' }).length).toBe(0)
    expect(wrapper.find({ testID: 'stylist_tip' }).length).toBe(1)
    expect(wrapper.find({ testID: 'Bubble' }).length).toBe(0)
  })
})
