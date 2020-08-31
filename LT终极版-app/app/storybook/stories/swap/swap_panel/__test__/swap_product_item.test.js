import React from 'react'
import { shallow } from 'enzyme'
import ProductItem from '../swap_product_item'
describe('shopping car container', () => {
  let wrapper, toteProduct, didSelectedItem
  beforeEach(() => {
    toteProduct = {
      product: {
        title: 'tt',
        catalogue_photos: [
          {
            full_url: 'xxx'
          }
        ],
        tote_slot: 2,
        type: 'Clothing'
      },
      slot: 3
    }
    didSelectedItem = jest.fn()
    wrapper = shallow(
      <ProductItem
        disable={false}
        isSelected={true}
        toteProduct={toteProduct}
        isOnboarding={false}
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
