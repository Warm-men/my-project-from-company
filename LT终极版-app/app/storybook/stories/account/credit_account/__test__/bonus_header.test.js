import React from 'react'
import { shallow } from 'enzyme'
import BonusHeader from '../bonus_header'
describe('BonusHeader', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<BonusHeader currentCustomerStore={{}} />)
  })
  it('always renders balance text', () => {
    expect(wrapper.find({ testID: 'balance' })).toHaveLength(1)
  })
  it('always renders contract text', () => {
    expect(wrapper.find({ testID: 'contract' })).toHaveLength(1)
  })
  it('when balance < 0', () => {
    const balance = -1
    wrapper.setProps({
      currentCustomerStore: { balance }
    })
    expect(wrapper.find({ testID: 'balance' }).prop('children')).toEqual(
      balance
    )
    expect(wrapper.find({ testID: 'refund' })).toHaveLength(1)
  })
  it('when balance > 0', () => {
    const balance = 1
    wrapper.setProps({
      currentCustomerStore: {
        balance
      }
    })
    expect(wrapper.find({ testID: 'balance' }).prop('children')).toEqual(
      balance
    )
    expect(wrapper.find({ testID: 'refund' })).toHaveLength(0)
  })
  it('when enablePaymentContract = []', () => {
    wrapper.setProps({
      currentCustomerStore: {
        enablePaymentContract: []
      }
    })
    expect(wrapper.find({ testID: 'contract' }).prop('children')).toEqual('')
  })
  it('when enablePaymentContract = [1]', () => {
    wrapper.setProps({
      currentCustomerStore: {
        enablePaymentContract: [1]
      }
    })
    expect(wrapper.find({ testID: 'contract' }).prop('children')).toEqual(
      '已开通免密支付'
    )
  })
})
