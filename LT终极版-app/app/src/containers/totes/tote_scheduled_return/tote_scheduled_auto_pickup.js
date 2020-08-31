/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import {
  ToteReturnExpressInfoCardBooking,
  ToteReturnExpressInfoCardAddress
} from '../../../../storybook/stories/totes/tote_return/tote_return_express_info_card'
import { shippingAddressFilter } from '../../../expand/tool/shipping_address_filter'
import { inject, observer } from 'mobx-react'
import Statistics from '../../../expand/tool/statistics'
import ToteReturndRemind from '../../../../storybook/stories/totes/tote_return/tote_return_remind'
import BookingPicker from './bookingPicker'
@inject('currentCustomerStore')
@observer
export default class ToteScheduledAutoPickup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scheduledPickupsType: 'scheduled_auto_pickup',
      bookingsDetails: null,
      addressIndex: 0
    }
    this.defaultZipCode = '518001'
  }

  componentDidMount() {
    this._updateAddressIndex()
  }

  // 上报填写预约地址
  shouldComponentUpdate(nextProps) {
    const { localShippingAddresses } = this.props.currentCustomerStore
    if (
      !localShippingAddresses[this.state.addressIndex] ||
      (localShippingAddresses[this.state.addressIndex] &&
        !localShippingAddresses[this.state.addressIndex].address_1 &&
        nextProps.currentCustomerStore.localShippingAddresses &&
        nextProps.currentCustomerStore.localShippingAddresses[
          this.state.addressIndex
        ].address_1)
    ) {
      Statistics.onEvent({
        id: 'fill_in_returnTote_address',
        label: '填写预约地址'
      })
    }
    return true
  }

  _updateAddressIndex = () => {
    const { localShippingAddresses } = this.props.currentCustomerStore
    if (!localShippingAddresses || !localShippingAddresses.length) {
      return
    }
    const { isSelectedAddressIndex, validAddressIndex } = shippingAddressFilter(
      localShippingAddresses
    )
    const index =
      (isSelectedAddressIndex !== -1 && isSelectedAddressIndex) ||
      (validAddressIndex !== -1 && validAddressIndex) ||
      0
    this.setState({ addressIndex: index }, () => {
      const { updateToteReturnShippingAddress } = this.props
      const nowShippingAddress = localShippingAddresses[index]
      updateToteReturnShippingAddress(nowShippingAddress)
      if (
        localShippingAddresses[index] &&
        localShippingAddresses[index].address_1
      ) {
        Statistics.onEvent({
          id: 'fill_in_returnTote_address',
          label: '填写预约地址'
        })
      }
    })
  }

  _didSelectedItem = type => {
    const { updateScheduledPickupsType } = this.props
    this.setState(
      {
        scheduledPickupsType: type
      },
      () => {
        updateScheduledPickupsType(type)
      }
    )
  }

  _openBookingPicker = () => this._bookingPicker._booking()

  //修改地址
  _editAddress = () => {
    this.props.navigation.navigate('EditAndAddShippingAddress', {
      edit: true,
      addressIndex: this.state.addressIndex,
      cityChange: this._resetReturnTime,
      updateCurrentAddress: this._updateAddressIndex
    })
  }
  //添加地址
  _addAddress = () => {
    this.props.navigation.navigate('EditAndAddShippingAddress', {
      edit: false,
      onConfirmAdd: this._updateAddressIndex
    })
  }
  //选择地址
  _selectAddress = () => {
    this.props.navigation.navigate('ShippingAddress', {
      isSelectAddress: true,
      resetReturnTime: this._resetReturnTime,
      selectAddress: this._updateAddressIndex,
      onConfirmAdd: this._updateAddressIndex
    })
  }
  //重置预约归还时间
  _resetReturnTime = () => {
    this._bookingPicker._resetReturnTime()
    this.setState({ bookingsDetails: null })
  }

  _updateBookingDetails = bookingsDetails => this.setState({ bookingsDetails })

  render() {
    const {
      isOnlyReturnToteFreeService,
      currentCustomerStore,
      updateReturnTime
    } = this.props
    const { bookingsDetails, addressIndex } = this.state
    const { localShippingAddresses } = currentCustomerStore
    const shippingAddress =
      localShippingAddresses && localShippingAddresses[addressIndex]
    return (
      <View style={styles.container}>
        <ToteReturnExpressInfoCardBooking
          title={'取件时间'}
          description={'选择取件时间'}
          hasBottomLine={true}
          message={bookingsDetails}
          onPress={this._openBookingPicker}
        />
        <BookingPicker
          ref={bookingPicker => (this._bookingPicker = bookingPicker)}
          navigation={this.props.navigation}
          updateReturnTime={updateReturnTime}
          updateBookingDetails={this._updateBookingDetails}
          shippingAddress={shippingAddress}
        />
        <ToteReturnExpressInfoCardAddress
          title={'取件地址'}
          description={'选择取件地址'}
          hasBottomLine={false}
          message={shippingAddress}
          onPress={this._selectAddress}
        />
        <ToteReturndRemind
          type={'autoPickup'}
          isOnlyReturnToteFreeService={isOnlyReturnToteFreeService}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
