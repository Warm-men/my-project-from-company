import React from 'react'
import { shallow } from 'enzyme'
import TopView from '../choose_size_panel/choose_product_details'
describe('shopping car container', () => {
  let wrapper, product
  beforeEach(() => {
    product = {
      tote_slot: 2,
      title: '围裹式波点连衣裙',
      tags: [],
      brand: {
        name: 'URBAN REVIVO',
        image_url: '',
        id: '111'
      },
      catalogue_photos: [
        {
          full_url: ''
        }
      ]
    }
    wrapper = shallow(<TopView product={product} />)
  })

  it('X个衣位的单品在选择尺码替换时，商品详情显示 占X个衣位', () => {
    expect(wrapper.find({ testID: 'tote-slot-tip' }).length).toBe(1)
  })
  it('1个衣位的单品在选择尺码替换时，商品详情不显示 占X个衣位', () => {
    product.tote_slot = 1
    wrapper = shallow(<TopView product={product} />)
    expect(wrapper.find({ testID: 'tote-slot-tip' }).length).toBe(0)
  })
})
