import React from 'react'
import { Platform, AppState, DeviceEventEmitter } from 'react-native'
import dateFns from 'date-fns'
import Statistics from '../../expand/tool/statistics'
import { allowToStartLoad } from '../../expand/tool/url_filter'
import Stories from '../../stores/stores'
import RNLetoteIntent from 'react-native-letote-intent'
import Notification from '../../../storybook/stories/alert/notification'
const MIPush = require('react-native-letote-xmpush')

const initMipush = navigation => {
  // MIPush.setBadgeNumber(0) // 每次进入app将角标设置为0
  if (Platform.OS === 'ios') {
    addiOSNotifycationListener(navigation)
  } else {
    addAndroidNotifycationListener(navigation)
  }
  const { id, hasTopic, updateTopic } = Stories.currentCustomerStore
  const date = new Date()
  if (!id && !hasTopic) {
    MIPush.subscribe('anon_' + dateFns.format(date, 'YYYYMMDD'))
    MIPush.subscribe(
      'anon_' + dateFns.format(date, 'YYYY') + dateFns.format(date, 'WW')
    )
    updateTopic(true)
  }
  // AppState.addEventListener('change', _handleAppStateChange)
  return removeMipushEventListeners
}
const removeMipushEventListeners = () => {
  // AppState.removeEventListener('change', _handleAppStateChange)
  if (Platform.OS === 'ios') {
    MIPush.removeEventListener('xmpush_click')
    MIPush.removeEventListener('notification')
  } else {
    MIPush.removeEventListener('xmpush_click')
    MIPush.removeEventListener('xmpush_notify')
  }
}
// const _handleAppStateChange = nextAppState => {
//   if (nextAppState === 'active') {
//     //每次app回到前台将角标设置为0
//     MIPush.setBadgeNumber(0)
//   }
// }

const addiOSNotifycationListener = navigation => {
  MIPush.addEventListener('xmpush_click', notification => {
    //点击通知
    setUriAndEvent(notification, navigation)
  })

  MIPush.getInitialNotification(notification => {
    //app关闭时获取点击通知消息
    setUriAndEvent(notification, navigation)
  })
  MIPush.addEventListener('notification', notification => {
    if (
      notification &&
      notification._data &&
      notification._data.route_name === 'Totes'
    ) {
      DeviceEventEmitter.emit('onRefreshTotes')
    }
  })
}

addAndroidNotifycationListener = navigation => {
  MIPush.addEventListener('xmpush_click', notification => {
    //app运行过程中点击通知(activity没被回收)
    if (notification) {
      const { route_name, event, route_params } = notification
      pageRoute(route_name, event, route_params, navigation)
    }
  })
  MIPush.addEventListener('xmpush_notify', notification => {
    notification &&
      notification.route_name === 'Totes' &&
      DeviceEventEmitter.emit('onRefreshTotes')
    //app接收到通知
  })
  MIPush.getInitialNotification(notification => {
    // app关闭时获取点击通知消息 (activity 被回收)
    if (notification) {
      const { route_name, event, route_params } = notification
      pageRoute(route_name, event, route_params, navigation)
    }
  })
}
setUriAndEvent = (notification, navigation) => {
  if (notification) {
    if (notification._data) {
      notification = notification._data
    }
    const { route_name, event, route_params } = notification
    pageRoute(route_name, event, route_params, navigation)
  }
}

pageRoute = (uri, event, routeParams, navigation) => {
  if (event) {
    Statistics.onEvent({ id: event, label: event })
  }
  if (!navigation || !uri) return
  const { navigate, push } = navigation
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    const useWebView = allowToStartLoad(uri, navigation)
    if (useWebView) {
      push('WebPage', { uri })
    }
  } else {
    let param = {}
    if (routeParams) param = JSON.parse(routeParams)
    const isPush = uri === 'CustomerPhotoDetails'
    if (isPush) {
      DeviceEventEmitter.emit('refreshHomeData')
      push(uri, { ...param, isFromNotification: true })
    } else navigate(uri, { ...param, isFromNotification: true })
  }
}

isShowNotificationDialog = async noTimeLimit => {
  const { appStore } = Stories
  const isAllowReceiveNotification = await RNLetoteIntent.isAllowReceiveNotification()
  if (
    Platform.OS === 'ios'
      ? !isAllowReceiveNotification[0]
      : !isAllowReceiveNotification
  ) {
    if (noTimeLimit) {
      return true
    } else {
      const days = dateFns.differenceInDays(
        new Date(),
        appStore.lastShowNotifycationDialogTime
      )
      if (days > 1) appStore.lastShowNotifycationDialogTime = new Date()
      return days > 1
    }
  } else {
    return false
  }
}

const showNotificationDialog = async (notificationContent, noTimeLimit) => {
  const { modalStore } = Stories
  if (await isShowNotificationDialog(noTimeLimit)) {
    modalStore.show(<Notification {...notificationContent} />)
  }
}

export { initMipush, showNotificationDialog }
