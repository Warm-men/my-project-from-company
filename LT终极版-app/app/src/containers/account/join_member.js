import React, { Component } from 'react'
import {
  View,
  DeviceEventEmitter,
  AppState,
  StyleSheet,
  ActivityIndicator
} from 'react-native'
import dateFns from 'date-fns'
import { QNetwork, SERVICE_TYPES, GET } from '../../expand/services/services'
import pay, { enableCustomerContract } from '../../expand/tool/payment'
import { inject, observer } from 'mobx-react'
import SubscriptionItem from '../../../storybook/stories/account/join_member/subscription_type_item'
import Statistics from '../../expand/statistics'
import { PenddingSuccess } from '../../../storybook/stories/plans'
import MultipleJoinMember from '../../../storybook/stories/account/join_member/multiple_join_member'
import Feed from '../../../storybook/stories/account/join_member/feed'
import SingleJoinMember from '../../../storybook/stories/account/join_member/single_join_member'
import _ from 'lodash'
import QuitAlert from '../../../storybook/stories/alert/quit_alert'
import { queryMePayContract } from '../../expand/tool/query_contract_pay_helper'
import { abTrack, Experiment, Variant } from '../../components/ab_testing'
@inject(
  'currentCustomerStore',
  'couponStore',
  'subscriptionStore',
  'appStore',
  'totesStore',
  'modalStore',
  'toteCartStore'
)
@observer
export default class JoinMemberContainer extends Component {
  constructor(props) {
    super(props)
    const { subscriptionStore, currentCustomerStore } = props
    const { subscriptionGroups } = subscriptionStore
    const {
      subscriptionDate,
      isSubscriber,
      canViewNewestProducts,
      subscription,
      enablePaymentContract
    } = currentCustomerStore
    this.state = {
      loadingModalVisible: true,
      nowCoupon: null,
      allAvailablePurchaseCredit: 0,
      allPromoCodes: [],
      nowPlan: null,
      pupVisible: false,
      groupsIndex: 0,
      nowGroup: [],
      quitPlanData: null,
      subscriptionGroups,
      price: null,
      cashPrice: 0,
      autoRenewDiscount: 0,
      autoRenewDiscountHint: null,
      subscription_pay_feeds: []
    }
    this.isPay = false
    this.payResult = null
    this.payType = 'wechat_native'
    this.isPaymentSucceed = false
    //标记会员的历史状态
    this.lastTime = subscriptionDate
    this.initialData = { isSubscriber, canViewNewestProducts }
    if (subscription) {
      this.initialData.subscription = { ...subscription }
    }
    this.debounce = _.debounce(this.getCurrentCustomer, 2000, {
      leading: true,
      trailing: false,
      maxwait: 2000
    })

    //首月6+4会员的第一次续费成功的问卷
    this.extendSuccessQuiz = null
    //是否勾选了连续续费
    this.isSelectedFreeService = !enablePaymentContract.length ? true : false
    this.clickedWechatContract = false
  }
  componentDidMount() {
    this.getCouponList()
    this.getSubscriptionTypes()
    this.getAvailablePurchaseCredit()
    const newSubscriber = this.isFirstTimeSubscription()
    if (newSubscriber) {
      this._getPayFeeds()
    }
    AppState.addEventListener('change', this._handleAppStateChange)
    DeviceEventEmitter.addListener('onRefreshJoinMember', showModal => {
      // this.getCurrentSubscriptionTypePreview()
      this.getSubscriptionTypes(showModal)
    })
    this._getQuitPlanData()
    this._getExtendSuccessQuiz()
  }

  componentWillUnmount() {
    this.loopTimer && clearTimeout(this.loopTimer)
    this.payTimer && clearTimeout(this.payTimer)
    AppState.removeEventListener('change', this._handleAppStateChange)
    DeviceEventEmitter.removeAllListeners('onRefreshJoinMember')
    this._checkoutPop()
  }

  _checkoutPop = () => {
    const newSubscriber = this.isFirstTimeSubscription()
    if (newSubscriber && !this.finishPayment && !this.isShowQuitPlanPop) {
      this._showQuitPlanPop()
    }
  }

  _getQuitPlanData = () => {
    GET(SERVICE_TYPES.questionnaire.FETCH_QUIT_PLAN, {}, response => {
      if (response) {
        this.setState({ quitPlanData: response })
      }
    })
  }

  _getPayFeeds = () => {
    QNetwork(SERVICE_TYPES.quiz.QUERY_PAY_FEEDS, {}, response => {
      const { subscription_pay_feeds } = response.data
      this.setState({ subscription_pay_feeds })
    })
  }

