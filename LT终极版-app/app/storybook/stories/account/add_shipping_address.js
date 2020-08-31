/* @flow */

import React, { PureComponent } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text
} from 'react-native'
import {
  NavigationBar,
  SafeAreaView,
  BarButtonItem
} from '../../../storybook/stories/navigationbar'
import { ShippingAddressInfoItem } from './index.js'
import { inject } from 'mobx-react'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'
import { isValidCustomerName } from '../../../src/expand/tool/userInfo_inspect'

@inject('modalStore')
export default class AddShippingAddress extends PureComponent {
  _editFullName = value => {
    const { editFullName } = this.props
    editFullName(value)
    this.fullName = value
  }
  _editTelephone = value => {
    const { editTelephone } = this.props
    editTelephone(value)
    this.telephone = value
  }
  _editAddress = value => {
    const { editAddress } = this.props
    editAddress(value)
    this.address = value
  }

  _alert = textValue => {
    const { modalStore } = this.props
    modalStore.show(
      <CustomAlertView
        message={textValue}
        cancel={{
          title: '确定'
        }}
      />
    )
  }

  _confirmButton = () => {
    const {
      confirmButton,
      selectedValue,
      shippingAddressFullName,
      shippingAddressTelephone,
      shippingAddressAddress
    } = this.props
    const reg = new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/)
    const _isValidCustomerName = isValidCustomerName(shippingAddressFullName)
    if (!shippingAddressFullName) {
      this._alert('请填写您的姓名')
      return
    } else if (!_isValidCustomerName) {
      this._alert('根据国家主管部门要求实行实名收寄，请填写真实姓名')
      return
    } else if (!shippingAddressTelephone) {
      this._alert('请填写您的电话号码')
      return
    } else if (!reg.test(shippingAddressTelephone)) {
      this._alert('电话号码不正确')
      return
    } else if (!selectedValue[0]) {
      this._alert('请填写您的城市')
      return
    } else if (!shippingAddressAddress) {
      this._alert('请填写您的详细地址')
      return
    }
    confirmButton()
  }

  render() {
    const {
      goBack,
      showPicker,
      selectedValue,
      onFocus,
      shippingAddressFullName,
      shippingAddressTelephone,
      shippingAddressAddress
    } = this.props

    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          leftBarButtonItem={
            <BarButtonItem onPress={goBack} buttonType={'back'} />
          }
        />
        <KeyboardAvoidingView
          style={styles.flex}
          keyboardVerticalOffset={20}
          behavior={Platform.select({ ios: 'padding' })}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <Text style={styles.titleText}>新增地址</Text>

            <ShippingAddressInfoItem
              categoryTitle={'收货人'}
              textContent={shippingAddressFullName}
              getInputValue={this._editFullName}
              onFocus={onFocus}
              placeholder={'请填写真实姓名'}
            />
            <ShippingAddressInfoItem
              categoryTitle={'手机号码'}
              textContent={shippingAddressTelephone}
              getInputValue={this._editTelephone}
              keyboardType={'phone-pad'}
              onFocus={onFocus}
            />
            <ShippingAddressInfoItem
              categoryTitle={'所在地区'}
              isAreaPicker={true}
              selectedValue={selectedValue}
              showPicker={showPicker}
            />
            <ShippingAddressInfoItem
              categoryTitle={'详细地址'}
              textContent={shippingAddressAddress}
              getInputValue={this._editAddress}
              onFocus={onFocus}
            />
          </ScrollView>
        </KeyboardAvoidingView>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={this._confirmButton}>
          <Text style={styles.ButtonText}>确认添加</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  flex: {
    flex: 1
  },
  titleText: {
    marginTop: 30,
    marginLeft: 20,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 95,
    color: '#333'
  },
  confirmButton: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EA5C39'
  },
  ButtonText: {
    fontSize: 14,
    color: '#FFFFFF'
  }
})
