import React from 'react'
import { shallow } from 'enzyme'
import ToteReturnContainer from '../tote_return'

describe('return totes page', () => {
  let wrapper, navigation, newNavigation
  beforeEach(() => {
    navigation = {
      addListener: jest.fn(),
      state: {
        params: {
          tote: {
            product_parts: [
              {
                product_title: '格纹拼接西装外套',
                parts: [
                  {
                    title: '腰带'
                  }
                ]
              }
            ],
            tote_products: [
              {
                transition_state: 'returned',
                product: {
                  full_price: 559,
                  title: '绞花蕾丝边饰针织衫',
                  member_price: 447,
                  tote_slot: 1
                }
              },
              {
                transition_state: 'available_for_purchase',
                product: {
                  full_price: 559,
                  title: '绞花蕾丝边衫',
                  member_price: 447,
                  tote_slot: 1
                }
              },
              {
                transition_state: 'purchased',
                product: {
                  full_price: 559,
                  title: '边饰针织衫',
                  member_price: 447,
                  tote_slot: 1
                }
              }
            ],
            scheduled_return: {
              tote_free_service: null
            }
          }
        }
      }
    }
    newNavigation = {
      addListener: jest.fn(),
      state: {
        params: {
          tote: {
            product_parts: [
              {
                product_title: '格纹拼接西装外套',
                parts: [
                  {
                    title: '腰带'
                  }
                ]
              }
            ],
            tote_products: [],
            scheduled_return: {
              tote_free_service: null
            }
          }
        }
      }
    }
    wrapper = shallow(
      <ToteReturnContainer.wrappedComponent
        appStore={{}}
        currentCustomerStore={{
          localShippingAddresses: []
        }}
        modalStore={{}}
        totesStore={{
          current_totes: [
            { id: 1, progress_status: { status: 'delivered' } },
            { id: 2, progress_status: { status: 'delivered' } }
          ]
        }}
        navigation={navigation}
      />
    )
  })

  it('传入的数据商品有一件待支付，一件已购买', () => {
    expect(wrapper.state().toteProducts).toHaveLength(1)
  })

  it('传入的数据商品列表为空', () => {
    wrapper = shallow(
      <ToteReturnContainer.wrappedComponent
        appStore={{}}
        currentCustomerStore={{
          localShippingAddresses: []
        }}
        modalStore={{}}
        totesStore={{
          current_totes: [
            { id: 1, progress_status: { status: 'delivered' } },
            { id: 2, progress_status: { status: 'delivered' } }
          ]
        }}
        navigation={newNavigation}
      />
    )
    expect(wrapper.state().toteProducts).toHaveLength(0)
  })
})
