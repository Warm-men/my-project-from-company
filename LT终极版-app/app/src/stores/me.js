import { observable, action } from 'mobx'
import { persist } from 'mobx-persist'
import { Platform } from 'react-native'
// eslint-disable-next-line
import CookieManager from 'react-native-cookies'
import Authentication from '../expand/tool/authentication'
import { Client } from '../expand/services/client.js'
import Statistics from '../expand/tool/statistics'
import dateFns from 'date-fns'
import { customerLogin } from '../expand/tool/login/index.js'
import _ from 'lodash'
import Stores from './stores'

class CurrentCustomerStore {
  @observable loginModalVisible = false
  @observable enableAutoTrack = false
  @persist
  @observable
  id = null
  @persist
  @observable
  nickname = null
  @persist
  @observable
  email = null
  @persist
  @observable
  avatarUrl = null
  @persist
  @observable
  telephone = null
  @persist('object')
  @observable
  referralBanner = null
  @persist
  @observable
  referralUrl = null
  @persist
  @observable
  referralSenderAmount = null
  //是否显示购物车入口
  @persist
  @observable
  displayCartEntry = false

  //会员套餐列表
  @observable currentSubscriptionTypeItems = [] //个人可以开通的所有套餐
  //会员身份
  @persist('list')
  @observable
  roles = []

  @observable available_purchase_credit = null
  //芝麻信用
  @persist('list')
  @observable
  creditScores = []

  @persist('object')
  @observable
  subscription = null

  @persist
  @observable
  subscription_fees_count = 0

  @observable subscriptionUpdateTime = 0

  @persist('object', ShippingAddress)
  @observable
  shippingAddress = new ShippingAddress()

  //本地收货地址
  @persist('list')
  @observable
  localShippingAddresses = []

  @persist('object', HttpCookie)
  @observable
  cookie = null

  //用户会员状态
  @persist
  @observable
  isValidSubscriber = false
  @persist
  @observable
  isExpiredSubscriber = false
  @persist
  @observable
  isSubscriber = false
  @persist
  @observable
  expiresInDays = 0
  @persist
  @observable
  subscriptionDate = ''
  @persist
  @observable
  canViewNewestProducts = false

  //style
  @persist('object')
  @observable
  style = {}
  @observable product_filters = {}

  @persist('list')
  @observable
  attribute_preferences = []

  @persist('list')
  @observable
  enablePaymentContract = []

  //活动
  @persist('list')
  @observable
  activities = []

  @persist
  @observable
  latestActivitiyShowTime = null
  //夏日活动
  @persist // 有夏日计划活动
  @observable
  hasSummerPlan = false

  @persist // 加入夏日计划
  @observable
  inSummerPlan = false

  @persist // 是否提醒客户开启智能选码
  @observable
  isRemindedWithSizeFilter = null

  @persist // 用户是否已经开启智能选码
  @observable
  productsSizeFilter = null

  @persist('object') // 用户自在选
  @observable
  freeService = null

  //不喜欢
  @persist('list')
  @observable
  clothing_categories = []
  @persist('list')
  @observable
  accessory_categories = []
  @persist('list')
  @observable
  clothing_colors = []
  @persist('list')
  @observable
  prints = []

  @persist hasTopic = false

  @persist('object')
  @observable
  lastShowGuideViewTime = null

  @persist
  @observable
  balance = null

  @persist
  @observable
  shareGuideViewCount = 0

  @persist
  @observable
  finishedOnboardingQuestions = null

  //用户首个衣箱是否已经签收
  @persist
  @observable
  firstDeliveredTote = false

  //用户首两次评价
  @persist
  @observable
  firstCustomerPhotoIncentive = false

  //用户首两次评价
  @persist('object')
  @observable
  customerPhotoIncentiveDetail = null

  @observable
  unreadCustomerPhotoReview = false

  @persist
  @observable
  lockedToteCount = null
  //是否为首月会员
  @observable
  inFirstMonthAndMonthlySubscriber = null
  //晒单个人中心数据
  @persist('object')
  @observable
  customer_photo = {}

  @persist('object')
  @observable
  season_sort_switch = {
    options: [],
    selected_option: null
  }

  @persist
  @observable
  season_change_prompt = null

