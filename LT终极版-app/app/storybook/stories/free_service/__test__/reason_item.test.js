import React from 'react'
import render from 'react-test-renderer'
import ReasonItem from '../reason_item'
describe('open freeService successful page', () => {
  it('renders correctly', () => {
    expect(render.create(<ReasonItem />).toJSON()).toMatchSnapshot()
  })
})
