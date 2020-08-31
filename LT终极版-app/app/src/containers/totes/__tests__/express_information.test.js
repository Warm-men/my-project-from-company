import React from 'react'
import { mount } from 'enzyme'
import ExpressInformationContainer from '../express_information'

describe('express_information page', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(
      <ExpressInformationContainer
        navigation={{
          state: {
            params: {
              tracking_code: '1234567890012'
            }
          }
        }}
      />
    )
  })

  describe('收货地址显示', () => {
    it('收货地址显示', () => {
      expect(wrapper.find({ testID: 'shipping-address' })).toHaveLength(0)
      wrapper.setState({
        shippingAddress: {
          address_1: '123',
          address_2: '321',
          city: '北京市',
          company: null,
          country: 'CN',
          customer_id: 665640,
          district: '东城区',
          full_name: '何兆',
          id: 21,
          state: '北京',
          telephone: '15555555555',
          zip_code: '100011'
        },
        data: []
      })
      expect(wrapper.find({ testID: 'shipping-address' })).toHaveLength(1)
    })
  })
})
