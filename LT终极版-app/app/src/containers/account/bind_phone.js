/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  DeviceEventEmitter,
  Text
} from 'react-native'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import { Mutate, SERVICE_TYPES } from '../../expand/services/services'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import FloatLabelTextInput from 'react-native-floating-label-text-input'
import CountDownButton from '../../../storybook/stories/login/telephone_login/count_down_button'
import { inject } from 'mobx-react'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'
import { onSignOut } from '../../expand/tool/login'
@inject(
  'currentCustomerStore',
  'appStore',
  'modalStore',
  'couponStore',
  'toteCartStore'
)
export default class BindPhoneContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { countdownButtonDisabled: true }
    this.bindSuccess = false
    this.autoRedeemExchangeCard = false
  }

  _alert = textValue => {
    const { modalStore } = this.props
    modalStore.show(
      <CustomAlertView message={textValue} cancel={{ title: '确定' }} />
    )
  }

  handleBackPress = () => {
    this._goBack()
    return true
  }

  UNSAFE_componentWillMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    }
  }

  _goBack = () => {
    const { navigation, appStore } = this.props
    const { params } = navigation.state
    if (params && params.isLogin && !this.bindSuccess) {
      Mutate(SERVICE_TYPES.me.MUTATION_SIGNOUT, {})

      onSignOut()
      appStore.showToast('登入失败', 'error')

      setTimeout(() => {
        const loginModalAction = params.loginModalAction
        if (loginModalAction) {
          loginModalAction && loginModalAction({ error: '领取失败' })
        }
      }, 1000)
    }
    if (params && params.isLogin && this.bindSuccess) {
      appStore.showToast('登入成功', 'success')
    }
    if (this.autoRedeemExchangeCard) {
      this._getCurrentCustomer()
    } else {
      navigation.goBack()
    }
  }

  _getCurrentCustomer = () => {
    const {
      navigation,
      currentCustomerStore,
      couponStore,
      toteCartStore
    } = this.props
    QNetwork(
      SERVICE_TYPES.me.QUERY_ME,
      {},
      response => {
        const { me } = response.data
        currentCustomerStore.updateCurrentCustomer(me)
        couponStore.updateValidCoupons(me)
        toteCartStore.updateToteCart(me.tote_cart)
        DeviceEventEmitter.emit('refreshHomeList')
        navigation.navigate('CreateMember')
        this.autoRedeemExchangeCard = false
      },
      () => {
        this.autoRedeemExchangeCard = false
      }
    )
  }

  _userPasswordInput = text => {
    this.passwordText = text
    if (this.passwordText.length > 3) {
      if (this.verificationCode) {
        const sha256 = require('hash.js/lib/hash/sha/256')
        if (
          this.verificationCode.hashed_code !==
          sha256()
            .update(this.passwordText + this.verificationCode.salt)
            .digest('hex')
        ) {
          this._alert('验证码有误')
          dismissKeyboard()
          return
        }
        dismissKeyboard()
        return
      }
      this._alert('请获取你的验证码')
      return
    }
  }
  _userPhoneInput = text => {
    this.userText = text
    if (this.userText.length < 11) {
      !this.state.countdownButtonDisabled &&
        this.setState({ countdownButtonDisabled: true })
    } else {
      this.setState({ countdownButtonDisabled: false })
    }
  }
  _sendVerificationCode = () => {
    const reg = new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/)
    if (!reg.test(this.userText)) {
      this._alert('请输入正确的手机号码')
      return false
    }
    Mutate(
      SERVICE_TYPES.common.MUTATION_GET_PHONE_CODE,
      { input: { telephone: this.userText } },
      response => {
        this.verificationCode = response.data.SendVerificationCode
      }
    )
    return true
  }
  _onChange = time => {
    return time ? `${time}秒` : ''
  }

  _updateCustomer = () => {
    if (!this.userText) {
      this._alert('请输入手机号码')
      return
    } else {
      const reg = new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/)
      if (!reg.test(this.userText)) {
        this._alert('请输入正确的手机号码')
        return false
      }
    }
    if (!this.verificationCode && !this.passwordText) {
      this._alert('请点击发送验证码获取验证码')
      return
    }
    if (!this.passwordText) {
      this._alert('请输入验证码')
      return
    }
    const { currentCustomerStore } = this.props
    Mutate(
      SERVICE_TYPES.me.MUTATION_UPDATE_CUSTOMER,
      {
        customer: {
          telephone: this.userText,
          verification_code: this.passwordText
        }
      },
      response => {
        this.autoRedeemExchangeCard =
          response.data.UpdateCustomer.auto_redeem_exchange_card
        currentCustomerStore.updateTelephone(this.userText)
        this.bindSuccess = true
        this._goBack()
        const { params } = this.props.navigation.state
        if (params) {
          const routeName = params.routeName
          const variables = params.variables
          const loginModalAction = params.loginModalAction

          if (loginModalAction) {
            loginModalAction && loginModalAction(variables)
          } else if (routeName) {
            this.props.navigation.navigate(routeName, variables)
          }
          DeviceEventEmitter.emit('visibleActivity')
        }
      },
      failure => {
        this._alert(failure)
      }
    )
  }
  render() {
    const { currentCustomerStore } = this.props
    return (
      <SafeAreaView style={styles.container}>
        <NavigationBar
          hasBottomLine={false}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <KeyboardAvoidingView
          keyboardVerticalOffset={20}
          behavior={'padding'}
          style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {currentCustomerStore.telephone ? '更换手机号' : '绑定手机号'}
            </Text>
            <Text style={styles.phoneNumText}>
              {currentCustomerStore.telephone}
            </Text>
          </View>
          <View style={styles.floatLabelTextInput}>
            {/* //TODO 封装出一个MobileNumInput 组件，做输入数据（手机号）验证 */}
            <FloatLabelTextInput
              style={styles.floatLabelTextInput}
              keyboardType={'numeric'}
              maxLength={11}
              placeholder={'你的手机号码'}
              placeholderTextColor={'#8e939a'}
              selectionColor={'#333'}
              onChangeTextValue={this._userPhoneInput}
            />
          </View>

          <View style={styles.floatLabelTextInput}>
            {/* //TODO 封装出一个MobileNumInput 组件，做输入数据（手机号）验证 */}
            <FloatLabelTextInput
              keyboardType={'numeric'}
              placeholder={'接收到的验证码'}
              placeholderTextColor={'#8e939a'}
              selectionColor={'#333'}
              onChangeTextValue={this._userPasswordInput}
            />
            <CountDownButton
              disabled={this.state.countdownButtonDisabled}
              time={60}
              text={'发送验证码'}
              onChange={this._onChange}
              onPress={this._sendVerificationCode}
            />
          </View>
          <TouchableOpacity
            style={styles.bindView}
            activeOpacity={0.85}
            onPress={this._updateCustomer}>
            <Text style={styles.loginTitle}>确认绑定</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 24,
    color: '#333333',
    fontWeight: '600'
  },
  floatLabelTextInput: {
    height: 50,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10
  },
  bindView: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    height: 45,
    borderRadius: 2,
    backgroundColor: '#EA5C39',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginTitle: {
    fontSize: 16,
    color: 'white'
  },
  phoneNumText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#999999',
    textAlign: 'center'
  },
  textContainer: {
    margin: 20,
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center'
  }
})