  @action
  updateSeasonSortSwitch = (season_sort_switch, season_change_prompt) => {
    const { options, selected_option } = season_sort_switch
    this.season_sort_switch.options = options
      ? season_sort_switch.options.reverse()
      : []
    this.season_sort_switch.selected_option = selected_option
    this.season_change_prompt = season_change_prompt.option
  }

  @action
  resetCustomerPhotoIncentiveDetail = () => {
    this.customerPhotoIncentiveDetail = null
  }

  @action
  updateLastShowGuideViewTime = time => {
    this.lastShowGuideViewTime = time
  }

  @action
  updateShareGuideViewCount = () => {
    this.shareGuideViewCount = this.shareGuideViewCount + 1
  }
  @action
  resetShareGuideViewCount = () => {
    this.shareGuideViewCount = 1
  }

  @action
  updateTopic = hasTopic => {
    this.hasTopic = hasTopic
  }
  @action
  setCustomerProductFilters = data => {
    if (data) {
      this.clothing_categories = data.clothing_categories
      this.accessory_categories = data.accessory_categories
      this.clothing_colors = data.clothing_colors
      this.prints = data.prints
    } else {
      this.clothing_categories = []
      this.accessory_categories = []
      this.clothing_colors = []
      this.prints = []
    }
  }
  @observable loginModalAction = null
  @action
  setLoginModalVisible = (isVisible, action) => {
    const { isOpenJverification, isPreLoginSuccess } = Stores.appStore
    if (isOpenJverification && isPreLoginSuccess && Platform.OS === 'ios') {
      this.throttle()
    } else {
      this.setVerificationCodeModalVisible(isVisible)
    }
    this.loginModalAction = action
  }
  throttle = _.throttle(customerLogin, 3000, {
    leading: true
  })

  //1显示本机登入按钮 2 弹Toast
  @observable isShowLocalNumber = false
  //验证码登入
  @action
  setVerificationCodeModalVisible = (isVisible, isShowLocalNumber) => {
    if (this.loginModalVisible !== isVisible) {
      this.loginModalVisible = !!isVisible
      isVisible
        ? Statistics.onEvent({
            id: 'show_signin',
            label: '打开登入界面',
            attributes: { type: '普通登入界面' }
          })
        : Statistics.onEvent({
            id: 'dismiss_signin',
            label: '关闭登入界面',
            attributes: { type: '普通登入界面' }
          })
    }
    this.isShowLocalNumber = !!isShowLocalNumber
  }

  @action
  updateProductFilters = filters => {
    this.product_filters = filters
  }

  @action
  updateContract = contract => {
    this.enablePaymentContract = contract
  }

  //判断基本尺码是否填写完成
  @action
  hasStylesForRecommend = () => {
    const { bra_size, height_inches, weight, bust_size_number } = this.style
    return (!!bust_size_number || !!bra_size) && !!height_inches && !!weight
  }

  //判断尺码信息是否填写完整
  @action
  hasCompleteSizes = object => {
    let data = {
      height_inches: this.style.height_inches,
      weight: this.style.weight,
      bust_size_number: this.style.bust_size_number,
      shoulder_size: this.style.shoulder_size,
      waist_size: this.style.waist_size,
      hip_size_inches: this.style.hip_size_inches,
      inseam: this.style.inseam,
      shape: this.style.shape
    }
    if (object) {
      data = { ...data, ...object }
    }
    let empty = true
    for (var key in data) {
      if (empty && data.hasOwnProperty(key) && !data[key]) {
        empty = false
      }
    }
    return empty
  }

  @action
  updateTerseMe = me => {
    this.email = me.email
    this.nickname = me.nickname
    this.avatarUrl = me.avatar_url
    this.telephone = me.telephone
    this.creditScores = me.credit_scores
  }

  @action
  updateStyle = style => {
    this.style = { ...this.style, ...style }
  }

