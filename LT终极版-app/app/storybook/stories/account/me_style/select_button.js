import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Platform
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Picker from 'react-native-letote-picker'
import Location from '../../../../src/expand/tool/location'
import { inject } from 'mobx-react'
import RNLetoteIntent from 'react-native-letote-intent'
import { CustomAlertView } from '../../alert/custom_alert_view'

@inject('modalStore')
export default class SelectButton extends PureComponent {
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
    this.errorCode
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
        this._update(data)
      }
    })
    Picker.show()
  }
  _update = data => {
    const { dataType, onPress } = this.props
    let displayDate = data.join('')
    if (dataType === 'birthday') {
      displayDate = displayDate
        .replace('年', '-')
        .replace('月', '-')
        .replace('日', '')
    }
    this.setState(
      {
        value: displayDate,
        selectedValue: data
      },
      () => {
        onPress && onPress(dataType ? { dataType, data } : { data })
      }
    )
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
  _onFocus = () => {
    Picker.hide()
  }

  autoGetLocation = () => {
    const { dataType, onPress } = this.props
    Location.getLocation(
      location => {
        let url =
          `https://api.map.baidu.com/geocoder/v2/?output=json&ak=qNXcVLrEWCL9VM37CX2sdBoqGodRNmMd&location=` +
          location.coords.latitude +
          `,` +
          location.coords.longitude
        Location.fetchLocation(url, {}, response => {
          const data = response.result.addressComponent
          let value = [data.province, data.city]
          this.setState({
            value,
            selectedValue: value
          })
          onPress &&
            onPress(dataType ? { dataType, data: value } : { data: value })
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
  render() {
    const { showPicker, title, dataType, placeholder } = this.props
    const { value } = this.state
    const showText = dataType === 'weight' || dataType === 'heightInches'
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>{title}</Text>
        {showPicker ? (
          <TouchableOpacity
            style={styles.touchPicker}
            onPress={this.showPicker}>
            <View style={styles.showPickContainer}>
              <Text
                style={[styles.text, !value.length && { color: '#CCCCCC' }]}>
                {value.length ? value : '请选择' + placeholder}
              </Text>
              {dataType === 'city' ? (
                <TouchableOpacity
                  style={styles.city}
                  onPress={this.autoGetLocation}>
                  <Text style={styles.cityText}>定位城市</Text>
                  <Image
                    style={styles.cityImage}
                    source={require('../../../../assets/images/me_style/location.png')}
                  />
                </TouchableOpacity>
              ) : showText ? (
                <Text>{dataType === 'heightInches' ? 'CM' : 'KG'}</Text>
              ) : (
                <Icon name={'caret-down'} size={15} color={'#989898'} />
              )}
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.touchPicker}>
            <TextInput
              maxLength={15}
              placeholder={'请输入' + placeholder}
              placeholderTextColor={'#CCCCCC'}
              style={styles.textInput}
              value={value}
              onChangeText={this._onChangeText}
              underlineColorAndroid={'transparent'}
              onFocus={this._onFocus}
            />
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 39
  },
  showPickContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  shortContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 39
  },
  titleText: {
    marginLeft: 12,
    color: '#242424',
    fontSize: 16,
    fontWeight: '500'
  },
  shortTitleText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500'
  },
  text: {
    color: '#333333',
    fontSize: 13
  },
  textShort: {
    color: '#333333',
    fontSize: 13,
    flex: 1,
    textAlign: 'center'
  },
  textInput: {
    flex: 1,
    fontSize: 13
  },
  touchPicker: {
    height: 41,
    width: '100%',
    borderBottomWidth: 0.8,
    paddingHorizontal: 5,
    borderBottomColor: '#F3F3F3',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
    paddingLeft: 12,
    paddingRight: 16,
    justifyContent: 'space-between'
  },

  city: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cityText: { color: '#0076FF', fontSize: 14 },
  cityImage: {
    height: 16,
    width: 17
  }
})
