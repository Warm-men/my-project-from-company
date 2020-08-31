import React from 'react'
import { shallow } from 'enzyme'
import SelectButton from '../tote_scheduled_return_select_button'

describe('select button in tote scheduled return', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      <SelectButton
        text={'上门取件'}
        type={'scheduled_self_delivery'}
        scheduledPickupsType={'scheduled_self_delivery'}
      />
    )
  })

  it('should show focus when selected', () => {
    expect(wrapper.find({ testID: 'button-text' }).props().children).toEqual(
      '上门取件'
    )
    expect(wrapper.find({ testID: 'focus-line' })).toHaveLength(1)
  })

  it('should show focus when selected', () => {
    wrapper.setProps({ scheduledPickupsType: 'scheduled_auto_pickup' })
    expect(wrapper.find({ testID: 'focus-line' })).toHaveLength(0)
  })
})
