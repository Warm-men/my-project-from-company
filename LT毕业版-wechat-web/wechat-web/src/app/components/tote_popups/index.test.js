import { mount } from 'src/utilsTests'
import TotePopups from './index.jsx'

describe('Test TotePopups ', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(TotePopups, {
      app: {
        floatHover: null,
        isPreventFloatHover: false
      },
      closePopups: jest.fn()
    })
  })
  it('不显示弹窗，数据为空', () => {
    expect(wrapper.find('.tote-popups').length).toBe(0)
  })
  it('不显示弹窗，首页有弹，阻止衣箱弹窗', () => {
    wrapper.setProps({
      app: {
        floatHover: {
          display_type: 'pop'
        },
        isPreventFloatHover: true
      }
    })
    expect(wrapper.find('.tote-popups').length).toBe(0)
  })
  it('显示弹窗', () => {
    wrapper.setProps({
      app: {
        floatHover: {
          display_type: 'pop'
        },
        isPreventFloatHover: false
      }
    })
    expect(wrapper.find('.tote-popups').length).toBe(1)
  })
  it('显示浮窗', () => {
    wrapper.setProps({
      app: {
        floatHover: {
          display_type: 'float'
        },
        isPreventFloatHover: false
      }
    })
    expect(wrapper.find('.tote-popups-float').length).toBe(1)
  })
})
