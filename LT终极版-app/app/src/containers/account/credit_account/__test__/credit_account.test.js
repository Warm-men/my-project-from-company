const CreditAccountContainer = require('../index').default
import React from 'react'
import { mount } from 'enzyme'
import BonusHeader from '../../../../../storybook/stories/account/credit_account/bonus_header'
import BonusItem from '../../../../../storybook/stories/account/credit_account/bonus_item'
const mockFunction = jest.fn(() => {})
jest.mock('../../../../request')
jest.mock('../../../../expand/tool/balance', () => ({
  updateBalance: mockFunction
}))

describe('creditAccount', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(
      <CreditAccountContainer.wrappedComponent currentCustomerStore={{}} />
    )
  })

  test('renders BonusHeader ', () => {
    expect(wrapper.find(BonusHeader)).toHaveLength(1)
  })
  test('renders BonusItem ', () => {
    const transactions = [{ amount: 1 }, { amount: 2 }, { amount: 3 }]
    wrapper.setState({ transactions })
    expect(wrapper.find(BonusItem)).toHaveLength(transactions.length)
  })

  test('updateBalance should be called', async () => {
    await wrapper.instance().componentDidMount()
    expect(mockFunction.mock.calls).toBeTruthy()
  })
})
