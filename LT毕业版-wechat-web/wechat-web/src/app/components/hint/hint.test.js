import { mount } from 'src/utilsTests'
import Hint from './index.jsx'

describe('test hint ', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(Hint, {
      title: '确定下单吗',
      content:
        '我们会为你推荐一些时尚搭配并预先放进你的衣箱，你也可以挑选自己喜欢的单品进行更换',
      leftBtnText: '去换衣',
      rightBtnText: '确定下单',
      leftButton: jest.fn(),
      rightButton: jest.fn()
    })
  })
  // it('test render classname === hint', () => {
  //   expect(wrapper.find('.hint').length).toBe(1)
  // })
  it('test render classname === left-btn', () => {
    expect(wrapper.find('.left-btn').length).toBe(1)
  })
  it('test render classname === right-btn', () => {
    expect(wrapper.find('.right-btn').length).toBe(1)
  })
  it('test render p text', () => {
    expect(wrapper.find('p').text()).toEqual('确定下单吗')
  })
  it('test render span text', () => {
    expect(wrapper.find('.top-content').text()).toEqual(
      '我们会为你推荐一些时尚搭配并预先放进你的衣箱，你也可以挑选自己喜欢的单品进行更换'
    )
  })
})
