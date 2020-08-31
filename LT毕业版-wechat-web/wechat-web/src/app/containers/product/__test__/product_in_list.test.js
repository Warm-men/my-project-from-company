import { mount } from 'src/utilsTests'
import ProductThumbnail from '../product_in_list'
import ToteSlotIcon from 'src/app/containers/totes/tote_slot_icon'

describe('Test ToteSlotIcon props type to equal product type', () => {
  let wrapper
  let ToteSlotIconWrapper
  beforeEach(() => {
    wrapper = mount(ProductThumbnail, {
      product: {
        id: 1,
        type: 'Clothing',
        tote_slot: 2,
        catalogue_photos: [{ full_url: 'http://' }]
      }
    })
    ToteSlotIconWrapper = mount(ToteSlotIcon)
  })
  it('Test type', () => {
    ToteSlotIconWrapper.setProps({
      type: 'Clothing'
    })
    expect(ToteSlotIconWrapper.props().type).toEqual(
      wrapper.props().product.type
    )
  })
})
