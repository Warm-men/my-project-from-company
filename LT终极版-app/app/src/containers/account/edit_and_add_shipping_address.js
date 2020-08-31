/* @flow */

import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Picker from 'react-native-letote-picker'
import { SafeAreaView } from '../../../storybook/stories/navigationbar'
import {
  EditShippingAddress,
  AddShippingAddress
} from '../../../storybook/stories/account'
import { inject, observer } from 'mobx-react'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'

@inject('currentCustomerStore', 'modalStore')
@observer
export default class EditAndAddShippingAddress extends Component {
  constructor(props) {
    super(props)
    this.areaArray = require('../../../src/expand/tool/city/district.json')
    this.zipCodeData = require('../../../src/expand/tool/city/zip_code_data.json')

    const { edit, addressIndex } = this.props.navigation.state.params
    const { currentCustomerStore } = this.props
    const { localShippingAddresses, shippingAddress } = currentCustomerStore

    if (shippingAddress) {
      if (
        shippingAddress.full_name &&
        shippingAddress.state &&
        shippingAddress.city &&
        shippingAddress.district &&
        shippingAddress.telephone &&
        shippingAddress.address_1 &&
        shippingAddress.zip_code
      ) {
        this.state = {
          selectedValue: [],
          shippingAddressFullName: '',
          shippingAddressTelephone: '',
          shippingAddressAddress: ''
        }
      } else {
        this.state = {
          selectedValue:
            shippingAddress.state &&
            shippingAddress.city &&
            shippingAddress.district
              ? [
                  shippingAddress.state,
                  shippingAddress.city,
                  shippingAddress.district
                ]
              : [],
          shippingAddressFullName: shippingAddress.full_name,
          shippingAddressTelephone: shippingAddress.telephone,
          shippingAddressAddress: shippingAddress.address_1
        }
      }
    }

    this.state = {
      selectedValue: [],
      shippingAddressFullName: '',
      shippingAddressTelephone: '',
      shippingAddressAddress: ''
    }

    if (edit) {
      this.state = {
        selectedValue: [
          localShippingAddresses[addressIndex].state,
          localShippingAddresses[addressIndex].city,
          localShippingAddresses[addressIndex].district
        ],
        shippingAddressFullName: localShippingAddresses[addressIndex].full_name,
        shippingAddressTelephone:
          localShippingAddresses[addressIndex].telephone,
        shippingAddressAddress: localShippingAddresses[addressIndex].address_1
      }
    }
  }
  componentDidMount() {
    this.subscription = this.props.navigation.addListener('willBlur', () => {
      Picker.hide()
    })
  }
  componentWillUnmount() {
    this.subscription.remove()
  }
  _goBack = () => {
    this.props.navigation.goBack()
  }
  _showPicker = () => {
    Picker.init({
      pickerData: this.areaArray,
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: '选择地区',
      selectedValue: this.state.selectedValue,
      onPickerConfirm: areaData => {
        this.setState({
          selectedValue: areaData
        })
      }
    })
    Picker.show()
  }
  _hidePicker = () => {
    Picker.hide()
  }
  _editFullName = value => {
    this.setState({
      shippingAddressFullName: value
    })
  }
  _editTelephone = value => {
    this.setState({
      shippingAddressTelephone: value
    })
  }
  _editAddress = value => {
    this.setState({
      shippingAddressAddress: value
    })
  }
  _alert = () => {
    this.props.modalStore.show(
      <CustomAlertView
        message={'确认删除地址吗？'}
        cancel={{ title: '取消', type: 'normal' }}
        other={[
          {
            title: '删除',
            type: 'highLight',
            onClick: this._deleteAddress
          }
        ]}
      />
    )
  }
  _deleteAddress = () => {
    const { currentCustomerStore, navigation } = this.props
    const { addressIndex } = navigation.state.params
    currentCustomerStore.deleteShippingAddress(addressIndex)
    navigation.goBack()
  }
  _confirmChange = () => {
    const { currentCustomerStore, navigation } = this.props
    const {
      selectedValue,
      shippingAddressAddress,
      shippingAddressTelephone,
      shippingAddressFullName
    } = this.state
    const { localShippingAddresses } = currentCustomerStore
    const { addressIndex, cityChange } = navigation.state.params
    const stateCityDistrict = selectedValue.join('')
    let zipCode = localShippingAddresses[addressIndex].zip_code
    if (selectedValue[0] && selectedValue[1]) {
      zipCode = this.zipCodeData[stateCityDistrict] || zipCode
    }
    const currentShippingAddress = localShippingAddresses[addressIndex]

    //城市信息有修改
    const isCityChange =
      selectedValue[1] !== currentShippingAddress.city ||
      selectedValue[0] !== currentShippingAddress.state

    //用户信息有修改
    const isUserInfoChange =
      shippingAddressAddress.address_1 !== currentShippingAddress.address_1 ||
      shippingAddressTelephone !== currentShippingAddress.telephone ||
      shippingAddressFullName !== currentShippingAddress.full_name

    if (isCityChange || isUserInfoChange) {
      if (isCityChange && currentShippingAddress.isSelected) {
        cityChange && cityChange()
      }
      const { updateCurrentAddress } = this.props.navigation.state.params
      updateCurrentAddress && updateCurrentAddress()
    }

    let editShippingAddress = {
      ...localShippingAddresses[addressIndex],
      address_1: shippingAddressAddress,
      address_2: shippingAddressAddress,
      state: selectedValue[0],
      city: selectedValue[1],
      district: selectedValue[2],
      telephone: shippingAddressTelephone,
      full_name: shippingAddressFullName,
      zip_code: zipCode
    }
    currentCustomerStore.editShippingAddress(editShippingAddress, addressIndex)
    navigation.goBack()
  }

