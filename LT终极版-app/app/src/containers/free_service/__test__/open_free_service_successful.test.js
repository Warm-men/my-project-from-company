import React from 'react'
import render from 'react-test-renderer'
import OpenFreeServiceSuccessfulContainer from '../refunding_free_service'
describe('open freeService successful page', () => {
  it('renders correctly', () => {
    expect(
      render.create(<OpenFreeServiceSuccessfulContainer />).toJSON()
    ).toMatchSnapshot()
  })
})
