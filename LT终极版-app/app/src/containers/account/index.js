/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, Animated, Dimensions, Platform } from 'react-native'
import { inject, observer } from 'mobx-react'
import { NavigationBar } from '../../../storybook/stories/navigationbar'
import {
  Mutate,
  SERVICE_TYPES,
  resetQueriseStore
} from '../../expand/services/services'
import Statistics from '../../expand/tool/statistics'
import {
  SizeAndStylesCard,
  UserProfileCard
} from '../../../storybook/stories/account'

import CouponAndPromoCode from '../../../storybook/stories/account/coupon_and_promocode'
import LinkText from '../../../storybook/stories/link_text'
import p2d from '../../expand/tool/p2d'
import Udesk from '../../expand/tool/udesk'
import OccasionBanner from '../../../storybook/stories/alert/occasion_banner'
import ReferralBanner from '../../../storybook/stories/account/referral_banner'
import { updateFreeService } from '../../expand/tool/free_service'
import { onSignOut } from '../../expand/tool/login'
import { onClickJoinMember } from '../../expand/tool/plans/join_member'

@inject(
  'currentCustomerStore',
  'ordersStore',
  'appStore',
  'couponStore',
  'popupsStore',
  'modalStore'
)
@observer
class Account extends Component {
  constructor(props) {
    super(props)
    this.state = { navigationBarOpacity: 0, scrollEventThrottle: 1 }
    this.scrollY = new Animated.Value(0)
    this.animatedViewHeight = 50
    this.listeners = []
  }

  getColumnsItems = type => {
    const { ordersStore, currentCustomerStore } = this.props
    switch (type) {
      case 'styles':
        return [
          {
            image: require('../../../assets/images/account/account_size.png'),
            type: '尺码',
            onPress: this._visitSizeInformation
          },
          {
            image: require('../../../assets/images/account/account_occation.png'),
            type: '场合',
            onPress: this.goScene
          },
          {
            image: require('../../../assets/images/account/account_like.png'),
            type: '喜欢',
            onPress: this.goLike
          },
          {
            image: require('../../../assets/images/account/account_dislike.png'),
            type: '不喜欢',
            onPress: this.goUnlike
          }
        ]
        break
      case 'common': {
        const havePendingPayment =
          ordersStore.orders && !!ordersStore.orders.length
        return [
          {
            image: require('../../../assets/images/account/pending_payment.png'),
            type: '待付款',
            onPress: this._openPaymentPending,
            badge: havePendingPayment
          },
          {
            image: require('../../../assets/images/account/camera.png'),
            type: '晒单',
            onPress: this._myCustomerPhotos,
            bubble:
              currentCustomerStore.customerPhotoIncentiveDetail &&
              currentCustomerStore.customerPhotoIncentiveDetail.incentive_hint
          },
          {
            image: require('../../../assets/images/account/location_pin.png'),
            type: '我的地址',
            onPress: this._customerAddress
          }
        ]
      }
      case 'service': {
        const {
          enablePaymentContract,
          subscription,
          freeService
        } = currentCustomerStore
        const isContarcted = !!enablePaymentContract.length
        const menuDisplay =
          subscription &&
          subscription.contract_display &&
          subscription.contract_display.menu_display
        const displayContract = isContarcted || menuDisplay
        const items = [
          {
            image: require('../../../assets/images/account/redeem.png'),
            type: '会员卡兑换',
            onPress: this._redeemCode
          },
          {
            image: require('../../../assets/images/account/contract.png'),
            type: '免密管理',
            onPress: this._openCustomerContract
          },
          {
            image: require('../../../assets/images/account/free_service.png'),
            type: '自在选',
            onPress: this._openFreeService
          },
          {
            image: require('../../../assets/images/account/question.png'),
            type: '常见问题',
            onPress: this._faq
          },
          {
            image: require('../../../assets/images/account/earphones_alt.png'),
            type: '联系客服',
            onPress: this._customerService
          },
          {
            image: require('../../../assets/images/account/info.png'),
            type: '关于我们',
            onPress: this._aboutUs
          }
        ]
        if (!freeService || !freeService.account_entrance) {
          items.splice(2, 1)
        }
        if (!displayContract) {
          items.splice(1, 1)
        }
        return items
      }
    }
  }
  componentDidMount() {
    this.scrollY.addListener(({ value }) => {
      const hiddenContentOffsetY = (this.animatedViewHeight * 3) / 4
      if (
        value > this.animatedViewHeight &&
        this.state.navigationBarOpacity !== 1
      ) {
        this.setState({
          navigationBarOpacity: 1,
          scrollEventThrottle: 16
        })
      } else if (
        value <= this.animatedViewHeight &&
        value >= hiddenContentOffsetY
      ) {
        this.setState({
          scrollEventThrottle: 16,
          navigationBarOpacity:
            (value - hiddenContentOffsetY) /
            (this.animatedViewHeight - hiddenContentOffsetY)
        })
      } else if (
        value < hiddenContentOffsetY &&
        this.state.navigationBarOpacity !== 0
      ) {
        this.setState({
          navigationBarOpacity: 0,
          scrollEventThrottle: 1
        })
      }
    })
    // 页面状态
    this.listeners.push(
      this.props.navigation.addListener('willFocus', () => {
        this._showPopup()
      })
    )
  }
  componentWillUnmount() {
    this.listeners.map(item => {
      item.remove()
    })
  }