  @action
  updateCurrentCustomer = me => {
    this.setMipushInfo(me)
    this.bindSensors(me)
    this.enableAutoTrack = me.rpmetric
    this.checkActivities(me.activities)
    this.updateCurrentCustomerSubscription(me)
    this.style = { ...this.style, ...me.style }
    this.attribute_preferences = me.attribute_preferences
      ? me.attribute_preferences
      : []
    this.email = me.email
    this.nickname = me.nickname
    this.avatarUrl = me.avatar_url
    this.telephone = me.telephone
    this.creditScores = me.credit_scores
    this.available_purchase_credit = me.available_purchase_credit
    const currentShippingAddress = this.shippingAddress
      ? { ...this.shippingAddress }
      : null
    this.shippingAddress = me.shipping_address
    this.displayCartEntry = me.display_cart_entry
    this.subscription_fees_count = me.subscription_fees_count
    this.id = me.id
    this.roles = me.roles
    this.enablePaymentContract = me.enable_payment_contract
    this.isRemindedWithSizeFilter = me.is_reminded_with_size_filter
    this.productsSizeFilter = me.products_size_filter
    this.referralBanner = me.referral_banner
    this.referralUrl = me.referral_url
    this.freeService = me.free_service
    this.balance = me.credit_account.balance
    this.firstDeliveredTote = me.first_delivered_tote
    this.customer_photo = me.customer_photo
    if (me.active_referral_program) {
      this.referralSenderAmount = me.active_referral_program.sender_amount
    }
    this.finishedOnboardingQuestions = me.finished_onboarding_questions
    if (me === null) {
      CookieManager.clearAll().then(() => {
        this.cookie = null
      })
    } else {
      if (Platform.OS === 'ios') {
        CookieManager.getAll().then(result => {
          this.saveCookie(result)
        })
      } else {
        CookieManager.get(Client.ORIGIN).then(result => {
          this.saveCookie(result)
        })
      }
    }

    if (me.shipping_address) {
      let newShippingAddress = me.shipping_address
      let localShippingAddress = currentShippingAddress
      newShippingAddress = { ...newShippingAddress }
      newShippingAddress.isSelected = true
      if (!localShippingAddress) {
        //本地没有保存远端地址
        this.localShippingAddresses = [
          newShippingAddress,
          ...this.localShippingAddresses
        ]
      } else if (
        newShippingAddress.address_1 !== localShippingAddress.address_1 ||
        newShippingAddress.city !== localShippingAddress.city ||
        newShippingAddress.state !== localShippingAddress.state ||
        newShippingAddress.district !== localShippingAddress.district ||
        newShippingAddress.full_name !== localShippingAddress.full_name ||
        newShippingAddress.telephone !== localShippingAddress.telephone
      ) {
        //本地保存的远端地址和请求回来的不同
        if (
          this.localShippingAddresses.length !== 0 &&
          me.shipping_address.address_1
        ) {
          const localAddressIndex = this.localShippingAddresses.findIndex(
            function(item) {
              return item.isSelected
            }
          )
          if (localAddressIndex > -1) {
            this.localShippingAddresses[localAddressIndex] = newShippingAddress
            this.localShippingAddresses = [...this.localShippingAddresses]
          } else {
            this.localShippingAddresses = [
              newShippingAddress,
              ...this.localShippingAddresses
            ]
          }
        } else if (me.shipping_address.address_1) {
          this.localShippingAddresses = [
            newShippingAddress,
            ...this.localShippingAddresses
          ]
        }
      }
    }
  }

  @action
  updateAvailablePurchaseCredit = available_purchase_credit => {
    this.available_purchase_credit = available_purchase_credit
  }

  @action
  updateCurrentCustomerSubscription = me => {
    let subscription = me.subscription
      ? { ...this.subscription, ...me.subscription }
      : null
    this.subscription = subscription
    const authentication = Authentication(me)
    this.isSubscriber = authentication.isSubscriber
    this.isValidSubscriber = authentication.isValidSubscriber
    this.isExpiredSubscriber = authentication.isExpiredSubscriber
    this.expiresInDays = authentication.expiresInDays
    this.subscriptionDate = authentication.subscriptionDate
    this.subscriptionUpdateTime = new Date().getTime()
    this.checkUserStatusInActivities(subscription)
    this.customerPhotoIncentiveDetail = me.customer_photo_incentive_detail
    this.lockedToteCount = me.locked_tote_count
    this.unreadCustomerPhotoReview = me.unread_customer_photo_review
    this.freeService = me.free_service
    this.inFirstMonthAndMonthlySubscriber =
      me.in_first_month_and_monthly_subscriber

    if (me.can_view_newest_products !== undefined) {
      this.canViewNewestProducts = me.can_view_newest_products
    }
  }

