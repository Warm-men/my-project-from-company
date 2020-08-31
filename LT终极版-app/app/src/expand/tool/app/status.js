import { preLogin } from '../login'
import { Platform } from 'react-native'
import Stores from '../../../stores/stores'
import JVerification from 'react-native-letote-jverification'
import { getAbFlag } from '../../../components/ab_testing'

let preLoginTryCount = 0

/*
App的生命周期中的状态，根据不同状态，处理对应的一些业务逻辑
*/
const didFinishLaunching = callback => {
  preLoginTryCount = 0
  const { abTestStore, currentCustomerStore } = Stores

  //如果是未登录 preLogin
  if (!currentCustomerStore.id) {
    Platform.OS === 'ios' && checkVerifyEnable()
  }

  if (!currentCustomerStore.isSubscriber) {
    getAbFlag('on_scroll_animated_list', 1, value => {
      abTestStore.on_scroll_animated_list = value
    })
  }

  callback && callback()
}

const checkVerifyEnable = () => {
  JVerification.checkVerifyEnable(result => {
    preLoginTryCount++
    if (result) {
      preLogin()
    } else {
      if (preLoginTryCount < 10) {
        setTimeout(() => {
          checkVerifyEnable()
        }, 1000)
      }
    }
  })
}
export { didFinishLaunching }
