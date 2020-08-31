/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Text
} from 'react-native'
import Image from '../../../storybook/stories/image'
import {
  NavigationBar,
  SafeAreaView,
  BarButtonItem
} from '../../../storybook/stories/navigationbar'
import { ShippingAddressList } from '../../../storybook/stories/account'
import { inject, observer } from 'mobx-react'
import { shippingAddressFilter } from '../../../src/expand/tool/shipping_address_filter'

@inject('currentCustomerStore')
@observer
export default class ShippingAddressContainer extends Component {
  _goBack = () => {
    this.props.navigation.goBack()
  }
  _cityChange = () => {
    const { resetReturnTime } = this.props.navigation.state.params
    resetReturnTime && resetReturnTime()
  }
  _editAddress = addressIndex => {
    const { navigation } = this.props
    const { selectAddress } = navigation.state.params

    navigation.navigate('EditAndAddShippingAddress', {
      edit: true,
      addressIndex: addressIndex,
      cityChange: this._cityChange,
      updateCurrentAddress: selectAddress
    })
  }
  _addAddress = () => {
    const { onConfirmAdd } = this.props.navigation.state.params
    if (!this.props.currentCustomerStore.id) {
      this.props.currentCustomerStore.setLoginModalVisible(true)
    } else {
      this.props.navigation.navigate('EditAndAddShippingAddress', {
        edit: false,
        onConfirmAdd: onConfirmAdd
      })
    }
  }
  _selectAddress = (shippingAddress, addressIndex) => {
    const { currentCustomerStore, navigation } = this.props
    const { localShippingAddresses } = currentCustomerStore
    const isSelectedAddress = localShippingAddresses.find(function(address) {
      return address.isSelected === true
    })
    const { resetReturnTime, selectAddress } = navigation.state.params
    if (
      isSelectedAddress &&
      shippingAddress &&
      (shippingAddress.city !== isSelectedAddress.city ||
        shippingAddress.state !== isSelectedAddress.state)
    ) {
      resetReturnTime && resetReturnTime()
    }

    const newShippingAddress = {
      address_1: shippingAddress.address_1,
      address_2: shippingAddress.address_2,
      city: shippingAddress.city,
      state: shippingAddress.state,
      country: 'CN',
      district: shippingAddress.district,
      full_name: shippingAddress.full_name,
      zip_code: shippingAddress.zip_code,
      telephone: shippingAddress.telephone
    }
    currentCustomerStore.selectShippingAddress(newShippingAddress, addressIndex)
    this.props.navigation.goBack()
    selectAddress && selectAddress()
  }
  _shippingAddressItem = ({ item, index }) => {
    const { isSelectAddress } = this.props.navigation.state.params
    if (
      item.full_name &&
      item.telephone &&
      item.state &&
      item.city &&
      item.address_1 &&
      item.district &&
      item.zip_code
    ) {
      return (
        <ShippingAddressList
          addressIndex={index}
          editAddress={this._editAddress}
          shippingAddress={item}
          isSelected={item.isSelected}
          selectAddress={this._selectAddress}
          isSelectAddress={isSelectAddress}
        />
      )
    }
  }

  _extractUniqueKey(item, index) {
    return index.toString()
  }

  render() {
    const { currentCustomerStore } = this.props
    const { localShippingAddresses } = currentCustomerStore
    const { validAddressIndex } = shippingAddressFilter(localShippingAddresses)
    const hasAddress = validAddressIndex !== -1
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          style={styles.navigationBar}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.container}>
          <Text style={styles.titleText}>我的地址</Text>
          {!!hasAddress ? (
            <View style={styles.listView}>
              <FlatList
                data={localShippingAddresses}
                horizontal={false}
                keyExtractor={this._extractUniqueKey}
                renderItem={this._shippingAddressItem}
              />
            </View>
          ) : (
            <View style={styles.noAddressView}>
              <Image
                source={require('../../../assets/images/account/car.png')}
              />
              <Text style={styles.noAddressText}>暂无地址</Text>
            </View>
          )}
        </ScrollView>
        <TouchableOpacity
          style={styles.addAddressButton}
          onPress={this._addAddress}>
          <Image source={require('../../../assets/images/account/add.png')} />
          <Text style={styles.ButtonText}>新增地址</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navigationBar: {
    borderBottomWidth: 0
  },

  titleText: {
    marginTop: 29,
    marginLeft: 20,
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 95,
    color: '#333'
  },
  listView: {
    marginBottom: 55
  },
  addAddressButton: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EA5C39',
    zIndex: 1
  },
  ButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#FFFFFF'
  },
  noAddressView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 95,
    paddingTop: 63
  },
  noAddressText: {
    fontSize: 14,
    color: '#D1D1D1',
    marginTop: 27
  }
})
