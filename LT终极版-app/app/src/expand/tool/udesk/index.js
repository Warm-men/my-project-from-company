/* @flow */

import { Platform } from 'react-native'
import Udesk from 'react-native-letote-udesk'

const initUdeskManager = customer => {
  const UDESK_DOMAIN = 'letote.udesk.cn'
  const UDESK_APPKEY = '773214460d35f894a2d5835e3e9dc9ee'
  const UDESK_APPID = '9bfb57222299fa53'
  if (Platform.OS === 'android') {
    Udesk.initSDK(UDESK_DOMAIN, UDESK_APPKEY, UDESK_APPID)
  } else {
    Udesk.initUdeskManager(UDESK_DOMAIN, UDESK_APPKEY, UDESK_APPID, {
      nickname: customer.nickname,
      id: customer.id
    })
  }
}

const updateCustomer = customer => {
  if (Platform.OS === 'android') {
    const user = {
      nick_name: customer.nickname,
      sdk_token: customer.id
    }
    Udesk.setUserInfo(user, () => {})
  } else {
    const user = {
      nickname: customer.nickname,
      id: customer.id
    }
    Udesk.updateCustomer(user)
  }
}

const entryChat = () => {
  Udesk.entryChat()
}

export default { initUdeskManager, updateCustomer, entryChat }
