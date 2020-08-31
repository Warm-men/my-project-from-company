import React from 'react'
import { shallow } from 'enzyme'
import OperationGuideView from '../operation_guide_view'
describe('operation guide container', () => {
  let wrapper, column
  beforeEach(() => {
    column = 'onboardingToteCart'
    wrapper = shallow(<OperationGuideView.wrappedComponent column={column} />)
  })
  it('column不同，图片数组不同', () => {
    expect(wrapper.instance().guideArray.length).toBe(3)
    column = 'defaultToteCart'
    wrapper = shallow(<OperationGuideView.wrappedComponent column={column} />)
    expect(wrapper.instance().guideArray.length).toBe(4)
  })
})
