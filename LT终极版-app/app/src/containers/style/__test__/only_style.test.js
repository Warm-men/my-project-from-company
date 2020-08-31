import React from 'react'
import { shallow } from 'enzyme'
import OnlyStyleContainer from '../only_style/index'

describe('测试sizeOrder', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      <OnlyStyleContainer
        navigation={{
          state: {
            params: {
              type: 'bust_size_number'
            }
          }
        }}
        modalStore={{
          show: jest.fn()
        }}
        appStore={{}}
        currentCustomerStore={{
          id: 1,
          hasCompleteSizes: jest.fn(),
          style: {
            MEASUREMENT_KEYS: [
              'waist_size',
              'bust_size_number',
              'hip_size_inches'
            ],
            height_inches: 100,
            weight: 50,
            bra_size: 70,
            cup_size: 'B',
            dress_size: 120,
            top_size: 100,
            age_range: 28
          }
        }}
      />
    ).dive()
  })
  it('测试sizeOrder', () => {
    const not_finished_key_style = wrapper.instance().sizeOrder()
    expect(not_finished_key_style).toEqual('waist_size')
  })
})
