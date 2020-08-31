import { mount } from 'src/utilsTests'
import UserBenefit from './index'

describe('test user benefit types', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(UserBenefit, {
      display_name: '尊享会员',
      days_interval: null,
      interval: 1,
      isAnnualCardAcivity: false,
      isPlansPage: false
    })
  })

  it('月卡3+2，three-add-two', () => {
    expect(wrapper.find('.three-add-two').exists()).toBe(true)

    wrapper.setProps({
      interval: 3
    })
    expect(wrapper.find('.three-add-two').exists()).toBe(false)
  })

  it('夏日加一，summer-three-add-two-one', () => {
    expect(wrapper.find('.summer-three-add-two-one').exists()).toBe(false)
    wrapper.setProps({
      isPlansPage: true
    })
    expect(wrapper.find('.summer-three-add-two-one').exists()).toBe(false)
  })

  it('4+2，four-add-two', () => {
    expect(wrapper.find('.four-add-two').exists()).toBe(false)
    wrapper.setProps({
      interval: 3
    })
    expect(wrapper.find('.four-add-two').exists()).toBe(true)
    wrapper.setProps({
      interval: 3
    })
    expect(wrapper.find('.four-add-two').exists()).toBe(true)
  })

  it('夏日加一，summer-four-add-two-one', () => {
    expect(wrapper.find('.summer-four-add-two-one').exists()).toBe(false)
    wrapper.setProps({
      display_name: '创始会员',
      isPlansPage: true
    })
    expect(wrapper.find('.summer-four-add-two-one').exists()).toBe(false)
  })

  it('月卡，suspend-thirty', () => {
    expect(wrapper.find('.suspend-thirty').exists()).toBe(true)
  })

  it('季卡，suspend-thirty', () => {
    wrapper.setProps({
      interval: 3
    })
    expect(wrapper.find('.suspend-thirty').exists()).toBe(true)
  })

  it('度假套餐，suspend-thirty', () => {
    wrapper.setProps({
      interval: null,
      days_interval: 10 //days
    })
    expect(wrapper.find('.suspend-thirty').exists()).toBe(true)
  })

  it('年卡，suspend-thirty', () => {
    wrapper.setProps({
      interval: 12
    })
    expect(wrapper.find('.suspend-ninety').exists()).toBe(true)
  })
  it('年卡，fast-shipping', () => {
    wrapper.setProps({
      isAnnualCardAcivity: true
    })
    expect(wrapper.find('.fast-shipping').exists()).toBe(true)
  })
  it('不是年卡，现实更多的权益', () => {
    expect(wrapper.find('.more-right').exists()).toBe(true)
  })
})
