/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Text
} from 'react-native'
import { Mutate, SERVICE_TYPES } from '../../expand/services/services'
import p2d from '../../expand/tool/p2d'
import { SafeAreaView } from '../../../storybook/stories/navigationbar'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import Icon from 'react-native-vector-icons/EvilIcons'
import { LoginInterFace } from '../../../storybook/stories/login'
import {
  SignInButton,
  TelephoneInputView
} from '../../../storybook/stories/login/telephone_login'
import { inject, observer } from 'mobx-react'
import {
  weChatSignIn,
  telephoneSignIn,
  isFinishedInputForSignIn,
  alertMessage
} from '../../expand/tool/login'

@inject('currentCustomerStore', 'appStore', 'popupsStore')
@observer
class LoginWithVerificationCode extends Component {
  constructor(props) {
    super(props)

    this.initialState = {
      countdownButtonDisabled: true,
      isTelephoneLogin: false,
      isWechatLogin: false,
      telephone: '',
      verificationCode: '',
      hashCode: ''
    }
    this.state = { ...this.initialState }
  }

  _cancel = () => {
    const { currentCustomerStore, popupsStore } = this.props
    currentCustomerStore.setVerificationCodeModalVisible(false)
    this.setState(this.initialState)
    if (popupsStore.isPopupLoading) {
      popupsStore.isPopupLoading = false
    }
  }

  _weChatSignIn = () => {
    this.setState({ isWechatLogin: true })
    weChatSignIn(
      () => {
        this.setState(this.initialState)
      },
      () => {
        this.setState({ isWechatLogin: false })
      }
    )
  }

  _telephoneSignIn = () => {
    const { telephone, verificationCode, hashCode } = this.state
    const done = isFinishedInputForSignIn(telephone, verificationCode, hashCode)

    if (!done || this.isTelephoneLogin) return
    this.isTelephoneLogin = true
    dismissKeyboard()

    this.setState({ isTelephoneLogin: true })
    const params = { telephone, verificationCode, hashCode }
    telephoneSignIn(
      params,
      () => {
        this.isTelephoneLogin = false
        this.setState(this.initialState)
      },
      failure => {
        if (failure && failure.status === 401) {
          alertMessage('验证码不正确')
        }
        this.isTelephoneLogin = false
        this.setState({ isTelephoneLogin: false })
      }
    )
  }

  _sendVerificationCode = success => {
    const { telephone } = this.state
    Mutate(
      SERVICE_TYPES.common.MUTATION_GET_PHONE_CODE,
      { input: { telephone } },
      response => {
        this.setState({ hashCode: response.data.SendVerificationCode })
        success && success()
      },
      error => {
        alertMessage(error.message)
      }
    )
  }

  _localNumberSignIn = () => {
    const { currentCustomerStore } = this.props
    currentCustomerStore.setVerificationCodeModalVisible(false)
    currentCustomerStore.setLoginModalVisible(true)
  }

  render() {
    const { appStore, currentCustomerStore } = this.props
    const { loginModalVisible, isShowLocalNumber } = currentCustomerStore
    const isLogin = this.state.isWechatLogin || this.state.isTelephoneLogin
    const isWechatInstalled = appStore.inApplication.WeChat

    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        onRequestClose={() => {}}
        visible={loginModalVisible}>
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={20}
            behavior={Platform.select({ ios: 'padding' })}>
            <TouchableOpacity onPress={this._cancel} style={styles.cancel}>
              <Icon name={'close'} size={32} color={'#323232'} />
            </TouchableOpacity>
            <View style={styles.titleView}>
              <Text style={styles.topTitle}>SIGN IN</Text>
              <Text style={styles.smallTitle}>手机号快捷登入</Text>
            </View>
            <TelephoneInputView
              countdownButtonDisabled={this.state.countdownButtonDisabled}
              disableCountdownButton={bool => {
                this.setState({ countdownButtonDisabled: bool })
              }}
              updateTelePhoneNumber={telephone => {
                this.setState({ telephone })
              }}
              updateVerificationCode={(verificationCode, callback) => {
                this.setState({ verificationCode }, () => {
                  callback && callback()
                })
              }}
              sendVerificationCode={this._sendVerificationCode}
              telephoneSignIn={this._telephoneSignIn}
              telephone={this.state.telephone}
              verificationCode={this.state.verificationCode}
              hashCode={this.state.hashCode}
            />
            <SignInButton
              isLogin={isLogin}
              isTelephoneLogin={this.state.isTelephoneLogin}
              telephoneSignIn={this._telephoneSignIn}
            />
            {(isShowLocalNumber || isWechatInstalled) && (
              <LoginInterFace
                isShowLocalNumber={isShowLocalNumber}
                isWechatInstalled={isWechatInstalled}
                weChatSignIn={this._weChatSignIn}
                localNumberSignIn={this._localNumberSignIn}
              />
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
    justifyContent: 'space-between'
  },
  titleView: {
    marginTop: p2d(40) < 40 ? p2d(20) : p2d(40),
    justifyContent: 'center'
  },
  topTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333'
  },
  smallTitle: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
  },
  cancel: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: 44,
    margin: 14
  }
})

export default LoginWithVerificationCode
