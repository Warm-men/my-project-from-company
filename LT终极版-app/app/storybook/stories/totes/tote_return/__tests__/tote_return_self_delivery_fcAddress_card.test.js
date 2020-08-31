import React from 'react'
import ToteReturndSelfDeliveryFcAddressCard from '../tote_return_self_delivery_fcAddress_card'
import render from 'react-test-renderer'

describe('tote returned self delivery fc address card', () => {
  it('should render correctly', () => {
    const tree = render
      .create(
        <ToteReturndSelfDeliveryFcAddressCard
          fcAddress={'东莞市'}
          copyContent={jest.fn()}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
