import ToteBuyPromoCode from '../../../../storybook/stories/totes/tote_buy_promo_code'
import ToteBuyClothesContainer from '../tote_buy_clothes'
import React from 'react'
import { shallow } from 'enzyme'
describe('Test Component show', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      <ToteBuyClothesContainer.wrappedComponent
        currentCustomerStore={{ enablePaymentContract: [] }}
        appStore={{}}
        navigation={{
          state: {
            params: {
              toteProduct: {
                product_size: { size_abbreviation: '' },
                product_item: { state: '' },
                product: {
                  brand: { name: '' },
                  catalogue_photos: []
                },
                transition_info: {
                  modified_price: 123
                }
              },
              orders: [],
              nonReturnedlist: []
            }
          }
        }}
      />
    )
  })

  it('should display tote buy promo code anyway', () => {
    expect(wrapper.find(ToteBuyPromoCode)).toHaveLength(1)
  })
})
