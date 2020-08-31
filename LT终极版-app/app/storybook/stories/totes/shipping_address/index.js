import React, { PureComponent } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import Image from '../../image'
import Icons from 'react-native-vector-icons/Ionicons'
import AddressLine from '../../../../assets/images/totes/address_line.png'
import WarningTips from '../../../../assets/images/totes/warning_tips.png'
export default class ShippingAddress extends PureComponent {
  render() {
    const {
      hasAddress,
      shippingAddress,
      isValidCustomerName,
      selectAddress
    } = this.props
    return (
      <View>
        {!!hasAddress ? (
          <HasAddress
            shippingAddress={shippingAddress}
            isValidCustomerName={isValidCustomerName}
            selectAddress={selectAddress}
          />
        ) : (
          <NonAddress selectAddress={selectAddress} />
        )}
        <Image source={AddressLine} style={styles.line} />
      </View>
    )
  }
}

class HasAddress extends PureComponent {
  render() {
    const { shippingAddress, isValidCustomerName, selectAddress } = this.props
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={selectAddress} style={styles.addressView}>
          <View style={styles.flexDirectionRow}>
            <View style={styles.addressContent}>
              <View style={styles.flexDirectionRow}>
                <Text numberOfLines={1} style={styles.fullName}>
                  {shippingAddress.full_name} {shippingAddress.telephone}
                </Text>
              </View>
              <View style={styles.districtView}>
                <Text style={styles.addressDistrict}>
                  {shippingAddress.state}
                  {shippingAddress.city}
                  {shippingAddress.district}
                  {shippingAddress.address_1}
                </Text>
              </View>
            </View>
            <Icons
              name={'ios-arrow-forward'}
              size={15}
              style={styles.arrowRight}
              color={'#333'}
            />
          </View>
        </TouchableOpacity>
        {!isValidCustomerName && (
          <View style={styles.badNameView}>
            <Image source={WarningTips} style={styles.warningTips} />
            <Text style={styles.badNameText}>
              {'根据国家主管部门要求实行实名收寄，请填写真实姓名'}
            </Text>
          </View>
        )}
      </View>
    )
  }
}

class NonAddress extends PureComponent {
  render() {
    const { selectAddress } = this.props
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.nullAddress}
        onPress={selectAddress}>
        <Text style={{ fontSize: 15, color: '#333' }}>收件地址</Text>
        <View style={styles.flexDirectionRow}>
          <Text style={{ fontSize: 14, color: '#ccc' }}>选择收件地址</Text>
          <Icons
            name={'ios-arrow-forward'}
            size={15}
            style={styles.nonAddressArrowRight}
            color={'#333'}
          />
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 24,
    marginTop: 28
  },
  flexDirectionRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  nullAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 67,
    paddingHorizontal: 16,
    justifyContent: 'space-between'
  },
  addressView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1
  },
  addressContent: {
    flex: 1
  },
  fullName: {
    fontWeight: '600',
    fontSize: 15,
    color: '#333'
  },
  districtView: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center'
  },
  addressDistrict: {
    fontWeight: '400',
    fontSize: 13,
    color: '#999',
    flex: 1
  },
  arrowRight: {
    marginLeft: 30,
    marginRight: 4
  },
  nonAddressArrowRight: {
    marginLeft: 12,
    marginTop: 2
  },
  line: {
    width: '100%',
    marginBottom: 5,
    borderBottomWidth: 7,
    borderColor: '#F7F7F7'
  },
  badNameView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  badNameText: {
    color: '#E85C40',
    fontSize: 12
  },
  warningTips: {
    width: 16,
    height: 16,
    marginRight: 8
  }
})
