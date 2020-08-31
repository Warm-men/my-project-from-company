import React from 'react'
import renderer from 'react-test-renderer'
import ToteScheduledSelfDelivery from '../tote_scheduled_self_delivery'

describe('tote scheduled self delivery', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(
        <ToteScheduledSelfDelivery
          tote={{
            fc_address: '东莞'
          }}
          appStore={{}}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
