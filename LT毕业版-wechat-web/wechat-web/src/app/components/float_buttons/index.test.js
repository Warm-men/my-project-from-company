import { mount } from 'src/utilsTests'
import FloatButtons from './index.jsx'

describe('Test FloatButtons', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(FloatButtons, {
      buttons: [],
      isInitScroll: false
    })
  })
  it('Buttons Empty', () => {
    expect(wrapper.find('.float-buttons-container').length).toBe(0)
  })
  it('Buttons', () => {
    wrapper.setProps({
      buttons: {
        index: {
          title: '首页'
        }
      },
      isInitScroll: false
    })
    expect(wrapper.find('.float-buttons-container').length).toBe(1)
    expect(wrapper.find('.float-button').length).toBe(1)
    wrapper.setProps({
      buttons: {
        index: {
          title: '首页'
        },
        cart: {
          title: '购物车'
        }
      },
      isInitScroll: false
    })
    expect(wrapper.find('.float-button').length).toBe(2)
  })
  it('回到顶部', () => {
    expect(wrapper.find('img').length).toBe(0)
    wrapper.setProps({
      buttons: [
        {
          index: {
            title: '首页'
          }
        }
      ],
      isInitScroll: true
    })
    expect(wrapper.find('img').length).toBe(1)
  })
})