  _confirmAdd = () => {
    const { currentCustomerStore, navigation } = this.props
    const {
      localShippingAddresses,
      addToLocalShippingAddresses
    } = currentCustomerStore
    const {
      selectedValue,
      shippingAddressAddress,
      shippingAddressTelephone,
      shippingAddressFullName
    } = this.state
    const stateCityDistrict = selectedValue.join('')
    let zipCode = this.zipCodeData[stateCityDistrict]
    const { onConfirmAdd } = navigation.state.params
    let shippingAddress = {
      address_1: shippingAddressAddress,
      address_2: shippingAddressAddress,
      state: selectedValue[0],
      city: selectedValue[1],
      district: selectedValue[2],
      telephone: shippingAddressTelephone,
      full_name: shippingAddressFullName,
      zip_code: zipCode,
      isSelected:
        onConfirmAdd ||
        (localShippingAddresses.length && !localShippingAddresses.address_1) ||
        !localShippingAddresses.length
          ? true
          : false
    }
    navigation.goBack()
    addToLocalShippingAddresses(shippingAddress)
    onConfirmAdd && onConfirmAdd()
  }
  render() {
    const { edit } = this.props.navigation.state.params
    const { addressIndex } = this.props.navigation.state.params
    const { localShippingAddresses } = this.props.currentCustomerStore
    const shippingAddress = localShippingAddresses[addressIndex]
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={this._hidePicker}
          style={styles.container}
          activeOpacity={1}>
          {edit ? (
            <EditShippingAddress
              goBack={this._goBack}
              deleteAddress={this._alert}
              confirmButton={this._confirmChange}
              showPicker={this._showPicker}
              selectedValue={this.state.selectedValue}
              shippingAddress={shippingAddress}
              editFullName={this._editFullName}
              editTelephone={this._editTelephone}
              editAddress={this._editAddress}
              onFocus={this._hidePicker}
              shippingAddressFullName={this.state.shippingAddressFullName}
              shippingAddressTelephone={this.state.shippingAddressTelephone}
              shippingAddressAddress={this.state.shippingAddressAddress}
            />
          ) : (
            <AddShippingAddress
              goBack={this._goBack}
              confirmButton={this._confirmAdd}
              showPicker={this._showPicker}
              selectedValue={this.state.selectedValue}
              editFullName={this._editFullName}
              editTelephone={this._editTelephone}
              editAddress={this._editAddress}
              onFocus={this._hidePicker}
              shippingAddressFullName={this.state.shippingAddressFullName}
              shippingAddressTelephone={this.state.shippingAddressTelephone}
              shippingAddressAddress={this.state.shippingAddressAddress}
            />
          )}
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
