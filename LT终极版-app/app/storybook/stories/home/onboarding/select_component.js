import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Picker from 'react-native-letote-picker'
import Image from '../../image'
import { CustomAlertView } from '../../alert/custom_alert_view'
import RNLetoteIntent from 'react-native-letote-intent'
import Location from '../../../../src/expand/tool/location'
export default class SelectComponent extends PureComponent {
  // 通过 state 更新
  static defaultProps = {
    pickerConfirmBtnText: '确认',
    pickerCancelBtnText: '取消',
    pickerTitleText: '请选择XX',
    pickerData: []
  }
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value ? this.props.value : '',
      selectedValue: this.props.selectedValue
    }
  }
  componentWillUnmount() {
    Picker.hide()
  }
  showPicker = () => {
    const {
      pickerData,
      pickerConfirmBtnText,
      pickerCancelBtnText,
      pickerTitleText
    } = this.props
    Picker.init({
      pickerData,
      pickerConfirmBtnText,
      pickerCancelBtnText,
      pickerTitleText,
      selectedValue: this.state.selectedValue,
      onPickerConfirm: data => {
        const { dataType } = this.props
        let displayDate = data.join('')
        this.setState(
          {
            value: displayDate,
            selectedValue: data
          },
          () => {
            this.props.onPress(dataType ? { dataType, data } : { data })
          }
        )
      }
    })
    Picker.show()
  }
  _onChangeText = data => {
    this.setState({ value: data })
    const { dataType } = this.props
    this.props.onPress(dataType ? { dataType, data } : { data })
  }
  _onPress = () => {
    const { dataType, onPress } = this.props
    onPress && onPress(dataType)
  }

  location = () => {
    Location.getLocation(
      location => {
        let url =
          `https://api.map.baidu.com/geocoder/v2/?output=json&ak=qNXcVLrEWCL9VM37CX2sdBoqGodRNmMd&location=` +
          location.coords.latitude +
          `,` +
          location.coords.longitude
        this.GET(url, {}, response => {
          const result = response.result.addressComponent
          let data = [result.province, result.city]
          const { dataType } = this.props
          this.setState(
            {
              value: data,
              selectedValue: data
            },
            () => {
              this.props.onPress(dataType ? { dataType, data } : { value })
            }
          )
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

  render() {
    const { input, dataType, style } = this.props
    return (
      <View style={[dataType !== 'birthday' && styles.container]}>
        <TouchableOpacity
          style={[dataType !== 'birthday' && styles.touchPicker]}
          onPress={this.showPicker}>
          <View style={[dataType !== 'birthday' && styles.mainView]}>
            <Text
              style={[
                styles.text,
                !this.state.value.length && { color: '#999' },
                style
              ]}>
              {this.state.value.length ? this.state.value : input.placeholder}
            </Text>
            {dataType !== 'birthday' && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[
                    { fontSize: 13, color: '#ccc' },
                    dataType === 'city' && { color: '#333' }
                  ]}>
                  <Text style={{ color: '#999' }}>{input.tips}</Text>
                </Text>
                {dataType === 'city' && (
                  <TouchableOpacity
                    onPress={this.location}
                    hitSlop={{ top: 20, left: 100, right: 10, bottom: 20 }}>
                    <Image
                      style={{ marginLeft: 11 }}
                      source={require('../../../../assets/images/home/location.png')}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 39
  },
  shortContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 39
  },
  titleText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500'
  },
  shortTitleText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500'
  },
  text: {
    color: '#333333',
    fontSize: 12
  },
  textShort: {
    color: '#333333',
    fontSize: 12,
    flex: 1,
    textAlign: 'center'
  },
  textInput: {
    flex: 1
  },
  touchPicker: {
    height: 41,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
    justifyContent: 'space-between'
  },
  shortTouchPicker: {
    height: 41,
    width: '70%',
    backgroundColor: '#F5F5F2',
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 27,
    paddingRight: 16,
    justifyContent: 'space-between'
  },
  chevronIcon: {
    marginTop: 2
  },
  mainView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})
