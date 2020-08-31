import React from 'react'
import TransferMemberContainer from '../transfer_member'
import { shallow } from 'enzyme'

describe('测试', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      <TransferMemberContainer.wrappedComponent
        currentCustomerStore={{}}
        appStore={{}}
        modalStore={{}}
        toteCartStore={{}}
        couponStore={{}}
      />
    )
  })
  it('测试页面初始化的情况', () => {
    expect(wrapper.find({ testID: 'loading-modal' }).length).toBe(1)
    expect(wrapper.find({ testID: 'transfer' }).length).toBe(0)
    expect(wrapper.find({ testID: 'multiple-transfer' }).length).toBe(0)
    expect(wrapper.find({ testID: 'transfer-error' }).length).toBe(0)
    expect(wrapper.find({ testID: 'transfer-success' }).length).toBe(0)
  })

  it('测试请求后只有一个套餐的页面', () => {
    wrapper.setState({
      loadingModalVisible: false,
      availableMigrateOptions: [1]
    })
    expect(wrapper.find({ testID: 'transfer' }).length).toBe(1)
    expect(wrapper.find({ testID: 'multiple-transfer' }).length).toBe(0)
  })

  it('测试请求后有多个套餐的页面', () => {
    wrapper.setState({
      loadingModalVisible: false,
      availableMigrateOptions: [1, 2, 3]
    })
    expect(wrapper.find({ testID: 'transfer' }).length).toBe(0)
    expect(wrapper.find({ testID: 'multiple-transfer' }).length).toBe(1)
  })

  it('测试请求后报错页面', () => {
    wrapper.setState({
      loadingModalVisible: false,
      availableMigrateOptions: [],
      errors: [1],
      success: false
    })
    expect(wrapper.find({ testID: 'transfer' }).length).toBe(0)
    expect(wrapper.find({ testID: 'multiple-transfer' }).length).toBe(0)
    expect(wrapper.find({ testID: 'transfer-error' }).length).toBe(1)
    expect(wrapper.find({ testID: 'transfer-success' }).length).toBe(0)
  })

  it('测试套餐切换后成功的', () => {
    wrapper.setState({
      loadingModalVisible: false,
      availableMigrateOptions: [],
      errors: [],
      success: true
    })
    expect(wrapper.find({ testID: 'transfer' }).length).toBe(0)
    expect(wrapper.find({ testID: 'multiple-transfer' }).length).toBe(0)
    expect(wrapper.find({ testID: 'transfer-error' }).length).toBe(0)
    expect(wrapper.find({ testID: 'transfer-success' }).length).toBe(1)
  })
})
