import React from 'react'
import { SeeOtherSayModal } from '../other_say_modal'
import { shallow } from 'enzyme'
describe('test SeeOtherSayModal', () => {
  beforeEach(() => {
    wrapper = shallow(
      <SeeOtherSayModal hideModal={jest.fn()} otherSay={'1234'} />
    )
  })

  it('传入什么文字就显示什么', () => {
    expect(wrapper.find({ testID: 'otherSay' }).prop('children')).toEqual(
      `1234`
    )
  })
})
