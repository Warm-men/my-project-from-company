import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
  Text
} from 'react-native'
import { inject, observer } from 'mobx-react'
import Picker from 'react-native-letote-picker'
import { SafeAreaView } from '../../../../storybook/stories/navigationbar'
import Location from '../../../expand/tool/location'
import Icon from 'react-native-vector-icons/Entypo'
import { Mutate, SERVICE_TYPES } from '../../../expand/services/services'
import p2d from '../../../expand/tool/p2d'
import RNLetoteIntent from 'react-native-letote-intent'
import ImageView from '../../../../storybook/stories/image'
import BottomButton from './me_style_bottom_button'
import MeStyleCommonTitle from '../../../../storybook/stories/account/me_style_common_title'
import { CustomAlertView } from '../../../../storybook/stories/alert/custom_alert_view'

@inject('currentCustomerStore', 'modalStore')
@observer
export default class MeStyleCity extends Component {
  // 通过 state 更新
  constructor(props) {
    super(props)
    if (this.props.currentCustomerStore.shippingAddress !== null) {
      const { city, state } = this.props.currentCustomerStore.shippingAddress
      this.state = {
        selectedValue:
          city === null || state == null ? ['广东省', '深圳市'] : [city, state],
        isDone: city === null || state == null ? false : true,
        value: city === null || state == null ? '请选择' : [city, state]
      }
    } else {
      this.state = {
        selectedValue: ['广东省', '深圳市'],
        isDone: false,
        value: '请选择'
      }
    }
    const { localShippingAddresses } = this.props.currentCustomerStore
    this.addressIndex = localShippingAddresses.findIndex(function(item) {
      return item.id !== null
    })
    this.errorCode
    this.city = []
    this.areaArray = require('../../../expand/tool/city/citys-min.json')
    this.areasArray = require('../../../expand/tool/city/district.json')
    this.zipArray = require('../../../expand/tool/city/zip_code_data.json')
    this.zip_code = ''
    this.area
    this.defaultZipCode = '518001'
  }

