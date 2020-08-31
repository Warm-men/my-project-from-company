/* @flow */

import React from 'react'
import { inject, observer } from 'mobx-react'
import { AppState, DeviceEventEmitter, InteractionManager } from 'react-native'
import {
  SERVICE_TYPES,
  QNetwork,
  checkCookies
} from '../../expand/services/services.js'
import AuthenticationComponent from '../../components/authentication'
import HomeMember from './home_member'
import HomeNonMemberAbtesting from './home_non_member_abTesting'
import OccasionBanner from '../../../storybook/stories/alert/occasion_banner'
import dateFns from 'date-fns'
import { getNewestVersionALert } from '../../expand/tool/check_version'
import { initMipush } from '../../expand/tool/notifications'
import { initViewableItemsOnFocus } from '../../expand/tool/daq'
import ProductsOccasion from '../../request/products_occasion'

import { getSeason } from '../../request/me/season'
@inject(
  'currentCustomerStore',
  'subscriptionStore',
  'modalStore',
  'couponStore',
  'appStore',
  'popupsStore',
  'toteCartStore'
)
@observer
export default class Home extends AuthenticationComponent {
  constructor(props) {
    super(props)
    this.popudedHistory = new Date()
    this.listeners = []
    this.lastActiveTime = new Date()
  }

  onSignIn() {
    const { isPreload, popupsStore } = this.props
    this._getData()
    getSeason()
    if (!isPreload) {
      this._visibleActivity()
      this.checkTelephone()
    }
    if (!popupsStore.isPopupLoading) {
      this._getPopupData()
    } else {
      popupsStore.resetPopup()
    }

    // 检查新会员是否开衣箱
    this._checkToteStatus()
    setTimeout(() => {
      this._checkMemberStatus()
    }, 100)
  }

  onSignOut() {
    const { isSubscriber } = this.props.currentCustomerStore
    if (isSubscriber) {
      setTimeout(() => {
        this._getData()
        this._checkMemberStatus()
      }, 100)
    } else {
      this._checkMemberStatus()
    }
  }

  _checkToteStatus = () => {
    const { navigation, currentCustomerStore, modalStore } = this.props
    const {
      style,
      shippingAddress,
      subscription,
      telephone
    } = currentCustomerStore
    if (currentCustomerStore.isSubscriber) {
      if (
        (style &&
          style.top_size &&
          style.dress_size &&
          shippingAddress &&
          shippingAddress.city) ||
        (subscription && subscription.status === 'cancelled')
      ) {
      } else {
        if (modalStore.currentRoute !== 'WebPage' && telephone) {
          navigation && navigation.navigate('CreateMember')
        }
      }
    }
  }

  _checkMemberStatus = () => {
    const { isSubscriber } = this.props.currentCustomerStore

    if (isSubscriber) {
      this._home_member && this._home_member.wrappedInstance._setFlatList()
    }
  }

  componentDidMount() {
    const { appStore, isPreload, navigation } = this.props
    AppState.addEventListener('change', this._handleAppStateChange)
    this.removeMipushEventListeners = initMipush(navigation)
    this._addObservers()

    if (!isPreload) {
      getNewestVersionALert()
    }
    if (appStore.tagLogin) {
      appStore.tagLogin = false
      this.onSignIn()
    } else {
      this._getPopupData()
    }
  }

  checkTelephone = () => {
    InteractionManager.runAfterInteractions(() => {
      const { currentCustomerStore, modalStore, navigation } = this.props
      if (
        !currentCustomerStore.telephone &&
        modalStore.currentRoute !== 'BindPhone'
      ) {
        navigation && navigation.navigate('BindPhone', { isLogin: true })
      }
    })
  }

  _getPopupData = () => {
    const { updatePopups } = this.props.popupsStore
    QNetwork(SERVICE_TYPES.popups.QUERY_POPUPS, {}, response => {
      if (response.data.popups) {
        this.props.popupsStore.isPopupLoading = false
        updatePopups(response.data.popups)
        this._showPopup()
        this.popudedHistory = new Date()
      }
    })
  }

  _showPopup = () => {
    const { popupsStore, modalStore, navigation } = this.props
    if (modalStore.modalVisible) return

    popupsStore.showPopup(modalStore.currentRoute, popup => {
      if (popup) {
        modalStore.show(
          <OccasionBanner
            activityName={'Popup'}
            navigation={navigation}
            extraData={popup}
          />
        )
      }
    })
  }

