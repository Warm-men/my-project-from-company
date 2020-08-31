import { Platform } from 'react-native'
import appsFlyer from 'react-native-appsflyer'
import { Client } from '../services/client'
import RNAnalytics from 'react-native-letote-baidumjt'
import sensors from 'react-native-letote-sensors'
import Stores from '../../stores/stores'
import RNLetoteIntent from 'react-native-letote-intent'
import dateFns from 'date-fns'

const onPageStart = (routeName, remind) => {
  RNAnalytics.onPageStart(routeName)
  Stores.modalStore.currentRoute = routeName
  setSuperProperties()
  const object = { screen_name: routeName }
  if (remind) object.remind = remind

  sensors.trackViewScreen(object)
}
const onPageEnd = routeName => {
  RNAnalytics.onPageEnd(routeName)
}

const getCurrentRouteStateParams = navigationState => {
  if (!navigationState) return null
  const { routeName, params } = navigationState.routes[navigationState.index]
  if (!params) return null
  let remind
  if (routeName === 'WebPage') {
    remind = params.uri
  } else if (routeName === 'Collection') {
    remind = params.collection.id
  } else if (routeName === 'LookBooks') {
    remind = params.id
  } else if (routeName === 'LookbookDetail') {
    remind = params.id
  } else if (routeName === 'OccasionCollection') {
    remind = params.collection.slug
  } else if (routeName === 'Brand') {
    remind = params.brandId
  } else if (routeName === 'Details') {
    remind = params.item.id
  } else if (routeName === 'CustomerPhotoDetails') {
    remind = params.id
  }
  return remind
}

/* data  {
          id     事件id
          label  事件描述
          attributes  参数
          } */
const onEvent = data => {
  if (!data) {
    return
  }
  setSuperProperties()
  let { id, label, attributes } = data
  if (attributes) {
    if (attributes.id) {
      RNAnalytics.onEvent(id, label)
    } else {
      RNAnalytics.onEventWithAttributes(id, label, attributes)
    }
    sensors.trackWithProperties(id, attributes)
  } else {
    RNAnalytics.onEvent(id, label)
    sensors.track(id)
  }
}

const setSuperProperties = () => {
  const {
    current_subtype_name,
    current_subtype_value,
    locked_tote_count
  } = getCurrentUserSubscription()

  const data = {
    current_subtype_value,
    current_subtype_name,
    locked_tote_count
  }
  if (Stores.modalStore.currentRoute) {
    data.screen_name = Stores.modalStore.currentRoute
  }

  sensors.registerDynamicSuperProperties(data)
}

const getCurrentUserSubscription = () => {
  const { currentCustomerStore } = Stores
  const {
    isValidSubscriber,
    subscription,
    isSubscriber,
    lockedToteCount
  } = currentCustomerStore
  let current_subtype_name
  let current_subtype_value
  if (isValidSubscriber) {
    const { subscription_type, promo_code } = subscription
    current_subtype_name = subscription_type.display_name
    if (promo_code === 'LTCN_FREE_TOTE' || promo_code === 'LTCN_FREE_TOTE_79') {
      current_subtype_name = '试用会员'
    }
  } else {
    if (isSubscriber) {
      current_subtype_name = '过期会员'
    } else {
      current_subtype_name = currentCustomerStore.id ? '非会员' : '未登入'
    }
  }
  current_subtype_value =
    subscription &&
    subscription.subscription_type &&
    subscription.subscription_type.id
  current_subtype_value = current_subtype_value || 'null'
  return {
    current_subtype_name,
    current_subtype_value,
    locked_tote_count: lockedToteCount
  }
}
/* data  {
          id     事件id
          label  事件描述
          durationTime  时长
          attributes  参数
          } */
const onEventDuration = data => {
  if (!data) {
    return
  }
  const { id, label, durationTime, attributes } = data
  if (attributes) {
    RNAnalytics.onEventDurationWithAttributes(
      id,
      label,
      durationTime,
      attributes
    )
    attributes.durationTime = durationTime
    sensors.trackWithProperties(id, attributes)
  } else {
    sensors.trackWithProperties(id, { durationTime })
    RNAnalytics.onEventDuration(id, label, durationTime)
  }
}

