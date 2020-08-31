import Jverfication from 'react-native-letote-jverification'
import Stores from '../../../stores/stores'
import appsFlyer from 'react-native-appsflyer'
import Statistics from '../../../expand/tool/statistics'
import { Platform, View, Alert } from 'react-native'
import channel from '../../../expand/tool/channel'
import { Client } from '../../../expand/services/client'
import React from 'react'
// eslint-disable-next-line
import {
  QNetwork,
  GET,
  POST,
  SERVICE_TYPES,
  resetQueriseStore
} from '../../../expand/services/services'

const JVERFICATION_CODE = 8000
const WECHAT = 9000
const CANCEL = 6002
const SUCCESS = 6000

const customerLogin = () => {
  Jverfication.checkVerifyEnable(result => {
    reportSignEvent(true)
    if (result) {
      Jverfication.loginAuth(
        { isInstallWechat: Stores.appStore.inApplication.WeChat },
        loginResult => {
          Stores.currentCustomerStore.setVerificationCodeModalVisible(false)
          handleResult(loginResult)
          reportSignEvent(false)
        }
      )
    } else {
      Stores.currentCustomerStore.setVerificationCodeModalVisible(true)
    }
  })
}

const reportSignEvent = isVisible => {
  isVisible
    ? Statistics.onEvent({
        id: 'show_signin',
        label: '打开登入界面',
        attributes: { type: '一键登入界面' }
      })
    : Statistics.onEvent({
        id: 'dismiss_signin',
        label: '关闭登入界面',
        attributes: { type: '一键登入界面' }
      })
}

const hideLoading = () => {
  Stores.modalStore.hide()
}
const handleResult = result => {
  switch (result.code) {
    case SUCCESS:
      const param = { verificationCode: result.loginToken }
      telephoneSignIn(
        param,
        () => {
          hideLoading()
        },
        error => {
          handleError(error)
        },
        true
      )
      break
    //点击了原生的验证码按钮
    case JVERFICATION_CODE:
      hideLoading()
      Stores.currentCustomerStore.setVerificationCodeModalVisible(true, true)
      break
    //点击了原生的微信登入按钮
    case WECHAT:
      weChatSignIn(
        () => {
          hideLoading()
        },
        () => {
          hideLoading()
        }
      )
      break
    case CANCEL:
      hideLoading()
      break
    default:
      handleError(result.content)
      break
  }
}
const handleError = error => {
  hideLoading()
  Stores.appStore.showToastWithOpacity(
    Client.ORIGIN.indexOf('wechat.') !== -1 ? '为你跳转至手机号登录' : error
  )
  setTimeout(() => {
    Stores.currentCustomerStore.setVerificationCodeModalVisible(true)
  }, 1000)
}

/*
  WeChat 登录
*/
const weChatSignIn = async (success, failure) => {
  try {
    const WeChat = require('react-native-letote-wechat')
    let result = await WeChat.sendAuthRequest('snsapi_userinfo', 'letote123')
    if (result) {
      weChatSignInWithCode(result.code, success, failure)
    }

    Statistics.onEvent({ id: 'wechat_signin', label: '微信登入' })
  } catch (e) {
    failure && failure()
    if (e instanceof WeChat.WechatError) {
      console.error(e.stack)
    } else {
      throw e
    }
  }
}
/* 通过微信返回的code做登录校验 */
const weChatSignInWithCode = async (code, success, failure) => {
  GET(
    SERVICE_TYPES.me.FETCH_WECHAT_LOGIN,
    { code, utm_source: Platform.OS === 'ios' ? channel : await channel },
    data => {
      const { new_sign_up, customer } = data
      if (new_sign_up) {
        reportEvent('new_sign_up', '新注册用户', customer.id)
      }
      reportEvent('wechat_signin_verify', '微信登入成功', customer.id)

      getCurrentCustomerAfterSignIn(success, failure)
    },
    () => {
      failure && failure()
    }
  )
}

const getCurrentCustomerAfterSignIn = (
  success,
  failure,
  telephone,
  showToast
) => {
  const {
    currentCustomerStore,
    closetStore,
    couponStore,
    appStore,
    popupsStore,
    toteCartStore,
    totesStore
  } = Stores
  QNetwork(
    SERVICE_TYPES.me.QUERY_ME,
    {},
    response => {
      const me = response.data.me
      if (me) {
        currentCustomerStore.setVerificationCodeModalVisible(false)
        resetQueriseStore(() => {
          popupsStore.resetPopup()
          getOrders()
          couponStore.updateValidCoupons(me)
          closetStore.updateClosetIds(me.closet)
          toteCartStore.updateToteCart(me.tote_cart)
          totesStore.latest_rental_tote = response.data.latest_rental_tote
          currentCustomerStore.updateCurrentCustomer(me)
          currentCustomerStore.loginModalAction &&
            currentCustomerStore.loginModalAction()
          if (!appStore.isGuided) {
            appStore.tagLogin = true
            appStore.isGuided = true
          }
          const dic = {
            telephone,
            message: 'signin_user_ready',
            date: new Date()
          }
          GET(SERVICE_TYPES.common.FETCH_ERROR_SIGERR, dic)
          Statistics.onEvent({
            id: 'signin_user_ready',
            label: '登入用户信息成功'
          })
        })
        success && success()
        showToast && appStore.showToastWithOpacity('登入成功')
      }
    },
    error => {
      failure && failure(error)
      const dic = {
        telephone,
        message: 'signin_user_ready_error',
        date: new Date()
      }
      GET(SERVICE_TYPES.common.FETCH_ERROR_SIGERR, dic)
    }
  )
}
const getOrders = () => {
  QNetwork(SERVICE_TYPES.orders.QUERY_ORDERS, {}, response => {
    Stores.ordersStore.orders = response.data.orders
      ? [...response.data.orders]
      : []
  })
}

