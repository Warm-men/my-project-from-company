import { shallow } from 'src/utilsTests'
import Toast from 'src/app/components/tips/toast.jsx'

describe('Test TotePopups ', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(Toast, {
      isShow: false,
      content: ``,
      timer: 3,
      type: 'warning',
      image: null
    })
  })
  it('Toast Hide', () => {
    expect(
      wrapper
        .dive()
        .find('.toast')
        .exists()
    ).toBe(false)
    expect(
      wrapper
        .dive()
        .find('.hidden')
        .exists()
    ).toBe(true)
    expect(
      wrapper
        .dive()
        .find('.toast-content')
        .text()
    ).toBe(``)
  })
  it('Toast Show', () => {
    wrapper.setProps({
      isShow: true,
      content: `测试`,
      timer: 3,
      type: 'warning',
      image: null
    })
    expect(
      wrapper
        .dive()
        .find('.toast')
        .exists()
    ).toBe(true)
    expect(
      wrapper
        .dive()
        .find('.toast-content')
        .exists()
    ).toBe(true)
    expect(
      wrapper
        .dive()
        .find('.toast-content')
        .text()
    ).toBe(`测试`)
    setTimeout(() => {
      expect(
        wrapper
          .dive()
          .find('.toast')
          .exists()
      ).toBe(false)
      expect(
        wrapper
          .dive()
          .find('.hidden')
          .exists()
      ).toBe(true)
      expect(
        wrapper
          .dive()
          .find('.toast-content')
          .text()
      ).toBe(``)
    }, 3000)
  })
})
