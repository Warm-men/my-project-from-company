import React from 'react'
import { shallow } from 'enzyme'
import SearchProductItem from '../search/search_product'
describe('搜索商品item 测试', () => {
  let wrapper, products, item
  beforeEach(() => {
    products = [{ id: 123 }, { id: 124 }]
    item = {
      catalogue_photos: [{ full_url: '123' }],
      id: 123,
      brand: { name: '123' },
      title: '123'
    }
    wrapper = shallow(
      <SearchProductItem
        selectProduct={jest.fn()}
        products={products}
        item={item}
      />
    )
  })

  it('商品已经被选中', () => {
    expect(wrapper.find({ testID: 'itemButtonText' }).prop('children')).toEqual(
      `已添加`
    )
  })

  it('显示正确的名字品牌', () => {
    expect(wrapper.find({ testID: 'brand-name' }).prop('children')).toEqual(
      item.brand.name
    )
    expect(wrapper.find({ testID: 'title' }).prop('children')).toEqual(
      item.title
    )
  })

  it('商品没有被选中', () => {
    wrapper.setProps({
      products: [{ id: 321 }, { id: 423 }]
    })
    expect(wrapper.find({ testID: 'itemButtonText' }).prop('children')).toEqual(
      `添加`
    )
  })
})
