import React from 'react'
import { shallow } from 'enzyme'
import ToteScheduledReturnContainer from '../index'
import SelectButton from '../../../../../storybook/stories/totes/tote_return/tote_scheduled_return_select_button'
import ToteScheduledAutoPickup from '../tote_scheduled_auto_pickup'
import ToteScheduledSelfDelivery from '../tote_scheduled_self_delivery'

describe('tote scheduled return container', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      <ToteScheduledReturnContainer
        scheduledPickupsType={'scheduled_auto_pickup'}
      />
    )
  })

  it('should render correctly when auto pickup', () => {
    expect(wrapper.find(SelectButton)).toHaveLength(2)
    expect(wrapper.find(ToteScheduledAutoPickup)).toHaveLength(1)
  })

  it('should render correctly when auto pickup', () => {
    wrapper.setState({ scheduledPickupsType: 'self_delivery' })
    expect(wrapper.find(SelectButton)).toHaveLength(2)
    expect(wrapper.find(ToteScheduledSelfDelivery)).toHaveLength(1)
  })
})
