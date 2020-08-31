import React from 'react'
import ToteReturndRemind from '../tote_return_remind'
import renderer from 'react-test-renderer'

describe('tote return remind', () => {
  it('should render correctly when auto pickup', () => {
    const tree = renderer
      .create(<ToteReturndRemind type={'autoPickup'} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should rendere correctly when self dilivere', () => {
    const tree = renderer
      .create(<ToteReturndRemind type={'selfDelivered'} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
