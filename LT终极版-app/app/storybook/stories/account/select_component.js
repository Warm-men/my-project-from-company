import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text
} from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import ChevronIcon from 'react-native-vector-icons/EvilIcons'
import Picker from 'react-native-letote-picker'
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
  _onFocus = () => {
    Picker.hide()
  }
  render() {
    return this.props.isLongPickerType ? (
      <View style={styles.container}>
        <Text style={styles.titleText}>{this.props.title}</Text>
        {this.props.showPicker ? (
          <TouchableOpacity
            style={styles.touchPicker}
            onPress={this.showPicker}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
              <Text
                style={[
                  styles.text,
                  !this.state.value.length && { color: '#999' }
                ]}>
                {this.state.value.length ? this.state.value : '请选择'}
                {this.props.title === '身高' && this.state.value.length
                  ? 'cm'
                  : null}
                {this.props.title === '体重' && this.state.value.length
                  ? 'kg'
                  : null}
              </Text>
              <Icon name={'select-arrows'} size={20} color={'#333'} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.touchPicker}>
            <TextInput
              maxLength={15}
              placeholder={'请输入'}
              style={styles.textInput}
              value={this.state.value}
              onChangeText={this._onChangeText}
              underlineColorAndroid={'transparent'}
              onFocus={this._onFocus}
            />
          </View>
        )}
      </View>
    ) : (
      <View style={styles.shortContainer}>
        <Text style={styles.shortTitleText}>{this.props.title}</Text>
        <TouchableOpacity
          style={styles.shortTouchPicker}
          onPress={this._onPress}>
          <Text
            style={[styles.textShort, !this.props.value && { color: '#999' }]}>
            {this.props.value ? this.props.value : '请选择'}
            {this.props.value && 'cm'}
          </Text>
          <ChevronIcon
            name={'chevron-right'}
            size={20}
            color={'#999'}
            style={styles.chevronIcon}
          />
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
    backgroundColor: '#F5F5F2',
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
    paddingLeft: 27,
    paddingRight: 16,
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
  }
})
