import React from 'react'
import { shallow } from 'enzyme'
import CustomerPhotoCenterContainer from '../customer_photos_center'
describe('晒单中心测试', () => {
  let wrapper, customerPhotosStore, currentCustomerStore
  beforeEach(() => {
    customerPhotosStore = {
      updateLikesStatus: jest.fn()
    }
    currentCustomerStore = {
      nickname: '123'
    }
    wrapper = shallow(
      <CustomerPhotoCenterContainer.wrappedComponent
        customerPhotosStore={customerPhotosStore}
        currentCustomerStore={currentCustomerStore}
      />
    )
  })

  it('加载时', () => {
    expect(wrapper.find({ testID: 'spinner' }).length).toBe(1)
    expect(wrapper.find({ testID: 'container' }).length).toBe(0)
    expect(wrapper.find({ testID: 'has-data-button' }).length).toBe(0)
  })
  it('加载后', () => {
    wrapper.setState({
      isLoading: false,
      data: [123, 123],
      isMore: false
    })
    expect(wrapper.find({ testID: 'spinner' }).length).toBe(0)
    expect(wrapper.find({ testID: 'container' }).length).toBe(1)
    expect(wrapper.find({ testID: 'has-data-button' }).length).toBe(1)
  })
})
