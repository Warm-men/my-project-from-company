import React from 'react'
import { shallow } from 'enzyme'
import { RateProductItem } from '../products'

describe('test', () => {
  beforeEach(() => {
    toteProduct = {
      service_feedback: null,
      product: {
        catalogue_photos: [
          {
            medium_url: 'url'
          }
        ]
      }
    }
    wrapper = shallow(
      <RateProductItem
        toteProduct={toteProduct}
        rateProduct={jest.fn()}
        rating={null}
        seeRate={jest.fn()}
        alreadyReturn={true}
      />
    )
  })

  it('不显示已评价', () => {
    expect(wrapper.find({ testID: 'has-complaint' }).length).toBe(0)
  })

  it('显示已评价', () => {
    toteProduct.service_feedback = ['随便写']
    wrapper = shallow(
      <RateProductItem
        toteProduct={toteProduct}
        rateProduct={jest.fn()}
        rating={null}
        seeRate={jest.fn()}
        alreadyReturn={true}
      />
    )
    expect(wrapper.find({ testID: 'has-complaint' }).length).toBe(1)
  })
})
