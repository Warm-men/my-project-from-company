import { mount } from 'src/utilsTests'
import HomepageThemes from '../homepage_themes'
import ToteSlotIcon from 'src/app/containers/totes/tote_slot_icon'

describe('Test ToteSlotIcon props type to equal product type', () => {
  let wrapper
  let ToteSlotIconWrapper
  beforeEach(() => {
    wrapper = mount(HomepageThemes, {
      newArrival: [
        {
          arrival: {
            logo: ''
          }
        }
      ],
      newProducts: [
        {
          id: 1,
          catalogue_photos: [{ medium_url: '' }],
          tote_slot: 2,
          type: 'Clothing'
        }
      ]
    })
    ToteSlotIconWrapper = mount(ToteSlotIcon)
  })
  it('Test type', () => {
    ToteSlotIconWrapper.setProps({
      type: 'Clothing'
    })
    expect(ToteSlotIconWrapper.props().type).toEqual(
      wrapper.props().newProducts[0].type
    )
  })
})
