import { mount } from 'src/utilsTests'
import ToteSlotIcon from 'src/app/containers/totes/tote_slot_icon'

describe('Test ToteSlotIcon', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(ToteSlotIcon, {
      slot: 0
    })
  })
  it('Test Slot', () => {
    expect(wrapper.find('.slot-num').text()).toEqual('0')
    wrapper.setProps({
      slot: 1
    })
    expect(wrapper.find('.slot-num').text()).toEqual('1')
    wrapper.setProps({
      slot: 2
    })
    expect(wrapper.find('.slot-num').text()).toEqual('2')
    wrapper.setProps({
      slot: 3
    })
    expect(wrapper.find('.slot-num').text()).toEqual('3')
    wrapper.setProps({
      slot: 2,
      type: 'Clothing'
    })
    expect(wrapper.find('.clothing')).toHaveLength(1)
    expect(wrapper.find('.accessory')).toHaveLength(0)
    wrapper.setProps({
      slot: 2,
      type: 'Accessory'
    })
    expect(wrapper.find('.clothing')).toHaveLength(0)
    expect(wrapper.find('.accessory')).toHaveLength(1)
  })
})
