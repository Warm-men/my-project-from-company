import React from 'react'
import { shallow } from 'enzyme'
import ProductItem from '../tote_tracker_product_item'
describe('shopping car container', () => {
  let wrapper, product, didSelectedItem
  beforeEach(() => {
    product = {
      title: 'tt',
      catalogue_photos: [
        {
          full_url: 'xxx'
        }
      ],
      tote_slot: 2,
      type: 'Clothing'
    }
    didSelectedItem = jest.fn()
    wrapper = shallow(
      <ProductItem
        disable={false}
        product={product}
        didSelectedItem={didSelectedItem}
      />
    )
  })

  it('type是否有被传入', () => {
    expect(wrapper.find({ testID: 'tote-slot' }).props().type).toEqual(
      'Clothing'
    )
  })
})