const bindSensors = user => {
  sensors.login(user.id)
  setProfile(user)
}

const setProfile = async user => {
  const {
    style: {
      occupation,
      birthday,
      marital_status,
      mom,
      height_inches,
      weight,
      bust_size_number,
      top_size,
      dress_size
    },
    first_subscribed_at
  } = user

  const isAllowReceiveNotification = await RNLetoteIntent.isAllowReceiveNotification()
  const notification_status =
    Platform.OS === 'ios'
      ? isAllowReceiveNotification[0]
      : isAllowReceiveNotification
  const { state, city, district } = user.shipping_address || {}
  let content = {
    subscriptionType: user.subscription
      ? `${
          user.subscription.display_interval
            ? user.subscription.display_interval
            : ''
        }${user.subscription.display_name}`
      : '非会员',
    shipping_address_state: state,
    shipping_address_city: city,
    shipping_address_district: district,
    occupation,
    birthday,
    marital_status,
    mom,
    height_inches,
    weight,
    bust_size_number,
    top_size,
    dress_size,
    notification_status,
    first_subscribed_at: first_subscribed_at
      ? dateFns.format(first_subscribed_at, 'YYYY-MM-DD')
      : null
  }
  sensors.profileSet(content)
}

const unBindSensors = () => {
  sensors.logout()
}

// const appsFlyerOnEvent = (id, attributes) => {
//   appsFlyer.trackEvent(id, attributes ? attributes : {}, () => {}, () => {})
// }

const initStatistics = () => {
  initBaiduMjtSDK()
  initAppsFlyerSDK()
  initSensors()
}
const initSensors = () => {
  if (Platform.OS !== 'ios') {
    sensors.enableAutoTrack()
    sensors.enableReactNativeAutoTrack()
  }
  sensors.trackInstallation('AppInstall')
}

const initBaiduMjtSDK = () => {
  let appkey =
    Client.ORIGIN.indexOf('wechat.') !== -1
      ? Platform.OS === 'ios'
        ? '142265cf0e'
        : 'c70b1d4608'
      : Platform.OS === 'ios'
      ? 'f6407eb0be'
      : '1557fd817c'
  Platform.OS === 'ios'
    ? startBaiduService('AppStore', appkey)
    : RNAnalytics.getChannel().then(channel => {
        startBaiduService(channel, appkey)
      })
}

const initAppsFlyerSDK = () => {
  if (Platform.OS === 'android') {
    appsFlyer.setCollectIMEI(true, () => {})
    appsFlyer.setCollectAndroidID(true, () => {})
  }

  const options = {
    devKey: 'H8vapYUhkpYJo53VWCBWM',
    isDebug: false
  }
  if (Platform.OS === 'ios') {
    options.appId = '1360599865'
  }
  appsFlyer.initSdk(options, () => {}, () => {})
  appsFlyer.getAppsFlyerUID(() => {})
}

const startBaiduService = (channel, appkey) => {
  RNAnalytics.start({
    appChannel: channel,
    appKey: appkey,
    isDebug: !!__DEV__,
    enableExceptionLog: !__DEV__,
    logSenderDelayed: 5,
    onlyWifi: false,
    sessionTimeOut: 30,
    sendStrategy: 'SET_TIME_INTERVAL',
    logSendInterval: 1
  })
}
const profileSet = content => {
  sensors.profileSet(content)
}
const updateSubscriptionType = subscription => {
  let subscriptionType = subscription ? subscription.display_name : '非会员'
  sensors.profileSet({ subscriptionType })
}
const profileIncrement = (key, count = 1) => {
  /*
    key 属性名  strings
    count  次数  number 支持负数
   */
  const data = {}
  data[key] = count
  sensors.profileIncrement(data)
}
export default {
  initStatistics,
  onEventDuration,
  onEvent,
  onPageEnd,
  onPageStart,
  unBindSensors,
  bindSensors,
  updateSubscriptionType,
  profileSet,
  profileIncrement,
  setSuperProperties,
  getCurrentRouteStateParams
}