  _getExtendSuccessQuiz = () => {
    const { currentCustomerStore } = this.props
    const {
      subscription_fees_count,
      subscription,
      isValidSubscriber
    } = currentCustomerStore
    if (
      subscription_fees_count === 1 &&
      isValidSubscriber &&
      subscription.subscription_type.id == 18
    ) {
      const input = { slug: 'QUIZSubscribeSuccess' }
      QNetwork(SERVICE_TYPES.quiz.QUERY_QUIZ, input, response => {
        this.extendSuccessQuiz = response.data.quiz
      })
    }
  }

  _showQuitPlanPop = () => {
    const { navigation, modalStore } = this.props
    const { quitPlanData } = this.state
    this.isShowQuitPlanPop = true
    quitPlanData &&
      modalStore.show(<QuitAlert navigation={navigation} data={quitPlanData} />)
  }

  _goBack = () => {
    this._checkoutPop()
    this.props.navigation.goBack()
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active' && this.isPay && !this.payResult) {
      this.isPay = false
    }
    if (nextAppState === 'active' && this.clickedWechatContract) {
      this.clickedWechatContract = false
      queryMePayContract(this.contractSuccess)
    }
  }

  contractSuccess = () => {
    abTrack('member_extend_ok', 1)
    DeviceEventEmitter.emit('onRefreshTotes')
    DeviceEventEmitter.emit('onRefreshCoupon')
    this.debounce()
    this.props.navigation.navigate('CreateMember', { type: 'renew' })
  }

  //获取奖励金信息
  getAvailablePurchaseCredit = () => {
    QNetwork(SERVICE_TYPES.me.QUERY_AVAILABLE_PURCHASE_CREDIT, {}, response => {
      this.setState({
        allAvailablePurchaseCredit:
          response.data.me.available_purchase_credit.amount
      })
    })
  }

  //获取优惠券信息
  getCouponList = () => {
    QNetwork(SERVICE_TYPES.me.QUERY_ME_VALID_PROMOCODES, {}, response => {
      const { me } = response.data
      let allPromoCodes = me.valid_promo_codes.filter(function(item) {
        return item.type === 'MemberPromoCode'
      })
      this.setState({ allPromoCodes })
    })
  }

  //验证当前优惠券是否在当前套餐使用
  _isValidPromoCode = (promoCode, plan) => {
    if (promoCode && promoCode.subscription_type_ids) {
      const valid = promoCode.subscription_type_ids.find(id => {
        return id == plan.id
      })
      return !!valid
    } else {
      return true
    }
  }

  //获取当前套餐的订单信息
  getCurrentSubscriptionTypePreview = selectedPromoCode => {
    const { nowPlan } = this.state
    if (!nowPlan.auto_renew_discount_amount) {
      //用于取消上传的是否勾选免密服务
      this.isSelectedFreeService = false
    }
    //获取最优优惠券
    let promoCode
    if (selectedPromoCode) {
      promoCode = selectedPromoCode
    } else {
      if (nowPlan.available_promo_codes.length) {
        promoCode = nowPlan.available_promo_codes[0]
      }
    }
    const promo_code = promoCode && promoCode.code
    const is_charge_after_entrust = this.isSelectedFreeService
    QNetwork(
      SERVICE_TYPES.common.QUERY_SUBSCRIPTION_TYPE,
      { id: nowPlan.id, promo_code, is_charge_after_entrust },
      response => {
        const {
          auto_renew_discount_hint,
          preview
        } = response.data.subscription_type
        this.setState({
          nowCoupon: promoCode,
          price: preview.final_price,
          cashPrice: preview.cash_price,
          autoRenewDiscount: preview.auto_renew_discount,
          autoRenewDiscountHint: auto_renew_discount_hint
        })
      }
    )
  }

  setloadingModalVisible = visible => {
    this.setState({ loadingModalVisible: visible })
  }

  isFirstTimeSubscription = () => {
    return this.lastTime === '' && !this.initialData.isSubscriber
  }

  // 支付成功
  _finishPayment = () => {
    this.props.modalStore.hide()
    const newSubscriber = this.isFirstTimeSubscription()
    this.finishPayment = true
    const { navigation, currentCustomerStore, totesStore } = this.props
    if (newSubscriber) {
      const { isSubscriber, shipping_address, style } = currentCustomerStore
      if (
        isSubscriber &&
        !(
          shipping_address &&
          !shipping_address.city &&
          !shipping_address.address_1 &&
          style &&
          !style.height_inches
        )
      ) {
        navigation.replace('CreateMember', {
          type: 'customView',
          onboardingTote: totesStore.latest_rental_tote ? true : false
        })
      } else {
        navigation.navigate('Totes')
      }
    } else {
      if (navigation.state.params) {
        const { refresh, successRoute } = navigation.state.params
        refresh && refresh()
        //付款成功后有指定页面跳转
        if (successRoute) {
          successRoute && navigation.navigate(successRoute)
          return
        }
      }

      if (this.extendSuccessQuiz) {
        const { url } = this.extendSuccessQuiz
        navigation.replace('WebPage', { uri: url, hideShareButton: true })
        return
      }
      navigation.navigate('CreateMember', { type: 'renew' })
    }
  }

  pay = () => {
    const { nowPlan, nowCoupon, allAvailablePurchaseCredit } = this.state
    const { modalStore, appStore } = this.props
    if (!nowPlan) return
    if (this.isPay) return
    this.isPay = true

    Statistics.plans.payPlan(nowCoupon, allAvailablePurchaseCredit, nowPlan)

    let promo_code = nowCoupon ? nowCoupon.code : ''
    try {
      pay(nowPlan.id, promo_code, this.payType).then(result => {
        this.payResult = result
        if (result && result.errCode === 0) {
          this.payTimer = setTimeout(() => {
            modalStore.show(
              <PenddingSuccess
                finishPayment={this._finishPayment}
                checkStatus={() => {
                  return this.isPaymentSucceed
                }}
              />
            )
            this._checkSubscriptionStatus()
          }, 100)
        } else {
          if (result && result.error) {
            appStore.showToast(result.error, 'error')
          }
          this.payResult = null
          this.isPay = false
        }
      })
    } catch (e) {
      this.isPay = false
    }
  }

  //检查是否购买成功
  _checkSubscriptionStatus = () => {
    QNetwork(
      SERVICE_TYPES.me.QUERY_BILLING_DATE,
      {},
      response => {
        const { me } = response.data
        if (me.subscription && me.subscription.billing_date) {
          const { billing_date } = me.subscription
          const date = dateFns.format(billing_date, 'YYYY年MM月DD日')

          if (date === this.lastTime) {
            this._loopQuerySubscriptionStatus()
            return
          }
          this.isPaymentSucceed = true
          this.debounce()
        } else {
          this._loopQuerySubscriptionStatus()
        }
      },
      () => {
        this._loopQuerySubscriptionStatus()
      }
    )
  }

  _loopQuerySubscriptionStatus = () => {
    this.loopTimer = setTimeout(() => {
      this._checkSubscriptionStatus()
    }, 1000)
  }

  getCurrentCustomer = () => {
    const { currentCustomerStore, couponStore, toteCartStore } = this.props

    QNetwork(SERVICE_TYPES.me.QUERY_ME, {}, response => {
      const { me } = response.data

      //更新购物车数据
      toteCartStore.updateToteCart(me.tote_cart)
      //更新优惠券和加衣券数据
      couponStore.updateValidCoupons(me)
      //更新用户数据
      currentCustomerStore.updateCurrentCustomer(me)
      //刷新衣箱
      DeviceEventEmitter.emit('onRefreshTotes')

      // 购买成功
      Statistics.plans.paySuccess(
        this.state.nowCoupon,
        this.state.allAvailablePurchaseCredit,
        this.state.nowPlan,
        this.initialData.isSubscriber
      )

      setTimeout(() => {
        //用户是否可以看到上新状态发生改变
        if (
          !this.initialData.isSubscriber ||
          me.can_view_newest_products !== this.initialData.canViewNewestProducts
        ) {
          DeviceEventEmitter.emit('onRefreshProductsClothing')
          DeviceEventEmitter.emit('onRefreshProductsAccessory')
          DeviceEventEmitter.emit('refreshHomePage')
        }

        // occasion活动会员 购买一般类型会员后，要刷新首页，把occasion 栏位去掉
        // 或者如果是过期用户续费后，要吧过期状态的occasion栏位隐藏掉
        if (this.initialData.isSubscriber) {
          const { subscription_type, status } = this.initialData.subscription
          if (subscription_type.occasion || status === 'cancelled') {
            DeviceEventEmitter.emit('refreshHomeList')
          }
        }
      }, 500)
    })
  }

  //切换选择套餐
  _didSelectedPlan = nowPlan => {
    if (nowPlan.interval === 1) {
      this.isSelectedFreeService = true
    }
    this.setState({ nowPlan }, () => {
      this.getCurrentSubscriptionTypePreview()
    })
  }

  _didSelectedFreeService = isSelectedFreeService => {
    this.isSelectedFreeService = isSelectedFreeService
    this.getCurrentSubscriptionTypePreview()
  }

  _selectPromoCode = () => {
    const { nowCoupon, nowPlan } = this.state
    this.props.navigation.navigate('UseCoupon', {
      onSelect: this._didSelectedPromoCode,
      subscriptionTypeId: { subscription_type_id: nowPlan.id },
      coupon: nowCoupon
    })
  }
  _didSelectedPromoCode = nowCoupon => {
    this.setState({ nowCoupon }, () => {
      this.getCurrentSubscriptionTypePreview(nowCoupon)
    })
  }

  _popUpPanelOnClose = () => {
    this.setState({ pupVisible: false })
  }
  _popPanelHide = () => {
    this._popUpPanel._onHide()
  }

  _extractUniqueKey(item, index) {
    return index.toString()
  }

  _renderItem = ({ item }) => {
    let isSelected = false
    const { nowPlan } = this.state
    if (nowPlan && nowPlan.id && item.id === nowPlan.id) {
      isSelected = true
    }
    return (
      <SubscriptionItem
        isSelected={isSelected}
        item={item}
        didSelectedItem={this._didSelectedPlan}
      />
    )
  }

  _selectPayType = () => {
    const { nowPlan, loadingModalVisible } = this.state
    const {
      isSubscriber,
      enablePaymentContract
    } = this.props.currentCustomerStore
    if (nowPlan && !this.isPay && !loadingModalVisible) {
      if (
        this.isSelectedFreeService &&
        nowPlan.interval === 1 &&
        isSubscriber &&
        !enablePaymentContract.length
      ) {
        abTrack('member_extend_pay_start', 1)
        this.enableCustomerContractPay()
        return
      }
      if (!nowPlan.preview.final_price) {
        this.pay()
      } else {
        this.setState({ pupVisible: true })
      }
    }
  }
  _changeType = payType => {
    this.payType = payType
  }

  returnSubscriptionTime = nowPlan => {
    if (nowPlan) {
      return dateFns.format(nowPlan.preview.expiration_date, 'YYYY年MM月DD日')
    } else {
      return null
    }
  }

  getSubscriptionTypes = showModal => {
    showModal && this.setloadingModalVisible(true)
    QNetwork(
      SERVICE_TYPES.common.QUERY_EXTENDABLE_SUBSCRIPTION_TYPES,
      {},
      response => {
        const {
          subscription_groups,
          default_select_subscription_type_id,
          needs_migration
        } = response.data.extendable_subscription_types
        if (needs_migration) {
          this._goBack()
          this.props.navigation.navigate('WebPage', {
            uri: SERVICE_TYPES.common.WEBPAGE_MIGRATION
          })
        } else {
          this.setSubscriptionTypes(
            subscription_groups,
            default_select_subscription_type_id
          )
        }
      },
      () => {
        this.setloadingModalVisible(false)
      }
    )
  }

  setSubscriptionTypes = (subscriptionGroups, defaultSubscriptionTypeId) => {
    const { subscriptionStore, navigation } = this.props
    const { params } = navigation.state
    const currentPlanIds = params && params.ids ? params.ids : null
    subscriptionStore.subscriptionGroups = subscriptionGroups
    //获取焦点套餐
    const { nowGroup, nowPlan, groupsIndex } = this.getFocusGroups(
      subscriptionGroups,
      currentPlanIds ? currentPlanIds : [defaultSubscriptionTypeId]
    )
    //判断当前优惠券是否可用
    let nowCoupon = params && params.nowCoupon ? params.nowCoupon : null
    const isValidPromoCode = this._isValidPromoCode(nowCoupon, nowPlan)
    nowCoupon = isValidPromoCode ? nowCoupon : null
    this.setState(
      {
        nowGroup,
        nowPlan,
        nowCoupon,
        subscriptionGroups,
        groupsIndex,
        loadingModalVisible: false
      },
      () => {
        if (nowPlan) {
          this.getCurrentSubscriptionTypePreview(nowCoupon)
          Statistics.plans.visitPlans(
            this.state.nowCoupon,
            this.state.allAvailablePurchaseCredit,
            nowPlan
          )
        }
      }
    )
  }

  getFocusGroups = (subscriptionGroups, ids) => {
    let nowGroup, nowPlan, groupsIndex, plan

    if (ids && ids.length) {
      ids.forEach(id => {
        subscriptionGroups.map((item, index) => {
          plan = item.subscription_types.find(function(i) {
            return i.id == id
          })
          if (plan && !nowGroup) {
            groupsIndex = index
            nowGroup = item.subscription_types
            nowPlan = plan
          }
        })
      })
    }
    if (!nowGroup) {
      nowGroup = subscriptionGroups[0].subscription_types
      nowPlan = nowGroup[0]
      groupsIndex = 0
    }
    return { nowGroup, nowPlan, groupsIndex }
  }

  changeSubscriptionGroupsItem = obj => {
    this.setState(
      {
        nowGroup: obj.subscription_types,
        nowPlan: obj.subscription_types[0]
      },
      () => {
        _.debounce(this.getCurrentSubscriptionTypePreview, 300, {
          leading: false,
          trailing: true
        })()
      }
    )
  }

  enableCustomerContractPay = () => {
    enableCustomerContract(true, this.isSelectedFreeService).then(result => {
      if (result === 'WeChat_GOBACK') {
        this.clickedWechatContract = true
      } else {
        queryMePayContract(this.contractSuccess)
      }
    })
  }

  render() {
    const {
      nowPlan,
      allAvailablePurchaseCredit,
      nowCoupon,
      allPromoCodes,
      groupsIndex,
      nowGroup,
      loadingModalVisible,
      pupVisible,
      subscriptionGroups,
      price,
      cashPrice,
      autoRenewDiscount,
      autoRenewDiscountHint,
      subscription_pay_feeds
    } = this.state
    const { currentCustomerStore, appStore } = this.props
    const {
      isSubscriber,
      enablePaymentContract,
      isValidSubscriber
    } = currentCustomerStore
    let subscriptionTime = this.returnSubscriptionTime(nowPlan)
    return (
      <View style={styles.safeAreaView}>
        {loadingModalVisible ? (
          <View style={styles.loadingModal}>
            <ActivityIndicator animating={true} style={{ height: 80 }} />
          </View>
        ) : (
          <View style={styles.safeAreaView}>
            {subscriptionGroups && subscriptionGroups.length > 1 ? (
              <MultipleJoinMember
                appStore={appStore}
                nowPlan={nowPlan}
                allAvailablePurchaseCredit={allAvailablePurchaseCredit}
                nowCoupon={nowCoupon}
                allPromoCodes={allPromoCodes}
                groupsIndex={groupsIndex}
                nowGroup={nowGroup}
                goBack={this._goBack}
                subscriptionTime={subscriptionTime}
                loadingModalVisible={loadingModalVisible}
                changeSubscriptionGroupsItem={this.changeSubscriptionGroupsItem}
                didSelectedPlan={this._didSelectedPlan}
                navigation={this.props.navigation}
                selectPayType={this._selectPayType}
                pupVisible={pupVisible}
                payType={this.payType}
                changeType={this._changeType}
                pay={this.pay}
                popUpPanelOnClose={this._popUpPanelOnClose}
                selectPromoCode={this._selectPromoCode}
                isSubscriber={isSubscriber}
                subscriptionGroups={subscriptionGroups}
                price={price}
                cashPrice={cashPrice}
                autoRenewDiscount={autoRenewDiscount}
                autoRenewDiscountHint={autoRenewDiscountHint}
              />
            ) : (
              <SingleJoinMember
                appStore={appStore}
                nowPlan={nowPlan}
                allAvailablePurchaseCredit={allAvailablePurchaseCredit}
                nowCoupon={nowCoupon}
                allPromoCodes={allPromoCodes}
                nowGroup={nowGroup}
                goBack={this._goBack}
                subscriptionTime={subscriptionTime}
                loadingModalVisible={loadingModalVisible}
                didSelectedPlan={this._didSelectedPlan}
                didSelectedFreeService={this._didSelectedFreeService}
                navigation={this.props.navigation}
                selectPayType={this._selectPayType}
                pupVisible={pupVisible}
                payType={this.payType}
                changeType={this._changeType}
                pay={this.pay}
                popUpPanelOnClose={this._popUpPanelOnClose}
                selectPromoCode={this._selectPromoCode}
                isSubscriber={this.initialData.isSubscriber}
                isValidSubscriber={isValidSubscriber}
                price={price}
                cashPrice={cashPrice}
                enablePaymentContract={enablePaymentContract}
              />
            )}
            {!!subscription_pay_feeds.length && (
              <Experiment defaultValue={1} flagName={'join_member_feeds'}>
                <Variant value={1} style={styles.container} />
                <Variant value={2}>
                  <View
                    style={{ position: 'relative', bottom: 64, width: 375 }}>
                    <Feed data={subscription_pay_feeds} />
                  </View>
                </Variant>
              </Experiment>
            )}
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  loadingModal: {
    flex: 1,
    justifyContent: 'center'
  }
})
