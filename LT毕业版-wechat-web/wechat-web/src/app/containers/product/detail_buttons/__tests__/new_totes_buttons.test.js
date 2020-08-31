import { shallow } from 'src/utilsTests'
import NewTotesButtons from '../new_totes_buttons'

describe('测试详情按钮组', () => {
  const props = {
    inCloset: false,
    disabled: true,
    buttonText: ''
  }
  let wrapper
  beforeEach(() => {
    wrapper = shallow(NewTotesButtons, { ...props })
  })
  it('disabled为false, 按钮为可点击', () => {
    expect(wrapper.find('.add-to-cart').every('.full-btn')).toEqual(true)
  })
  it('disabled为true, 按钮为不可点击', () => {
    wrapper.setProps({
      disabled: true
    })
    expect(wrapper.find('.add-to-cart').every('.disabled')).toEqual(true)
  })
  it('inCloset为true, 图标为已收藏', () => {
    wrapper.setProps({
      inCloset: true
    })
    expect(
      wrapper.contains(
        <img
          className="buttons-icon"
          alt=""
          src={require(`../images/collected.svg`)}
        />
      )
    ).toEqual(false)
  })
  it('inCloset为false, 图标为未收藏', () => {
    wrapper.setProps({
      inCloset: false
    })
    expect(
      wrapper.contains(
        <img
          className="buttons-icon"
          alt=""
          src={require(`../images/collect.svg`)}
        />
      )
    ).toEqual(false)
  })
})
