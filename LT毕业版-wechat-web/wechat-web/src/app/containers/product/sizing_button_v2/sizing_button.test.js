import { mount } from 'src/utilsTests'
import SizingButton from './index'

describe('test sizing button', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(SizingButton, {
      isActive: false,
      swappable: true,
      selectedSizeId: 1,
      currentSizeId: 2,
      currentSizeName: 'S',
      handleSizeChange: jest.fn(),
      isLastClothingPreviewTote: false
    })
  })

  it('no active state', () => {
    expect(wrapper.find('.active').exists()).toBe(false)
  })

  it('active state', () => {
    wrapper.setProps({
      isActive: true,
      currentSizeId: 1
    })
    expect(wrapper.find('.active').exists()).toBe(true)
  })

  it('swapple', () => {
    expect(wrapper.find('.inactive').exists()).toBe(false)
  })

  it('no swapple', () => {
    wrapper.setProps({
      swappable: false
    })
    expect(wrapper.find('.inactive').exists()).toBe(true)
  })

  it('last size in tote, active current size', () => {
    expect(wrapper.find('.active').exists()).toBe(false)
    wrapper.setProps({
      isActive: true,
      isLastClothingPreviewTote: true,
      selectedSizeId: 2
    })
    expect(wrapper.find('.active').exists()).toBe(true)
  })
})
