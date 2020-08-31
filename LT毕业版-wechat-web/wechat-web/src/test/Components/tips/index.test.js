import { shallow } from 'src/utilsTests'
import Tips from 'src/app/components/tips/tips.js'

describe('Test Tips ', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(Tips, {
      isShow: false,
      content: '',
      timer: 3,
      image: ''
    })
  })
  it('Tips Hide', () => {
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
        .find('.alert-content')
        .text()
    ).toBe(``)
  })
  it('Tips Show', () => {
    wrapper.setProps({
      isShow: true,
      content: `测试一下`,
      timer: 3,
      image: ''
    })
    expect(
      wrapper
        .dive()
        .find('.tips')
        .exists()
    ).toBe(true)
    expect(
      wrapper
        .dive()
        .find('.hidden')
        .exists()
    ).toBe(false)
    expect(
      wrapper
        .dive()
        .find('.alert-content')
        .text()
    ).toBe(`测试一下`)
    setTimeout(() => {
      expect(
        wrapper
          .dive()
          .find('.tips')
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
          .find('.alert-content')
          .text()
      ).toBe(``)
    }, 3000)
  })
})
