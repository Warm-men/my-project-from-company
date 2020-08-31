import React from 'react'
import ErrorView from '../transfer_error'
import { shallow } from 'enzyme'
describe('测试', () => {
  let wrapper, customerService, joinMember

  beforeEach(() => {
    customerService = jest.fn()
    joinMember = jest.fn()
    wrapper = shallow(
      <ErrorView
        customerService={customerService}
        joinMember={joinMember}
        error={{ error_code: 'error_not_active', message: '过期会员' }}
      />
    )
  })

  it('当错误码为error_not_active时，为立即续费', () => {
    expect(wrapper.find({ testID: 'button-text' }).props().children).toEqual(
      '立即续费'
    )
    wrapper
      .find({ testID: 'button' })
      .props()
      .onPress()
    expect(joinMember.mock.calls.length).toEqual(1)
    expect(customerService.mock.calls.length).toEqual(0)
  })
  it('当错误码不为error_not_active时，为咨询客服', () => {
    wrapper.setProps({
      error: { error_code: '123', message: '123' }
    })
    expect(wrapper.find({ testID: 'button-text' }).props().children).toEqual(
      '咨询客服'
    )
    wrapper
      .find({ testID: 'button' })
      .props()
      .onPress()
    expect(joinMember.mock.calls.length).toEqual(0)
    expect(customerService.mock.calls.length).toEqual(1)
  })
})
