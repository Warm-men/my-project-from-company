import React from 'react'
import TransferView from '../single_transfer'
import { shallow } from 'enzyme'
describe('测试', () => {
  let wrapper, subscriptionMigration, data
  data = {
    accessory_count: 2,
    clothing_count: 3,
    next_billing_at: 'Thu, 04 Apr 2019 17:11:22 +0800',
    title: '3+2 套餐',
    tote_count: 1,
    target_subscription_type_id: 17
  }
  beforeEach(() => {
    subscriptionMigration = jest.fn()
    wrapper = shallow(
      <TransferView subscriptionMigration={subscriptionMigration} data={data} />
    )
  })

  it('subscriptionMigration被调用，并传入了正确参数', () => {
    wrapper
      .find({ testID: 'subscriptionMigration' })
      .props()
      .onPress()
    expect(subscriptionMigration.mock.calls).toEqual([[17]])
  })
})
