/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import FloatLabelTextInput from 'react-native-floating-label-text-input'
import Statistics from '../../../../src/expand/tool/statistics'
import p2d from '../../../../src/expand/tool/p2d'
import CountDownButton from './count_down_button'
import dismissKeyboard from 'react-native-dismiss-keyboard'

import {
  autoCheckVerificationCode,
  alertMessage
} from '../../../../src/expand/tool/login'

export default class TelephoneInputView extends Component {
  _userPhoneInput = text => {
    const {
      countdownButtonDisabled,
      disableCountdownButton,
      updateTelePhoneNumber
    } = this.props

    updateTelePhoneNumber(text)
    if (text.length < 11) {
      if (!countdownButtonDisabled) {
        disableCountdownButton(true)
      }
    } else {
      disableCountdownButton(false)
      dismissKeyboard()
      Statistics.onEvent({
        id: 'mobile_11_full',
        label: '填写11手机号1',
        attributes: { mobile: text }
      })
    }
  }
  _userPasswordInput = code => {
    const { updateVerificationCode, hashCode, telephone } = this.props
    updateVerificationCode(code, () => {
      if (code.length > 3) {
        const isTrueCode = autoCheckVerificationCode(code, hashCode)
        if (isTrueCode) {
          const { telephoneSignIn } = this.props
          dismissKeyboard()
          telephoneSignIn()
          Statistics.onEvent({
            id: 'sms_signin_verify',
            label: '登入验证码正确',
            attributes: { mobile: telephone }
          })
        }
      }
    })
  }

  _onChange = time => {
    return time ? `${time}秒` : ''
  }
  _sendVerificationCode = () => {
    const { telephone, sendVerificationCode } = this.props
    const reg = new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/)
    if (!reg.test(telephone)) {
      alertMessage('请输入正确的手机号码')
      return false
    }
    sendVerificationCode(() => {
      Statistics.onEvent({
        id: 'sms_signin_sent',
        label: '登入验证码已发送',
        attributes: { mobile: telephone }
      })
      this.codeTextInput.focus()
    })
    Statistics.onEvent({ id: 'sms_signin', label: '登入验证码' })
    return true
  }

  render() {
    const { countdownButtonDisabled } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.textInput}>
          <FloatLabelTextInput
            keyboardType={'numeric'}
            maxLength={11}
            placeholder={'你的手机号码'}
            placeholderTextColor={'#8e939a'}
            selectionColor={'#333'}
            onChangeTextValue={this._userPhoneInput}
            allowFontScaling={false}
          />
        </View>
        <View style={styles.textInput}>
          <FloatLabelTextInput
            ref={codeTextInput => (this.codeTextInput = codeTextInput)}
            keyboardType={'numeric'}
            placeholder={'接收到的验证码'}
            placeholderTextColor={'#8e939a'}
            editable={!countdownButtonDisabled}
            selectionColor={'#333'}
            maxLength={6}
            onChangeTextValue={this._userPasswordInput}
            allowFontScaling={false}
          />
          <CountDownButton
            disabled={countdownButtonDisabled}
            time={60}
            text={'发送验证码'}
            onChange={this._onChange}
            onPress={this._sendVerificationCode}
          />
        </View>
      </View>
    )
  }
}

TelephoneInputView.defaultProps = {
  disableCountdownButton: () => {},
  updateTelePhoneNumber: () => {},
  updateVerificationCode: () => {},
  telephoneSignIn: () => {}
}

const styles = StyleSheet.create({
  container: { marginTop: p2d(60, { maxLock: true }) },
  textInput: { height: 50, marginHorizontal: 36, marginBottom: 10 }
})
