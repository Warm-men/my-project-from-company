import { mount } from 'enzyme'
import ProductItem from '../past_tote_product_item'
import ToteSlotIcon from 'src/app/containers/totes/tote_slot_icon'

describe('Test ToteSlotIcon props type to equal product type', () => {
  let wrapper
  let ToteSlotIconWrapper
  beforeEach(() => {
    let toteProduct = {
      product: {
        id: 1,
        full_price: 10,
        tote_slot: 2,
        catalogue_photos: [{ medium_url: 'http://xx' }],
        type: 'Clothing'
      },
      transition_info: { modified_price: 0 },
      product_size: { size_abbreviation: 'S' }
    }

    wrapper = mount(<ProductItem toteProduct={toteProduct} />)
    ToteSlotIconWrapper = mount(<ToteSlotIcon type={'Clothing'} />)
  })
  it('Test type', () => {
    expect(ToteSlotIconWrapper.props().type).toEqual(
      wrapper.props().toteProduct.product.type
    )
  })
})
