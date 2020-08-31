import React from 'react'
import { shallow } from 'enzyme'
import ProductItem from '../tote_current_product_item'

describe('product item in current tote', () => {
  let wrapper
  let nextProduct
  beforeEach(() => {
    nextProduct = {
      catalogue_photos: [
        {
          thumb_url: 'https://xxx'
        }
      ],
      full_price: 1234
    }
  })
  describe('product item in current tote when locked ', () => {
    beforeEach(() => {
      const toteProduct = {
        transition_state: 'none',
        transition_info: null,
        product_size: { size_abbreviation: 'M' }
      }
      wrapper = shallow(
        <ProductItem product={nextProduct} toteProduct={toteProduct} />
      )
    })

    it('should show image', () => {
      expect(wrapper.find({ testID: 'image' })).toHaveLength(1)
    })

    it('type是否有被传入', () => {
      wrapper.setProps({
        product: {
          title: 'tt',
          catalogue_photos: [
            {
              full_url: 'xxx'
            }
          ],
          tote_slot: 2,
          type: 'Clothing'
        }
      })
      expect(wrapper.find({ testID: 'tote-slot' }).props().type).toEqual(
        'Clothing'
      )
    })

    it('product size view will hide when transation state is returned', () => {
      wrapper.setProps({
        toteProduct: {
          transition_state: 'returned',
          transition_info: { modified_price: 22 },
          product_size: { size_abbreviation: 'M' }
        }
      })
      expect(wrapper.find({ testID: 'product-size-description' })).toHaveLength(
        0
      )
    })

    it('product size view will show when transation state is not none', () => {
      wrapper.setProps({
        toteProduct: {
          transition_state: 'none',
          transition_info: null,
          product_size: { size_abbreviation: 'M' }
        }
      })
      expect(wrapper.find({ testID: 'product-size-description' })).toHaveLength(
        1
      )
    })

    it('product size view will show correctly', () => {
      wrapper.setProps({
        toteProduct: {
          transition_state: 'none',
          transition_info: null,
          product_size: { size_abbreviation: 'XM' }
        }
      })
      expect(
        wrapper.find({ testID: 'product-size-description' }).props().children
          .props.children.props.children
      ).toEqual('XM码')
    })

    it('should not show product item status', () => {
      expect(wrapper.find({ testID: 'product-item-status' })).toHaveLength(0)
    })

    it('should not show product item specific price', () => {
      expect(
        wrapper.find({ testID: 'product-item-specific-price' })
      ).toHaveLength(0)
    })

    it('should not show product item full price', () => {
      expect(wrapper.find({ testID: 'product-item-full-price' })).toHaveLength(
        0
      )
    })

    it('should not show purchase button', () => {
      expect(wrapper.find({ testID: 'purchase' })).toHaveLength(0)
    })
  })

  describe('product item in current tote when shipped ', () => {
    beforeEach(() => {
      const toteProduct = {
        transition_state: 'none',
        transition_info: null,
        product_size: { size_abbreviation: 'M' }
      }
      wrapper = shallow(
        <ProductItem product={nextProduct} toteProduct={toteProduct} />
      )
    })

    it('should show image', () => {
      expect(wrapper.find({ testID: 'image' })).toHaveLength(1)
    })

    it('should not show product item status', () => {
      expect(wrapper.find({ testID: 'product-item-status' })).toHaveLength(0)
    })

    it('should not show product item specific price', () => {
      expect(
        wrapper.find({ testID: 'product-item-specific-price' })
      ).toHaveLength(0)
    })

    it('should not show product item full price', () => {
      expect(wrapper.find({ testID: 'product-item-full-price' })).toHaveLength(
        0
      )
    })

    it('should not show purchase button', () => {
      expect(wrapper.find({ testID: 'purchase' })).toHaveLength(0)
    })
  })

  describe('product item in current tote when delivered', () => {
    beforeEach(() => {
      const toteProduct = {
        transition_state: 'purchased',
        transition_info: { modified_price: 200 },
        product_size: { size_abbreviation: 'M' }
      }
      wrapper = shallow(
        <ProductItem product={nextProduct} toteProduct={toteProduct} />
      )
    })

    it('should show product image', () => {
      expect(wrapper.find({ testID: 'image' })).toHaveLength(1)
    })

    describe('product item in current tote if purchased', () => {
      it('should show purchased if purchased', () => {
        expect(
          wrapper.find({ testID: 'product-item-status' }).props().children
        ).toEqual('已购买')
      })

      it('should show specific price', () => {
        expect(
          wrapper.find({ testID: 'product-item-specific-price' }).props()
            .children
        ).toEqual('¥200')
      })

      it('should show full price', () => {
        expect(
          wrapper.find({ testID: 'product-item-full-price' }).props().children
        ).toEqual('¥1234')
      })

      it('should not show purchase button', () => {
        expect(wrapper.find({ testID: 'purchase-button' })).toHaveLength(1)
      })
    })

    describe('product item in current tote if returned', () => {
      beforeEach(() => {
        const toteProduct = {
          transition_state: 'returned',
          transition_info: { modified_price: 200 },
          product_size: { size_abbreviation: 'M' }
        }
        wrapper = shallow(
          <ProductItem product={nextProduct} toteProduct={toteProduct} />
        )
      })

      it('should show returned if returned', () => {
        expect(
          wrapper.find({ testID: 'product-item-status' }).props().children
        ).toEqual('已归还')
      })

      it('should show specific price', () => {
        expect(
          wrapper.find({ testID: 'product-item-specific-price' }).props()
            .children
        ).toEqual('¥200')
      })

      it('should show full price', () => {
        expect(
          wrapper.find({ testID: 'product-item-full-price' }).props().children
        ).toEqual('¥1234')
      })

      it('should not show purchase button', () => {
        expect(wrapper.find({ testID: 'purchase-button' })).toHaveLength(0)
      })
    })
  })

  describe('product item in current tote when schedule returned', () => {
    beforeEach(() => {
      const toteProduct = {
        transition_state: 'purchased',
        transition_info: { modified_price: 200 },
        product_size: { size_abbreviation: 'M' }
      }
      wrapper = shallow(
        <ProductItem product={nextProduct} toteProduct={toteProduct} />
      )
    })

    it('should show product image', () => {
      expect(wrapper.find({ testID: 'image' })).toHaveLength(1)
    })

    describe('product item in current tote if purchased', () => {
      it('should show purchased if purchased', () => {
        expect(
          wrapper.find({ testID: 'product-item-status' }).props().children
        ).toEqual('已购买')
      })

      it('should show specific price', () => {
        expect(
          wrapper.find({ testID: 'product-item-specific-price' }).props()
            .children
        ).toEqual('¥200')
      })

      it('should show full price', () => {
        expect(
          wrapper.find({ testID: 'product-item-full-price' }).props().children
        ).toEqual('¥1234')
      })

      it('should not show purchase button', () => {
        expect(wrapper.find({ testID: 'purchase-button' })).toHaveLength(1)
      })
    })

    describe('product item in current tote if returned', () => {
      beforeEach(() => {
        const toteProduct = {
          transition_state: 'returned',
          transition_info: { modified_price: 200 },
          product_size: { size_abbreviation: 'M' }
        }
        wrapper = shallow(
          <ProductItem product={nextProduct} toteProduct={toteProduct} />
        )
      })

      it('should show returned if returned', () => {
        expect(
          wrapper.find({ testID: 'product-item-status' }).props().children
        ).toEqual('已归还')
      })

      it('should show specific price', () => {
        expect(
          wrapper.find({ testID: 'product-item-specific-price' }).props()
            .children
        ).toEqual('¥200')
      })

      it('should show full price', () => {
        expect(
          wrapper.find({ testID: 'product-item-full-price' }).props().children
        ).toEqual('¥1234')
      })

      it('should not show purchase button', () => {
        expect(wrapper.find({ testID: 'purchase-button' })).toHaveLength(0)
      })
    })
  })
})
