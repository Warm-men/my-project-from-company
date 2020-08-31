import { shallow } from 'src/utilsTests'
import PurchaseSuccess from './index'

describe('test purchase success', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(PurchaseSuccess, {
      helmetTitle: '购买成功',
      helmetLink: '/purchase_success',
      desc: '购买会员成功'
    })
  })

  it('wechat', () => {
    wrapper.setProps({
      isWechat: true
    })
    expect(wrapper.find('.other-btn').length).toBe(0)
    expect(wrapper.find('.other-text').length).toBe(0)
  })

  it('other', () => {
    wrapper.setProps({
      isWechat: false
    })
    expect(wrapper.find('.referral-code').length).toBe(0)
    expect(wrapper.find('.follow-tips').length).toBe(0)
  })
})