const reportEvent = (
  eventName,
  eventValue,
  customerUserId,
  isReportAttr = false
) => {
  isReportAttr
    ? Statistics.onEvent({
        id: eventName,
        label: eventValue,
        attributes: { mobile: '', id: customerUserId }
      })
    : Statistics.onEvent({
        id: eventName,
        label: eventValue,
        attributes: { id: customerUserId }
      })
  // 正式环境才上报appsflyer事件
  if (Client.ORIGIN.indexOf('wechat.') !== -1) {
    if (customerUserId) {
      appsFlyer.setCustomerUserId(customerUserId.toString(), () => {
        appsFlyer.trackEvent(
          eventName,
          { eventValue: eventValue },
          () => {},
          () => {}
        )
      })
    } else {
      appsFlyer.trackEvent(
        eventName,
        { eventValue: eventValue },
        () => {},
        () => {}
      )
    }
  }
}

const telephoneSignIn = async (params, success, failure, showToast) => {
  const { telephone, verificationCode, hashCode } = params
  const customer = telephone
    ? { telephone, verification_code: verificationCode }
    : { jverification_login_token: verificationCode }
  POST(
    SERVICE_TYPES.me.FETCH_TELEPHONE_LOGIN,
    {
      customer,
      utm_source: Platform.OS === 'ios' ? channel : await channel
    },
    response => {
      getCurrentCustomerAfterSignIn(success, failure, telephone, showToast)

      const { id, success_redirect_path } = response
      const isFirst = success_redirect_path.indexOf('new_sign_up=true') !== -1
      if (isFirst) {
        reportEvent('new_sign_up', '新用户注册', id)
      }
      reportEvent('signin_ok', '登入成功', id, true)

      const dic = { telephone, message: 'signin_ok', date: new Date() }
      GET(SERVICE_TYPES.common.FETCH_ERROR_SIGERR, dic)
    },
    error => {
      failure && failure(error)

      Statistics.onEvent({ id: 'signin_failure', label: '登入失败' })

      const dic = {
        telephone,
        message: 'signin_failure',
        verification_code: verificationCode,
        date: new Date()
      }
      if (verificationCode) {
        const isTrueCode = autoCheckVerificationCode(verificationCode, hashCode)
        dic.is_true_code = isTrueCode
      }
      GET(SERVICE_TYPES.common.FETCH_ERROR_SIGERR, dic)
    }
  )
}

const isFinishedInputForSignIn = (telephone, code, hashCode) => {
  if (!telephone) {
    alertMessage('请输入手机号码')
    return false
  } else {
    const reg = new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/)
    if (!reg.test(telephone)) {
      alertMessage('请输入正确的手机号码')
      return false
    }
  }
  if (!hashCode && !code) {
    alertMessage('请点击发送验证码获取验证码')
    return false
  }
  if (!code) {
    alertMessage('请输入验证码')
    return false
  }
  return true
}

const autoCheckVerificationCode = (verificationCode, hashCode) => {
  let isTrueCode = false
  if (hashCode) {
    const sha256 = require('hash.js/lib/hash/sha/256')
    isTrueCode =
      hashCode.hashed_code ===
      sha256()
        .update(verificationCode + hashCode.salt)
        .digest('hex')
  }
  return isTrueCode
}

const alertMessage = msg => {
  Alert.alert(msg, '', [{ text: '关闭', style: 'default' }, 'plain-text'])
}

const onSignOut = () => {
  const {
    currentCustomerStore,
    closetStore,
    ordersStore,
    totesStore,
    couponStore,
    popupsStore,
    toteCartStore,
    customerPhotosStore
  } = Stores
  currentCustomerStore.signOut()
  ordersStore.orders = []
  couponStore.resetCoupon()
  //清理store的收藏数据
  closetStore.refreshProducts()
  closetStore.resetCloset()
  //清除衣箱
  totesStore.latest_rental_tote = null
  totesStore.past_totes = []
  popupsStore.resetPopup()
  toteCartStore.resetToteCart()
  customerPhotosStore.resetCustomerPhotos()
}

const preLogin = () => {
  const { isOpenJverification, isPreLoginSuccess } = Stores.appStore
  if (isOpenJverification && Platform.OS === 'ios' && !isPreLoginSuccess) {
    Statistics.onEvent({ id: 'preLogin_start' })

    Jverfication.preLogin({ timeout: 5000 }, result => {
      const isSuccess = result.code === 7000
      Stores.appStore.isPreLoginSuccess = isSuccess

      Statistics.onEvent({
        id: 'preLogin_result',
        attributes: { result: isSuccess ? '成功' : '失败' }
      })
    })
  }
}

export {
  customerLogin,
  weChatSignIn,
  telephoneSignIn,
  isFinishedInputForSignIn,
  autoCheckVerificationCode,
  alertMessage,
  onSignOut,
  preLogin
}
