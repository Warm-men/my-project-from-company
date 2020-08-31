import { shallow, mount } from 'src/utilsTests'
import Mpalns, { CardType } from './index'

describe('vacation package test', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      Mpalns,
      {
        authentication: {
          isSubscriber: false
        },
        location: {
          query: {}
        },
        dispatch: jest.fn()
      },
      {
        subscriptionTypes: [{}]
      }
    )
  })

  it('mplans render', () => {
    expect(wrapper.find('.mplans').exists()).toBe(false)
  })
})

describe('CardType pure components', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(CardType, {
      sub_display_name: '10天度假套餐',
      accessory_count: 6,
      clothing_count: 2,
      original_price: 499,
      name: '送50元优惠券',
      id: 22,
      activedId: 11,
      selectPackage: jest.fn()
    })
  })

  it('test card-type mid', () => {
    expect(wrapper.find('.card-type').exists()).toBe(true)
    expect(wrapper.find('.mid').exists()).toBe(true)
  })
  it('test activedCard', () => {
    expect(wrapper.find('.activedCard').exists()).toBe(false)
    wrapper.setProps({
      activedId: 22
    })
    expect(wrapper.find('.activedCard').exists()).toBe(true)
  })

  it('test vacation-type text', () => {
    expect(wrapper.find('.vacation-type').text()).toEqual('10天度假套餐')
  })
  it('test vacation-content text', () => {
    expect(wrapper.find('.vacation-content').text()).toEqual('2件衣服+6件配饰')
  })
  it('test send-code text', () => {
    expect(wrapper.find('.send-code').text()).toEqual('送50元优惠券')
  })
  it('test smplans-price text', () => {
    expect(wrapper.find('.mplans-price').text()).toEqual('¥499')
  })
})
