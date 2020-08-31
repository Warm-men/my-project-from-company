import React from 'react'
import { shallow } from 'enzyme'
import ToteScheduledAutoPickup from '../tote_scheduled_auto_pickup'
import {
  ToteReturnExpressInfoCardBooking,
  ToteReturnExpressInfoCardAddress
} from '../../../../../storybook/stories/totes/tote_return/tote_return_express_info_card'
import ToteReturndRemind from '../../../../../storybook/stories/totes/tote_return/tote_return_remind'

describe('tote scheduled auto pickup', () => {
  let wrapper
  let nextCurrentCustomerStore
  let nextNavigation
  let nextOnCommitting
  let nextUpdateToteReturnShippingAddress
  beforeEach(() => {
    nextCurrentCustomerStore = { localShippingAddresses: [] }
    nextNavigation = { addListener: jest.fn() }
    nextOnCommitting = jest.fn()
    nextUpdateToteReturnShippingAddress = jest.fn()
  })

  describe('should render correctly any booking', () => {
    it('should render correctly when there is booking but length is 0', () => {
      wrapper = getNoShippingAddressWrapper()
      expect(
        wrapper.find(ToteReturnExpressInfoCardBooking).prop('message')
      ).toBe(null)
    })

    it('should render correctly when there is a booking', () => {
      wrapper = getShippingAddressWrapper()
      const bookingsDetails = '2019年10月17日 15:30'
      wrapper.setState({
        bookingsDetails,
        addressIndex: 0
      })
      expect(
        wrapper.find(ToteReturnExpressInfoCardBooking).prop('message')
      ).toBe(bookingsDetails)
    })
  })

  describe('test navigate', () => {
    let mockNavigate
    beforeEach(() => {
      mockNavigate = jest.fn(path => {})
    })
    it('should go to editAddress', () => {
      wrapper = getShippingAddressWrapper()
      wrapper.setProps({
        navigation: {
          navigate: mockNavigate
        }
      })
      wrapper.setState({
        addressIndex: 0
      })
      wrapper.instance()._editAddress()
      expect(mockNavigate.mock.calls.length).toEqual(1)
      expect(mockNavigate.mock.calls[0][0]).toEqual('EditAndAddShippingAddress')
      expect(mockNavigate.mock.calls[0][1].edit).toBe(true)
      expect(mockNavigate.mock.calls[0][1].addressIndex).toBe(0)
      expect(mockNavigate.mock.calls[0][1].cityChange).toBeDefined()
    })

    it('should go to addAddress', () => {
      wrapper = getNoShippingAddressWrapper()
      wrapper.setProps({
        navigation: {
          navigate: mockNavigate
        }
      })
      wrapper.instance()._addAddress()
      expect(mockNavigate.mock.calls[0][0]).toEqual('EditAndAddShippingAddress')
      expect(mockNavigate.mock.calls[0][1].edit).toBe(false)
      expect(mockNavigate.mock.calls[0][1].onConfirmAdd).toBeDefined()
    })
  })

  it('should renderer correctly when there is no local shipping address', () => {
    wrapper = getNoShippingAddressWrapper()
    expect(wrapper.find(ToteReturnExpressInfoCardBooking)).toHaveLength(1)
    expect(wrapper.find(ToteReturnExpressInfoCardAddress)).toHaveLength(1)
    expect(
      wrapper.find(ToteReturnExpressInfoCardAddress).prop('message')
    ).toBeUndefined()
    expect(wrapper.find(ToteReturndRemind)).toHaveLength(1)
  })

  it('should renderer correctly when there are shipping addresses', () => {
    wrapper = getShippingAddressWrapper()

    expect(wrapper.find(ToteReturnExpressInfoCardBooking)).toHaveLength(1)
    expect(wrapper.find(ToteReturnExpressInfoCardAddress)).toHaveLength(1)
    expect(wrapper.find(ToteReturndRemind)).toHaveLength(1)
  })

  it('should renderer correctly when there are shipping addresses but length is 0', () => {
    nextCurrentCustomerStore = {
      localShippingAddresses: []
    }
    wrapper = shallow(
      <ToteScheduledAutoPickup.wrappedComponent
        currentCustomerStore={nextCurrentCustomerStore}
        navigation={nextNavigation}
        onCommitting={nextOnCommitting}
        updateToteReturnShippingAddress={nextUpdateToteReturnShippingAddress}
      />
    )

    expect(wrapper.find(ToteReturnExpressInfoCardBooking)).toHaveLength(1)
    expect(wrapper.find(ToteReturnExpressInfoCardAddress)).toHaveLength(1)
    expect(
      wrapper.find(ToteReturnExpressInfoCardAddress).prop('message')
    ).toBeFalsy()
    expect(wrapper.find(ToteReturndRemind)).toHaveLength(1)
  })

  const getShippingAddressWrapper = () => {
    nextCurrentCustomerStore = {
      localShippingAddresses: [
        {
          isSelected: true,
          address_1: '粤海街道',
          state: '广东省',
          telephone: '13300002222',
          full_name: '托特',
          city: '深圳市',
          district: '南山区'
        }
      ]
    }
    wrapper = shallow(
      <ToteScheduledAutoPickup.wrappedComponent
        currentCustomerStore={nextCurrentCustomerStore}
        navigation={nextNavigation}
        onCommitting={nextOnCommitting}
        updateToteReturnShippingAddress={nextUpdateToteReturnShippingAddress}
      />
    )

    return wrapper
  }

  const getNoShippingAddressWrapper = () => {
    wrapper = shallow(
      <ToteScheduledAutoPickup.wrappedComponent
        currentCustomerStore={nextCurrentCustomerStore}
        navigation={nextNavigation}
        onCommitting={nextOnCommitting}
        updateToteReturnShippingAddress={nextUpdateToteReturnShippingAddress}
      />
    )

    return wrapper
  }
})