  GET(url, variables, success, failure) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-REQUESTED_WITH': 'XMLHttpRequest'
    }

    let requsetUrl = url
    for (var key in variables) {
      requsetUrl = requsetUrl + key + '=' + variables[key] + '&'
    }

    fetch(requsetUrl, {
      headers,
      method: 'GET'
    })
      .then(response => {
        if (response.status === 200) {
          response.json().then(jsonData => {
            success(jsonData)
          })
        } else {
          failure(response)
        }
      })
      .catch(error => {
        failure(error)
      })
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
          isDone: true,
          value: areaData,
          selectedValue: areaData
        })
      }
    })
    Picker.show()
  }

  //FIXME
  location = () => {
    Location.getLocation(
      location => {
        let url =
          `https://api.map.baidu.com/geocoder/v2/?output=json&ak=qNXcVLrEWCL9VM37CX2sdBoqGodRNmMd&location=` +
          location.coords.latitude +
          `,` +
          location.coords.longitude
        this.GET(url, {}, response => {
          const data = response.result.addressComponent
          let value = [data.province, data.city]
          this.setState({
            value,
            isDone: true
          })
        })
      },
      error => {
        this.errorCode = error.code
        if (error.code === 2) {
          this._alert('请开启GPS以便我们提供更优质的服务')
        } else {
          this._alert('无权限定位，请开启"定位服务"以便我们提供更优质的服务')
        }
      }
    )
  }

  _alert = textValue => {
    const { modalStore } = this.props
    modalStore.show(
      <CustomAlertView
        message={textValue}
        cancel={{
          title: '取消',
          type: 'normal'
        }}
        other={[
          {
            title: '设置',
            type: 'highLight',
            onClick: this.gotoPermissionSetting
          }
        ]}
      />
    )
  }

  gotoPermissionSetting = () => {
    if (this.errorCode === 2 && Platform.OS === 'android') {
      RNLetoteIntent.openActivity('android.settings.LOCATION_SOURCE_SETTINGS')
    } else {
      RNLetoteIntent.gotoPermissionSetting()
    }
  }

  updateShipping = shipping => {
    if (!this.isFinishedUpdate) {
      const { currentCustomerStore } = this.props
      this.isFinishedUpdate = true
      Mutate(
        SERVICE_TYPES.me.MUTATION_UPDATE_SHIPPING_ADDRESS,
        {
          shipping
        },
        response => {
          const customerShippingAddress =
            response.data.UpdateShippingAddress.shipping_address
          if (customerShippingAddress) {
            currentCustomerStore.updateShippingAddress(
              customerShippingAddress,
              this.addressIndex
            )
          }
          this.props.next()
          this.isFinishedUpdate = false
        },
        () => {
          this.isFinishedUpdate = false
        }
      )
    }
  }

  _next = () => {
    if (this.state.isDone) {
      const { value } = this.state
      this.areasArray.map(item => {
        if (item[value[0]]) {
          item[value[0]].map(i => {
            if (i[value[1]]) {
              this.area = i[value[1]][0]
            }
          })
        }
      })
      // FIXME: 未知处理
      const zipCode = this.zipArray[value[0] + value[1] + this.area]
      this.zip_code = zipCode ? zipCode : this.defaultZipCode
      let shipping
      if (this.props.currentCustomerStore.shippingAddress !== null) {
        const {
          address_1,
          address_2,
          telephone,
          city,
          state
        } = this.props.currentCustomerStore.shippingAddress
        if (this.state.value[0] === city && this.state.value[1] == state) {
          this.props.next()
        } else {
          shipping = {
            address_1: address_1 || '',
            address_2: address_2 || '',
            city: this.state.value[1],
            state: this.state.value[0],
            zip_code: this.zip_code,
            telephone: telephone || '',
            country: 'CN'
          }
          this.updateShipping(shipping)
        }
      } else {
        shipping = {
          address_1: '',
          address_2: '',
          city: this.state.value[1],
          state: this.state.value[0],
          zip_code: this.zip_code,
          telephone: '',
          country: 'CN'
        }
        this.updateShipping(shipping)
      }
    }
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView
          style={styles.container}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}>
          <MeStyleCommonTitle
            titleText={'舒适'}
            descriptText={'根据未来7天的气温为你准备衣箱'}
            step={'2/6'}
            showStep={true}
          />
          <View style={styles.contentView}>
            <Text style={styles.cityText}>{'所在城市'}</Text>
            <View style={styles.lineView} />
            <TouchableOpacity
              style={styles.touchPicker}
              onPress={this._showPicker}>
              <Text style={styles.blackText}>{this.state.value}</Text>
              <Icon name={'select-arrows'} size={20} color={'#333333'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.locationView}
              onPress={this.location}>
              <ImageView
                source={require('../../../../assets/images/me_style/location.png')}
                style={styles.cityImage}
              />
              <Text style={styles.locationText}>{'定位城市'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <BottomButton
          goback={this.props.goback}
          next={this._next}
          isDone={this.state.isDone}
          nextText={'下一步'}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
    width: Dimensions.get('window').width,
    paddingHorizontal: 40
  },
  cityText: {
    color: '#333333',
    fontSize: 18,
    fontWeight: '600'
  },
  blackText: {
    color: '#333333',
    fontSize: 12
  },
  contentView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 178,
    marginBottom: 100
  },
  lineView: {
    backgroundColor: '#333333',
    height: 1,
    width: 56,
    marginTop: 11,
    marginBottom: 14
  },
  touchPicker: {
    height: 41,
    width: '100%',
    backgroundColor: '#F5F5F2',
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingLeft: 27,
    paddingRight: 16,
    justifyContent: 'space-between'
  },
  locationView: {
    flexDirection: 'row',
    marginTop: 24,
    flex: 2,
    alignItems: 'center'
  },
  locationImage: {
    width: p2d(17),
    height: p2d(16)
  },
  locationText: {
    fontSize: 14,
    letterSpacing: 0,
    color: '#0076FF',
    marginLeft: 4
  },
  buttonView: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  nextText: {
    fontSize: 14,
    color: '#FFFFFF'
  }
})
