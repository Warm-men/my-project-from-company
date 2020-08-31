import { shallow } from 'enzyme'
import ProductItem from '../past_tote_product_item'

describe('Test TotePastProduceItem', () => {
  let wrapper, toteProduct
  beforeEach(() => {
    toteProduct = generateInitialToteProduct()
    wrapper = shallow(<ProductItem toteProduct={toteProduct} />)
  })

  describe('test slotnum', () => {
    it('should render slotnum when tote_slot of product is larger than 1', () => {
      const newToteProduct = { ...toteProduct }
      newToteProduct.product.tote_slot = 2
      wrapper.setProps({
        toteProduct: newToteProduct
      })
      expect(wrapper.find('.products-both-slot')).toHaveLength(1)
    })
    it('should not render slotnum when tote_slot of product is 1', () => {
      expect(wrapper.find('.products-both-slot')).toHaveLength(0)
    })
  })

  describe('test returned product item', () => {
    it('should render default style of price', () => {
      const newToteProduct = { ...toteProduct }
      newToteProduct.transition_state = 'returned'
      wrapper.setProps({
        toteProduct: newToteProduct
      })
      expect(wrapper.find('.member-price')).toHaveLength(1)
    })
    it('show full price', () => {
      expect(wrapper.find('.full-price').length).toEqual(0)
    })
  })

  const generateInitialToteProduct = () => {
    const result_tote_product = {
      product: {
        id: 1,
        full_price: 10,
        tote_slot: 1,
        catalogue_photos: [
          {
            medium_url: 'http://xx'
          }
        ]
      },
      product_size: { size_abbreviation: 'S' },
      transition_state: 'purchased',
      id: 1,
      transition_info: {
        modified_price: 1
      }
    }
    return result_tote_product
  }
})
