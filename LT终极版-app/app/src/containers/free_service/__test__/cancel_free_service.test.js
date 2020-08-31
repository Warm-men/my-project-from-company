import React from 'react'
import { TextInput } from 'react-native'
import { mount } from 'enzyme'
import CancelFreeServiceContainer from '../cancel_free_service'
import ReasonItem from '../../../../storybook/stories/free_service/reason_item'
describe('cancel successful page', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(
      <CancelFreeServiceContainer.wrappedComponent
        modalStore={{}}
        currentCustomerStore={{}}
        navigation={{ state: { params: { type: 'FreeServiceContractType' } } }}
      />
    )
  })
  it('renders Number of ReasonItem must be 5', () => {
    expect(wrapper.find(ReasonItem)).toHaveLength(5)
  })
  it('renders TextIpunt when selectedIndex is 4', () => {
    wrapper.setState({ selectedIndex: 4 })
    expect(wrapper.find(TextInput)).toHaveLength(1)
  })
})