  @action
  updateSubscriptionType = subscription_type => {
    if (subscription_type && this.subscription) {
      let subscription = { ...this.subscription, subscription_type }
      this.subscription = subscription
    }
  }

  @action
  updateFastShippingStatus = fastShipping => {
    if (fastShipping) {
      const fast_shipping = fastShipping
      let subscription = { ...this.subscription, fast_shipping }
      this.subscription = subscription
    }
  }
  @action
  updateContractDisplay = contract_display => {
    if (contract_display) {
      let subscription = { ...this.subscription, contract_display }
      this.subscription = subscription
    }
  }
  @action
  updateAutoChargeManagementPage = auto_charge_management_page => {
    if (auto_charge_management_page) {
      let subscription = { ...this.subscription, auto_charge_management_page }
      this.subscription = subscription
    }
  }

  @action
  updateFreeService = free_service => {
    this.freeService = free_service
  }

  @action
  updateTelephone = telephone => {
    this.telephone = telephone
  }
  @action
  updateNickName = nickname => {
    this.nickname = nickname
  }
  @action
  updateBalance = balance => {
    this.balance = balance
  }
  @action
  checkActivities = activities => {
    const data = activities ? activities : []
    this.activities = data
    const summerPlan = data.find(function(activity) {
      return activity === 'summer_plan'
    })
    // 有没有夏日活动
    this.hasSummerPlan = !!summerPlan
  }
  checkUserStatusInActivities = subscription => {
    if (subscription) {
      this.inSummerPlan = subscription.summer_plan
    } else {
      this.inSummerPlan = false
    }
  }

  @action
  signOut = () => {
    this.unSetMipushInfo()
    this.unBindSensors()
    this.enableAutoTrack = false
    this.id = null
    this.roles = []
    this.email = null
    this.nickname = null
    this.avatarUrl = null
    this.telephone = null
    this.creditScores = []
    this.subscription = null
    this.shippingAddress = null
    this.localShippingAddresses = []
    this.isSubscriber = false
    this.isValidSubscriber = false
    this.isExpiredSubscriber = false
    this.expiresInDays = 0
    this.subscriptionDate = ''
    this.style = {}
    this.activities = []
    this.inSummerPlan = false
    this.hasSummerPlan = false
    this.latestActivitiyShowTime = null
    CookieManager.clearAll().then(() => {})
    this.cookie = null
    this.clothing_categories = []
    this.accessory_categories = []
    this.clothing_colors = []
    this.prints = []
    this.attribute_preferences = []
    this.enablePaymentContract = []
    this.canViewNewestProducts = false
    this.productsSizeFilter = null
    this.isRemindedWithSizeFilter = null
    this.referralBanner = null
    this.referralUrl = null
    this.referralSenderAmount = null
    this.finishedOnboardingQuestions = null
    this.freeService = null
    this.balance = null
    this.displayCartEntry = false
    this.subscription_fees_count = 0
    this.firstDeliveredTote = false
    this.firstCustomerPhotoIncentive = false
    this.customerPhotoIncentiveDetail = null
    this.lockedToteCount = null
    this.unreadCustomerPhotoReview = false
    this.inFirstMonthAndMonthlySubscriber = null
    this.customer_photo = {}
    this.season_sort_switch = {
      options: [],
      selected_option: null
    }
    this.season_change_prompt = null
  }

  @action
  getCookies = () => {
    if (Platform.OS === 'ios') {
      CookieManager.getAll().then(result => {
        this.saveCookie(result)
      })
    } else {
      CookieManager.get(Client.ORIGIN).then(result => {
        this.saveCookie(result)
      })
    }
  }

