import React from 'react'
import { shallow } from 'enzyme'
import FreeServiceActiveContainer from '../free_service_active'
jest.mock('../../../../src/request/')
describe('open freeService successful page', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<FreeServiceActiveContainer.wrappedComponent />)
  })
  it('renders async price', async () => {
    await wrapper.instance().getPrice()
    expect(wrapper.state().price).toEqual(100)
  })
})