  _signOutCustomer = () => {
    Mutate(SERVICE_TYPES.me.MUTATION_SIGNOUT, {})
    //TODO Refined the logic to sign customer out, we should not wait network sign-out anyway.
    setTimeout(() => {
      resetQueriseStore(() => {
        const { appStore } = this.props
        appStore.signOut()
        onSignOut()
        Statistics.onPageEnd('UserProfile')
        Statistics.onPageStart('Guide')
      })
    }, 1000)
  }

  _signInCustomer = () => {
    this.props.currentCustomerStore.setLoginModalVisible(true)
  }

  _showPopup = () => {
    const { popupsStore, modalStore, navigation } = this.props
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

  _joinMember = () => {
    const { navigation } = this.props
    onClickJoinMember(navigation)
    navigation.navigate('JoinMember')
  }
  _customerAddress = () => {
    this.props.navigation.navigate('ShippingAddress', {
      isSelectAddress: false
    })
  }
  _myCustomerPhotos = () => {
    const { navigation, currentCustomerStore } = this.props
    const { id, customerPhotoIncentiveDetail } = currentCustomerStore
    if (id) {
      if (customerPhotoIncentiveDetail) {
        navigation.navigate('WebPage', {
          uri: customerPhotoIncentiveDetail.link_url,
          hideShareButton: true,
          replace: true
        })
      } else navigation.navigate('MyCustomerPhotos')
    } else {
      this._signInCustomer()
    }
    Statistics.onEvent({
      id: 'photos_button_in_account',
      label: '点击个人中心晒单按钮',
      attributes: {
        buttonText: customerPhotoIncentiveDetail
          ? customerPhotoIncentiveDetail.incentive_hint
          : '晒单按钮'
      }
    })
  }
  _openPaymentPending = () => {
    this.props.navigation.navigate('PaymentPending')
  }
  _faq = () => {
    this.props.navigation.navigate('Helper')
  }
  _aboutUs = () => {
    this.props.navigation.navigate('AboutUs')
  }
  _customerBonus = () => {
    this.props.navigation.navigate('CreditAccount')
  }
  _customerService = () => {
    const { currentCustomerStore, appStore } = this.props
    let customer = {}
    if (currentCustomerStore.id) {
      customer.nickname = currentCustomerStore.nickname
      customer.id = currentCustomerStore.id
    } else {
      customer.nick_name = ''
      customer.id = appStore.getGUID()
    }

    Udesk.updateCustomer(customer)
    Udesk.entryChat()
  }

  _openCustomerContract = () => {
    this.props.navigation.navigate('Contract')
  }

  _openFreeService = async () => {
    const {
      navigation: { navigate },
      currentCustomerStore
    } = this.props
    await updateFreeService()
    let state
    if (currentCustomerStore.freeService) {
      state = currentCustomerStore.freeService.state
      if (state === 'active') {
        navigate('FreeServiceActive')
      } else if (state === 'apply_refund' || state === 'approved') {
        navigate('RefundingFreeService')
      } else {
        navigate('OpenFreeService')
      }
    }
  }
  _openUserProfile = () => {
    const { currentCustomerStore } = this.props

    this.props.navigation.navigate('UserProfile', {
      currentCustomerStore,
      signOutCustomer: this._signOutCustomer
    })
  }

  _redeemCode = () => {
    if (this.props.currentCustomerStore.id) {
      this.props.navigation.navigate('RedeemInput')
    } else {
      this._signInCustomer()
    }
  }

  _visitSizeInformation = () => {
    this.props.navigation.navigate('StyleAndSize')
  }

  goUnlike = () => {
    this.props.navigation.navigate('Unlike')
  }

  _goReferral = () => {
    if (this.props.currentCustomerStore.id) {
      this.props.navigation.navigate('Referral')
    } else {
      this._signInCustomer()
    }
  }

  goScene = () => {
    this.props.navigation.navigate('Scene')
  }

  goLike = () => {
    this.props.navigation.navigate('Like')
  }

  coupon = () => {
    this.props.navigation.navigate('Coupon')
  }

  render() {
    const { currentCustomerStore, couponStore } = this.props
    const {
      isSubscriber,
      subscriptionDate,
      id,
      isValidSubscriber,
      subscription,
      nickname,
      telephone,
      avatarUrl,
      referralBanner,
      balance,
      roles
    } = currentCustomerStore
    const isStylist = !!roles.find(item => {
      return item.type === 'stylist'
    })
    const validCouponAndValidPromoCodes = couponStore.validPromoCodes.concat(
      couponStore.validCoupons
    )

    const myServices = this.getColumnsItems('service')
    const myStyles = this.getColumnsItems('styles')
    const myCommon = this.getColumnsItems('common')
    const screenH = Dimensions.get('window').height
    const isIphoneX = Platform.OS === 'ios' && screenH >= 812
    return (
      <View style={styles.safeAreaView}>
        <NavigationBar
          style={[
            styles.navigationBar,
            {
              backgroundColor: `rgba(255, 255, 255, ${
                this.state.navigationBarOpacity
              })`
            },
            isIphoneX && { height: 44 }
          ]}
        />
        <Animated.ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={this.state.scrollEventThrottle}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            {
              useNativeDriver: true,
              isInteraction: false
            }
          )}
          style={styles.scrollView}>
          <UserProfileCard
            testID="userCenter"
            isStylist={isStylist}
            nickname={nickname}
            telephone={telephone}
            avatarUrl={avatarUrl}
            id={id}
            isSubscriber={isSubscriber}
            subscription={subscription}
            signInCustomer={this._signInCustomer}
            joinMember={this._joinMember}
            openUserProfile={this._openUserProfile}
            subscriptionDate={subscriptionDate}
            isValidSubscriber={isValidSubscriber}
          />
          {id && (
            <CouponAndPromoCode
              balance={balance}
              promoCode={validCouponAndValidPromoCodes.length}
              coupon={this.coupon}
              customerBonus={this._customerBonus}
            />
          )}
          <ReferralBanner
            referralBanner={referralBanner}
            onPress={this._goReferral}
            column={'account'}
            disabled={false}
          />
          <View style={styles.dividingLine} />
          <SizeAndStylesCard
            param={myStyles}
            title={'风格档案'}
            name={'YOUR STYLE'}
          />
          <SizeAndStylesCard
            param={myCommon}
            title={'常用功能'}
            name={'COMMON'}
          />
          <SizeAndStylesCard
            param={myServices}
            title={'我的服务'}
            name={'MY SERVICE'}
          />
          <View style={styles.customerServiceNumberView}>
            <LinkText style={styles.message}>客服电话： 400-807-0088</LinkText>
          </View>
        </Animated.ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  scrollView: {
    backgroundColor: '#F7F7F7'
  },
  navigationBar: {
    position: 'absolute',
    borderBottomWidth: 0,
    zIndex: 1,
    top: 0,
    height: 20
  },
  referralView: {
    paddingLeft: p2d(20),
    paddingRight: p2d(20),
    paddingBottom: p2d(24),
    borderBottomColor: '#f7f7f7',
    borderBottomWidth: 7,
    backgroundColor: '#FFF'
  },
  settingsView: {
    borderBottomColor: '#f7f7f7',
    borderBottomWidth: 7
  },
  customerServiceNumberView: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
    flex: 1
  },
  message: {
    fontWeight: '400',
    fontSize: 12,
    color: '#CFCFCF',
    letterSpacing: 0.82,
    lineHeight: 15,
    fontWeight: '400'
  },
  listItem: {
    height: 55,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  line: {
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1
  },
  listTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  listTitleText: {
    fontWeight: '400',
    fontSize: 13,
    color: '#666',
    marginLeft: 15
  },
  dividingLine: {
    backgroundColor: '#F7F7F7',
    height: 7,
    flex: 1
  }
})

export default Account
