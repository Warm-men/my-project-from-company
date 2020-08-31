import { shallow } from 'src/utilsTests'
import ExpressInfo from '../index'

describe('Test ExpressInfo Item', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(ExpressInfo, {
      value: null,
      index: null
    })
  })
  it('Test Empty Data', () => {
    expect(wrapper.find('.express-info').length).toBe(0)
  })
  it('Test Data', () => {
    wrapper.setProps({
      value: {
        carrier_message: '',
        carrier_updated_at: ''
      },
      index: 1
    })
    expect(wrapper.find('.express-info').length).toBe(1)
  })
  it('Test Data CarrierUpdatedAt', () => {
    wrapper.setProps({
      value: {
        carrier_message: '',
        carrier_updated_at: ''
      },
      index: 1
    })
    expect(wrapper.find('.express-info-head').length).toBe(0)
    wrapper.setProps({
      value: {
        carrier_message: '',
        carrier_updated_at: 'Sun, 07 Apr 2019 16:27:39'
      },
      index: 1
    })
    expect(wrapper.find('.express-info-head').text()).toBe(
      '2019.04.07 16:27:39'
    )
  })
  it('Test Data CarrierMessage', () => {
    wrapper.setProps({
      value: {
        carrier_message: '',
        carrier_updated_at: ''
      },
      index: 1
    })
    expect(wrapper.find('.express-info-text').length).toBe(0)
    wrapper.setProps({
      value: {
        carrier_message:
          '上海市 快件交给付攀峰，正在派送途中（联系电话：18201859004）',
        carrier_updated_at: 'Sun, 07 Apr 2019 16:27:39'
      },
      index: 1
    })
    expect(wrapper.find('.express-info-text').html()).toBe(
      '<p class="express-info-text"><span>上海市 快件交给付攀峰，正在派送途中（联系电话：<a href="tel:18201859004">18201859004</a>）</span></p>'
    )
  })
})
