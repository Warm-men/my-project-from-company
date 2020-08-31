import { mount } from 'src/utilsTests'
import OpenFreeServiceContainer from './index'

describe('test OpenFreeServiceContainer component', () => {
  let wrapper, dispatch

  let props = {
    router: {
      setRouteLeaveHook: jest.fn()
    },
    customer: {
      id: 1,
      enable_payment_contract: []
    }
  }
  beforeEach(() => {
    dispatch = jest.fn()
    wrapper = mount(OpenFreeServiceContainer, { ...props, dispatch }, {})
  })
  it('simulates click events', () => {
    wrapper.find('.faq-mini-container').simulate('click')
    expect(
      wrapper.find('.clothes-clean-flow-text-container-complete').length
    ).toBe(1)
  })
})