  @action
  setCookie = (success, failure) => {
    if (this.cookie && this.cookie.value) {
      if (Platform.OS === 'ios') {
        CookieManager.set({ ...this.cookie }).then(() => {
          success()
        })
      } else {
        var value = ''
        for (var key in this.cookie) {
          value = value + ';' + '' + key + '=' + this.cookie[key]
        }
        CookieManager.setFromResponse(Client.ORIGIN, value).then(result => {
          // `res` will be true or false depending on success.
          result ? success() : failure()
        })
      }
    } else {
      failure()
    }
  }
  @action
  saveCookie = result => {
    if (!result) {
      return
    }
    const { _letote_session } = result
    if (_letote_session) {
      if (this.cookie && this.cookie.value === _letote_session.value) {
        return
      }
      let newCookie = new HttpCookie()
      newCookie.domain = _letote_session.domain
      newCookie.path = _letote_session.path
      newCookie.name = _letote_session.name
      newCookie.value = _letote_session.value

      this.cookie = newCookie
    }
  }

  @action
  selectShippingAddress = (newShippingAddress, addressIndex) => {
    newShippingAddress.isSelected = true
    const isSelectedIndex = this.localShippingAddresses.findIndex(function(
      shippingAddress
    ) {
      return shippingAddress.isSelected
    })

    if (isSelectedIndex > -1) {
      this.localShippingAddresses[isSelectedIndex].isSelected = false
    }
    this.localShippingAddresses[addressIndex] = newShippingAddress
    this.localShippingAddresses = [...this.localShippingAddresses]
  }

  @action
  updateShippingAddress = newShippingAddress => {
    this.shippingAddress = { ...newShippingAddress }
  }

  @action
  editShippingAddress = (shippingAddress, addressIndex) => {
    this.localShippingAddresses.splice(addressIndex, 1, shippingAddress)
    this.localShippingAddresses = [...this.localShippingAddresses]
  }

  @action
  addToLocalShippingAddresses = addShippingAddress => {
    if (addShippingAddress.isSelected) {
      const isSelectedIndex = this.localShippingAddresses.findIndex(function(
        shippingAddress
      ) {
        return shippingAddress.isSelected
      })
      if (isSelectedIndex > -1) {
        this.localShippingAddresses[isSelectedIndex].isSelected = false
      }
    }
    this.localShippingAddresses = [
      ...this.localShippingAddresses,
      addShippingAddress
    ]
  }

  @action
  deleteShippingAddress = addressIndex => {
    this.localShippingAddresses.splice(addressIndex, 1)
    this.localShippingAddresses = [...this.localShippingAddresses]
  }
  setMipushInfo = me => {
    if (me.id)
      if (this.id !== me.id) {
        try {
          this.MIPush = require('react-native-letote-xmpush')
          this.MIPush.setAlias(me.id)
          this.MIPush.getAllTopic().then(data => {
            data &&
              data.map(item => {
                this.MIPush.unsubscribe(item)
              })
          })
        } catch (e) {}
      }
  }
  unSetMipushInfo = () => {
    try {
      this.MIPush = require('react-native-letote-xmpush')
      this.MIPush.unsetAlias(this.id)
      const date = new Date()
      this.MIPush.subscribe('anon_' + dateFns.format(date, 'YYYYMMDD'))
      this.MIPush.subscribe(
        'anon_' + dateFns.format(date, 'YYYY') + dateFns.format(date, 'WW')
      )
      this.updateTopic(true)
    } catch (e) {}
  }
  bindSensors = user => {
    Statistics.bindSensors(user)
  }
  unBindSensors = () => {
    Statistics.unBindSensors()
  }
}

class HttpCookie {
  @persist
  @observable
  domain = null

  @persist
  @observable
  name = null

  @persist
  @observable
  value = null

  @observable origin = Client.ORIGIN
  @observable version = '1'
  @observable expiration = '2020-05-30T12:30:00.00-05:00'

  @persist
  @observable
  path = null
}

class ShippingAddress {
  @persist
  @observable
  address_1 = null
  @persist
  @observable
  address_2 = null
  @persist
  @observable
  city = null
  @persist
  @observable
  company = null
  @persist
  @observable
  country = null
  @persist
  @observable
  customer_id = null
  @persist
  @observable
  district = null
  @persist
  @observable
  full_name = null
  @persist
  @observable
  id = null
  @persist
  @observable
  state = null
  @persist
  @observable
  telephone = null
  @persist
  @observable
  verified = null
  @persist
  @observable
  zip_code = null
}

export default new CurrentCustomerStore()
