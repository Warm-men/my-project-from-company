/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../../storybook/stories/image'
export default class ShippingAddressList extends PureComponent {
  _editAddress = () => {
    const { editAddress, addressIndex } = this.props
    editAddress && editAddress(addressIndex)
  }
  _selectAddress = () => {
    const { selectAddress, shippingAddress, addressIndex } = this.props
    selectAddress && selectAddress(shippingAddress, addressIndex)
  }
  render() {
    const { shippingAddress, isSelected, isSelectAddress } = this.props
    const handleSelect = isSelectAddress ? this._selectAddress : null
    return (
      <TouchableOpacity
        onPress={handleSelect}
        activeOpacity={0.85}
        style={styles.addressItemView}>
        {isSelectAddress && (
          <View style={styles.addressItemViewLeft}>
            {isSelected ? (
              <Image
                source={require('../../../assets/images/account/select.png')}
              />
            ) : (
              <Image
                source={require('../../../assets/images/account/unselect.png')}
              />
            )}
          </View>
        )}
        <View style={styles.addressItemViewRight}>
          <View style={styles.nameAndPhoneNumberView}>
            <View style={styles.nameAndPhoneNumber}>
              <Text numberOfLines={1} style={styles.nameText}>
                {shippingAddress.full_name}
              </Text>
              <Text style={styles.phoneNumberText}>
                {shippingAddress.telephone}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editAddressButton}
              onPress={this._editAddress}>
              <Text style={styles.editText}>编辑</Text>
              <Image
                source={require('../../../assets/images/account/arrow_right.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.stateAndcityView}>
            <Text style={styles.stateText}>{shippingAddress.state}</Text>
            <Text style={styles.stateText}>{shippingAddress.city}</Text>
            <Text style={styles.stateText}>{shippingAddress.district}</Text>
          </View>
          <Text style={styles.detailAddress}>{shippingAddress.address_1}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  addressItemView: {
    marginHorizontal: 20,
    paddingVertical: 22,
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1,
    flexDirection: 'row'
  },
  addressItemViewLeft: {
    marginRight: 18,
    justifyContent: 'center'
  },
  addressItemViewRight: {
    flex: 1
  },
  nameAndPhoneNumberView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  nameAndPhoneNumber: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  editAddressButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  editText: {
    fontSize: 14,
    color: '#D7D7D7',
    marginRight: 10
  },
  nameText: {
    fontSize: 16,
    color: '#333333',
    marginRight: 20,
    maxWidth: 100
  },
  phoneNumberText: {
    fontSize: 14,
    color: '#999999'
  },
  stateAndcityView: {
    flexDirection: 'row',
    marginBottom: 12
  },
  stateText: {
    fontSize: 13,
    color: '#333333',
    marginRight: 5
  },
  detailAddress: {
    color: '#333333',
    fontSize: 13,
    lineHeight: 20
  }
})
