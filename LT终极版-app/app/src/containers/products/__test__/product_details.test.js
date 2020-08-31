import React from 'react'
import { shallow } from 'enzyme'
import { ProductDetailsTitleView } from '../../../../storybook/stories/products/details'
describe('shopping car container', () => {
  let wrapper
  beforeEach(() => {
    const product = {
      tote_slot: 2,
      title: '围裹式波点连衣裙',
      tags: [],
      brand: {
        name: 'URBAN REVIVO',
        image_url:
          'https://qimg-staging.letote.cn/uploads/brand_photo/111/URBAN_REVIVO_%E8%83%8C%E6%99%AF%E5%9B%BE.png',
        id: '111'
      }
    }
    wrapper = shallow(<ProductDetailsTitleView product={product} />)
  })

  it('衣服两个衣位', () => {
    expect(wrapper.find({ testID: 'tote-slot-tip' }).length).toBe(1)
  })
})
