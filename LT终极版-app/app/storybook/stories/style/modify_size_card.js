import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import Picker from 'react-native-letote-picker'
import p2d from '../../../src/expand/tool/p2d'
import Icon from 'react-native-vector-icons/EvilIcons'
import Image from '../image'

class SizePicker extends Component {
  static defaultProps = {
    pickerConfirmBtnText: '确认',
    pickerCancelBtnText: '取消',
    pickerTitleText: '请选择XX',
    pickerData: []
  }

  constructor(props) {
    super(props)
  }
  componentWillUnmount() {
    Picker.hide()
  }
  showPicker = () => {
    const {
      pickerData,
      pickerConfirmBtnText,
      pickerCancelBtnText,
      pickerTitleText,
      selectedValue,
      toggleFadeLayer
    } = this.props
    toggleFadeLayer && toggleFadeLayer()
    Picker.init({
      pickerData,
      pickerConfirmBtnText,
      pickerCancelBtnText,
      pickerTitleText,
      selectedValue,
      onPickerConfirm: data => {
        const { dataType } = this.props
        this.props.onPress(dataType ? { dataType, data } : { data })
        toggleFadeLayer && toggleFadeLayer()
      },
      onPickerCancel: () => {
        toggleFadeLayer && toggleFadeLayer()
      }
    })
    Picker.show()
  }

  render() {
    const { title, value } = this.props
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={this.showPicker}>
        <Text style={styles.nameText}>
          {title}
          <Text style={styles.star}>{'*'}</Text>
        </Text>
        <View style={styles.touchView}>
          {value ? (
            <Text style={[styles.touchViewText]}>
              {value}
              {title === '身高' ? 'cm' : title === '体重' ? 'kg' : null}
            </Text>
          ) : (
            <Text style={styles.touchViewText}>{'点击选择'}</Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }
}

class SizeCard extends Component {
  constructor(props) {
    super(props)
  }
  _onPress = () => {
    const { dataType, onPress } = this.props
    onPress && onPress(dataType)
  }
  render() {
    const { title, value, disabled } = this.props
    const showLock = disabled && title !== '体型'
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={this._onPress}>
        <Text style={[styles.nameText, showLock && styles.showLockText]}>
          {title}
        </Text>
        <Text
          style={[styles.touchViewTextCard, showLock && styles.showLockText]}>
          {value}
          {title !== '体型' && value && 'cm'}
        </Text>
        {showLock ? (
          <Image source={require('../../../assets/images/me_style/lock.png')} />
        ) : (
          <Icon
            name={'chevron-right'}
            size={20}
            color={'#999'}
            style={styles.chevronIcon}
          />
        )}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    paddingBottom: p2d(12)
  },
  nameText: {
    fontSize: 14,
    color: '#000',
    width: p2d(48)
  },
  star: {
    fontSize: 16,
    color: '#EA5C39'
  },
  touchView: {
    width: p2d(105),
    flexDirection: 'row',
    justifyContent: 'center'
  },
  touchViewText: {
    fontSize: 14,
    color: '#999'
  },
  touchViewTextCard: {
    fontSize: 14,
    color: '#999',
    width: p2d(105),
    textAlign: 'center'
  },
  touchViewTextTip: {
    fontSize: 14,
    color: '#CCC'
  },
  sizeCardView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chevronIcon: {
    marginTop: p2d(2)
  },
  showLockText: {
    color: '#999'
  }
})

export { SizePicker, SizeCard }
