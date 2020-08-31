import { shallow } from 'src/utilsTests'
import PromoCodeSelect from './index'

describe('Test PromoCodeSelect AbTest', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(PromoCodeSelect, {
      promoCodePrice: 0,
      handleSelectPromoCode: () => {},
      promoCodeType: ''
    })
  })
  it('promoCodePrice empty', () => {
    wrapper.setProps({
      promoCodePrice: 0,
      promoCodeType: 'Valid'
    })
    expect(wrapper.find('.price').text()).toBe('无可用')
  })
  it('promoCodePrice reset', () => {
    wrapper.setProps({
      promoCodePrice: 0,
      promoCodeType: 'reset'
    })
    expect(wrapper.find('.price').text()).toBe('未使用优惠券')
  })
  it('promoCodePrice valid', () => {
    wrapper.setProps({
      promoCodePrice: 100,
      promoCodeType: 'Valid'
    })
    expect(wrapper.find('.price').text()).toBe('-¥100')
  })
})