  _addObservers = () => {
    // 页面状态
    if (this.props.navigation) {
      this.listeners.push(
        this.props.navigation.addListener('willFocus', () => {
          setTimeout(() => {
            this._showPopup()
          }, 500)
          initViewableItemsOnFocus(this.viewableItems)
        })
      )
    }
    this.listeners.push(
      DeviceEventEmitter.addListener('refreshHomePage', () => {
        this._getData()
        this._home_member && this._home_member.wrappedInstance._setFlatList()
        this.props.popupsStore.resetPopup()
        this._getPopupData()
        this._checkMemberStatus()
      })
    )
    this.listeners.push(
      DeviceEventEmitter.addListener('refreshHomeList', () => {
        this._checkMemberStatus()
      })
    )
    this.listeners.push(
      DeviceEventEmitter.addListener('visibleActivity', () => {
        this._visibleActivity()
      })
    )
    this.listeners.push(
      DeviceEventEmitter.addListener('refreshHomeData', () => {
        this._home_member && this._home_member.wrappedInstance._onRefresh()
      })
    )
  }

  _shouldUpdatePopup = () => {
    let differenceInHours = dateFns.differenceInHours(
      this.popudedHistory,
      new Date()
    )
    if (differenceInHours >= 24) {
      ProductsOccasion.queryClothingOccasionBanner('clothing_list_top')
      ProductsOccasion.queryClothingOccasionBanner('accessory_list_top')
      this._getPopupData()
    }
  }

  _getData = () => {
    const { isSubscriber } = this.props.currentCustomerStore
    if (isSubscriber) {
      if (this._home_member && this._home_member.wrappedInstance) {
        this._home_member.wrappedInstance._setFlatList()
      }
    } else {
      if (
        this._home_non_member_abTesting &&
        this._home_non_member_abTesting.wrappedInstance
      ) {
        this._home_non_member_abTesting.wrappedInstance._getData()
      }
    }
  }

  _visibleActivity = () => {
    const {
      modalStore,
      couponStore,
      currentCustomerStore,
      navigation
    } = this.props
    if (
      !modalStore.modalVisible &&
      modalStore.currentRoute !== 'JoinMember' &&
      modalStore.currentRoute !== 'JoinMemberList' &&
      modalStore.currentRoute !== 'BindPhone'
    ) {
      // 判断是否显示 新用户优惠券提醒
      if (!currentCustomerStore.isSubscriber) {
        if (
          couponStore.validPromoCodes &&
          couponStore.validPromoCodes.length &&
          couponStore.validPromoCodes[0].type === 'MemberPromoCode'
        ) {
          modalStore.show(
            <OccasionBanner
              activityName={'AlertPromoCode'}
              navigation={navigation}
              extraData={couponStore.validPromoCodes[0]}
            />
          )
        }
      }
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount()

    AppState.removeEventListener('change', this._handleAppStateChange)

    this.timer && clearInterval(this.timer)

    this.listeners.map(item => {
      item.remove()
    })
    this.removeMipushEventListeners && this.removeMipushEventListeners()
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      //每次app回到前台将角标设置为0
      if (this.lastActiveTime) {
        const time = new Date()
        let differenceInHours = dateFns.differenceInHours(
          time,
          this.lastActiveTime
        )
        if (differenceInHours >= 1) {
          this._getData()
          this.getCurrentCustomer()
        }
      }
      this._shouldUpdatePopup()
    } else if (nextAppState === 'background') {
      checkCookies()
    }
  }

  getCurrentCustomer = () => {
    const { currentCustomerStore, couponStore, toteCartStore } = this.props
    QNetwork(SERVICE_TYPES.me.QUERY_ME, {}, response => {
      const { me } = response.data
      if (me) {
        currentCustomerStore.updateCurrentCustomer(me)
        couponStore.updateValidCoupons(me)
        toteCartStore.updateToteCart(me.tote_cart)
      }
    })
  }

  _onViewableItems = array => {
    this.viewableItems = array
  }

  render() {
    const { navigation, currentCustomerStore } = this.props
    const { isSubscriber } = currentCustomerStore
    return isSubscriber ? (
      <HomeMember
        navigation={navigation}
        ref={home => (this._home_member = home)}
        checkMemberStatus={this._checkMemberStatus}
      />
    ) : (
      <HomeNonMemberAbtesting
        navigation={navigation}
        onViewableItems={this._onViewableItems}
        ref={home => (this._home_non_member_abTesting = home)}
      />
    )
  }
}
