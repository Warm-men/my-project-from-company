import React from 'react'
import render from 'react-test-renderer'
import RefundingFreeServiceContainer from '../refunding_free_service'
describe('refunding page', () => {
  it('renders correctly', () => {
    expect(
      render.create(<RefundingFreeServiceContainer />).toJSON()
    ).toMatchSnapshot()
  })
})
