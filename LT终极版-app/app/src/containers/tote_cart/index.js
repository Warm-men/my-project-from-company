import React, { Component, PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  BackHandler,
  Platform
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { inject, observer } from 'mobx-react'
import {
  QNetwork,
  SERVICE_TYPES,
  Mutate
} from '../../expand/services/services.js'
import Icons from 'react-native-vector-icons/SimpleLineIcons'
import OperationGuideView from '../../../storybook/stories/alert/operation_guide_view'
import p2d from '../../expand/tool/p2d'
import SwapActions from '../../expand/tool/swap'
import ShoppingCarItemList from '../../../storybook/stories/tote_cart/shoppingCar/shopping_car_item_list'
import ToteCartFreeService from '../../../storybook/stories/tote_cart/shoppingCar/tote_cart_free_service'
import { CustomAlertView } from '../../../storybook/stories/alert/custom_alert_view'
import {
  getError,
  translationErrorCode
} from '../../expand/tool/shopping_car_error'
import PopupView from '../../../storybook/stories/alert/free_service_popup'
import Statistics from '../../expand/tool/statistics'
import { getAbFlag, abTrack } from '../../components/ab_testing'
// import { onNavigationState } from '../../components/custom_component'
import CloseIcon from 'react-native-vector-icons/EvilIcons'
import { differenceInDays, startOfDay } from 'date-fns'

// @onNavigationState
@inject(
  'toteCartStore',
  'currentCustomerStore',
  'modalStore',
  'guideStore',
  'couponStore',
  'appStore'
)
@observer
export default class ShoppingCarContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { banner: null, isPopShow: false }

    this.isCommitting = false
    this.isRemoving = false
    this.listeners = []
  }

  componentDidMount() {
    this.getShoppingCar()
    this.getBanner()
    this.getValidCouponList()
    this.listeners.push(
      this.props.navigation.addListener('didFocus', () => {
        if (Platform.OS === 'android') {
          BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackPress
          )
        }
      })
    )
    this.listeners.push(
      this.props.navigation.addListener('willBlur', () => {
        this.setState({ isPopShow: false })
        if (Platform.OS === 'android') {
          BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackPress
          )
        }
      })
    )
  }
  componentWillUnmount() {
    this.listeners.map(item => {
      item.remove()
    })
  }

  getBanner = () => {
    getAbFlag('free_service_banner', 0, abFlag => {
      let input = {}
      if (abFlag === 1) {
        input.group = 'abtest_08_05'
      }
      QNetwork(
        SERVICE_TYPES.toteCart.QUERY_ME_TOTECART_BANNER,
        input,
        response => {
          const { me } = response.data
          if (me) {
            this.setState({ banner: me.tote_cart.banner })
          }
        }
      )
    })
  }

  handleBackPress = () => {
    this._goBack()
    return true
  }

  _goBack = () => {
    const { navigation } = this.props
    const { params } = navigation.state
    if (params && params.goTotes) {
      navigation.navigate('Totes')
      return
    }
    navigation.goBack()
  }

  showGuide = () => {
    const { modalStore, toteCartStore, guideStore } = this.props
    if (modalStore.currentRoute !== 'ShoppingCar') {
      return
    }

    const {
      onboarding,
      display_more_product_entry,
      used_free_service,
      with_free_service
    } = toteCartStore.toteCart

    if (!guideStore.toteCartGuideShowed && display_more_product_entry) {
      modalStore.show(
        <OperationGuideView
          column={onboarding ? 'onboardingToteCart' : 'defaultToteCart'}
          onFinishedGuide={() => {
            guideStore.toteCartGuideShowed = true
            guideStore.oldToteCartGuideShowed = true
            guideStore.toteCartFreeService = true
          }}
        />
      )
      return
    }
    if (!guideStore.oldToteCartGuideShowed) {
      modalStore.show(
        <OperationGuideView
          column={'oldToteCart'}
          onFinishedGuide={() => {
            guideStore.oldToteCartGuideShowed = true
            guideStore.toteCartFreeService = true
          }}
        />
      )
      return
    }
    if (
      with_free_service &&
      used_free_service &&
      !guideStore.toteCartFreeService
    ) {
      modalStore.show(
        <OperationGuideView
          column={'toteCartFreeService'}
          onFinishedGuide={() => {
            guideStore.toteCartFreeService = true
          }}
        />
      )
    }
  }

  _extractUniqueKey = item => {
    return item.id.toString()
  }

  addProduct = () => {
    const {
      occasion_display
    } = this.props.currentCustomerStore.subscription.subscription_type
    if (occasion_display) {
      this.props.navigation.push('SwapOccasionController')
    } else {
      this.props.navigation.push('SwapController')
    }
  }
  _pushToSwapCloset = type => {
    this.props.navigation.push('SwapClosetController', { type })
  }

  pickMoreClothes = () => {
    this.props.navigation.navigate('Products')
  }

  getShoppingCar = () => {
    QNetwork(SERVICE_TYPES.toteCart.QUERY_ME_TOTECART, {}, response => {
      const { me } = response.data
      if (me) {
        this.props.toteCartStore.updateToteCart(me.tote_cart)
        this.showGuide()
      }
    })
  }

  removeFromToteCart = item => {
    if (this.isRemoving) {
      return
    }
    this.isRemoving = true
    SwapActions.removeFromToteCart(
      item.product_size.id,
      () => {
        this.isRemoving = false
      },
      () => {
        this.isRemoving = false
      }
    )
  }

  operationCoupon = () => {
    const { customer_coupon_id } = this.props.toteCartStore.toteCart
    if (customer_coupon_id) {
      this.removeCoupon()
    } else {
      this.applyCouponToToteCart()
    }
  }

  removeCoupon = () => {
    this.props.modalStore.show(
      <CustomAlertView
        message={'确认本次不使用加衣券？'}
        cancel={{ title: '取消', type: 'normal' }}
        other={[
          {
            title: '确认',
            type: 'highLight',
            onClick: this.removeCouponFromToteCart
          }
        ]}
      />
    )
  }

  applyCouponToToteCart = () => {
    const { navigation, couponStore } = this.props
    navigation.navigate('UseCoupon', {
      isCoupon: true,
      coupon: couponStore.validCoupons[0]
    })
  }

  removeCouponFromToteCart = () => {
    const { appStore, toteCartStore } = this.props
    let input = {}
    Mutate(
      SERVICE_TYPES.toteCart.MUTATION_REMOVE_COUPON_FROM_TOTE,
      { input },
      response => {
        const { RemoveCouponFromToteCart } = response.data
        const { success, tote_cart, errors } = RemoveCouponFromToteCart
        if (success) {
          toteCartStore.updateToteCart(tote_cart)
          this.getValidCouponList()
        } else {
          appStore.showToast(errors[0].message, 'error')
        }
      }
    )
  }

  getValidCouponList = () => {
    const { couponStore } = this.props
    QNetwork(SERVICE_TYPES.me.QUERY_ME_VALID_COUPON, {}, response => {
      const { me } = response.data
      couponStore.validCoupons = me.valid_coupons
    })
  }

  sendTote = () => {
    if (this.isCommitting) {
      return
    }
    this.isCommitting = true
    const { toteCartStore, modalStore, navigation, appStore } = this.props
    QNetwork(
      SERVICE_TYPES.toteCart.QUERY_ME_TOTECART,
      {},
      response => {
        const { me } = response.data
        if (me) {
          toteCartStore.updateToteCart(me.tote_cart)
          this.isCommitting = false
          if (!me.tote_cart.validate_result.success) {
            const { alertError, toastError } = getError(
              me.tote_cart.validate_result.errors
            )
            if (!!alertError.length) {
              if (
                alertError[0].error_code ===
                'error_need_identity_authentication'
              ) {
                navigation.navigate('IdentityAuthentication')
                return
              }
              if (
                alertError[0].error_code ===
                'error_not_support_subscription_type'
              ) {
                navigation.navigate('WebPage', {
                  uri: SERVICE_TYPES.common.WEBPAGE_MIGRATION
                })
                return
              }
              const {
                title,
                buttonTitle,
                cancelButtonTitle
              } = translationErrorCode(alertError[0].error_code)
              modalStore.show(
                <CustomAlertView
                  title={title}
                  message={alertError[0].message}
                  cancel={
                    cancelButtonTitle
                      ? { title: cancelButtonTitle, type: 'normal' }
                      : null
                  }
                  other={[
                    {
                      title: buttonTitle,
                      type: 'highLight',
                      onClick: this.errorOnPress
                    }
                  ]}
                />
              )
            }
            if (!!toastError.length) {
              appStore.showToastWithOpacity(toastError[0].message)
            }
          } else {
            const {
              totes_left,
              billing_date
            } = this.props.currentCustomerStore.subscription
            const leftSubscriptionTime = differenceInDays(
              startOfDay(billing_date),
              startOfDay(new Date())
            )
            const isTooFast =
              totes_left > 0 && leftSubscriptionTime / totes_left > 18
            if (isTooFast) {
              this.props.modalStore.show(
                <CustomAlertView
                  messageComponent={this.getMessageComponent(
                    leftSubscriptionTime,
                    totes_left
                  )}
                  cancel={{ title: '取消', type: 'normal' }}
                  other={[
                    {
                      title: '确认',
                      type: 'highLight',
                      onClick: this.goToteLock
                    }
                  ]}
                />
              )
              return
            }
            const { popup, display_free_service_banner } = me.tote_cart
            if (
              popup &&
              !!popup.url &&
              !!popup.height &&
              !!popup.width &&
              display_free_service_banner
            ) {
              modalStore.show(
                <PopupView
                  popup={popup}
                  goToteLock={this.goToteLock}
                  goFreeService={this.goFreeService}
                />
              )
            } else {
              navigation.navigate('ToteLock')
            }
          }
        }
      },
      () => {
        this.isCommitting = false
      }
    )
  }

  getMessageComponent = (leftSubscriptionTime, totes_left) => {
    return (
      <Text style={styles.tooFastText}>
        你的会员有效期还有
        <Text style={styles.tooFastTextBold}>{leftSubscriptionTime}天</Text>
        ，当前剩余
        <Text style={styles.tooFastTextBold}>{totes_left}个</Text>
        衣箱，确定继续下单新衣箱吗
      </Text>
    )
  }

  goToteLock = () => {
    const { modalStore, navigation } = this.props
    modalStore.hide()
    navigation.navigate('ToteLock')
  }

  goFreeService = () => {
    const { navigation, modalStore } = this.props
    if (modalStore.modalVisible) {
      modalStore.hide()
      Statistics.onEvent({
        id: 'freeservice_shoppingcart_pop',
        label: '新衣箱弹窗点击去开通自在选'
      })
    } else {
      Statistics.onEvent({
        id: 'freeservice_shoppingcart_banner',
        label: '新衣箱banner入口点击'
      })
    }
    abTrack('freeService_banner', 1)
    navigation.navigate('OpenFreeService')
  }

  errorOnPress = () => {
    const { navigation, toteCartStore, modalStore } = this.props
    const { validate_result } = toteCartStore.toteCart
    const { alertError } = getError(validate_result.errors)
    if (alertError && !alertError.length) return

    switch (alertError[0].error_code) {
      case 'error_need_payment':
        navigation.navigate('PaymentPending')
        break
      case 'error_subscription_inactive':
        navigation.navigate('JoinMember')
        break
      case 'error_scheduled_pickup':
        navigation.navigate('OpenFreeService')
        Statistics.onEvent({
          id: 'freeservice_shoppingcart_reservation',
          label: '新衣箱页预约归还弹窗点击去开通自在选'
        })
        break
      case 'error_scheduled_pickup_without_free_service':
        modalStore.hide()
        break
      case 'error_need_recharge_account':
        navigation.navigate('CreditAccount')
        break
      case 'error_run_out_of_subscription_totes':
        navigation.navigate('JoinMember')
        break
    }
  }

  returnNewError = tipError => {
    const findIndex = tipError.findIndex(function(item) {
      return item.error_code === 'error_tote_cart_not_full'
    })
    if (findIndex !== -1) {
      tipError.splice(findIndex, 1)
    }
    return tipError
  }

  removeFreeServiceFromToteCartTips = () => {
    const {
      clothing_items,
      max_clothing_count
    } = this.props.toteCartStore.toteCart
    if (max_clothing_count - clothing_items.length < 2) {
      this.props.modalStore.show(
        <CustomAlertView
          message={'本衣箱不开启自在选，将删除最后2个衣位？'}
          cancel={{ title: '取消', type: 'highLight' }}
          other={[
            {
              title: '确认',
              type: 'highLight',
              onClick: this.removeFreeServiceFromToteCart
            }
          ]}
        />
      )
    } else {
      this.removeFreeServiceFromToteCart()
    }
  }

  applyFreeServiceToToteCart = () => {
    let input = {}
    Mutate(
      SERVICE_TYPES.toteCart.MUTATION_APPLY_FREE_SERVICE_TOTOTE_CART,
      { input },
      response => {
        const { tote_cart } = response.data.ApplyFreeServiceToToteCart
        const { appStore, toteCartStore } = this.props
        tote_cart && toteCartStore.updateToteCart(tote_cart)
        appStore.showToastWithOpacity('已启用自在选')
        this.setState({ isPopShow: false })
      }
    )
  }

  removeFreeServiceFromToteCart = () => {
    let input = {}
    Mutate(
      SERVICE_TYPES.toteCart.MUTATION_REMOVE_FREE_SERVICE_TOTOTE_CART,
      { input },
      response => {
        const { appStore, toteCartStore } = this.props
        const { tote_cart } = response.data.RemoveFreeServiceFromToteCart
        tote_cart && toteCartStore.updateToteCart(tote_cart)
        appStore.showToastWithOpacity('已临时关闭自在选')
        this.setState({ isPopShow: false })
      }
    )
  }

  _togglePop = () => {
    this.setState({ isPopShow: !this.state.isPopShow })
  }

  render() {
    const { couponStore, toteCartStore, modalStore, navigation } = this.props

    if (modalStore && modalStore.currentRoutes && navigation) {
      const index = modalStore.currentRoutes.findIndex(i => {
        return i.key === navigation.state.key
      })

      if (index !== -1) {
        const maxIndex = modalStore.currentRoutes.length - 1
        if (maxIndex - index > 1) {
          return <View />
        }
      }
    }

    const { banner } = this.state

    const { toteCart, nowClothingCount, nowAccessoryCount } = toteCartStore
    if (!toteCart) return <View />

    const {
      accessory_items,
      clothing_items,
      customer_coupon_id,
      display_more_product_entry,
      max_accessory_count,
      max_clothing_count,
      with_free_service,
      display_free_service_banner,
      validate_result,
      disable_free_service
    } = toteCart
    const { tipError } = validate_result ? getError(validate_result.errors) : []
    const newError = this.returnNewError(tipError)
    const showValidateResult =
      validate_result && !validate_result.success && !!tipError.length
    const popText = disable_free_service
      ? '已临时关闭自在选，如果想要恢复使用自在选，可以点击按钮开启，将恢复自在选增加的2个衣位。'
      : '如果近期不方便归还自在选，可以选择临时关闭，这样下个衣箱将不含自在选增加的2个衣位。'
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={{ flex: 1 }}>
          <NavigationBar
            title={'新衣箱'}
            hasBottomLine={true}
            leftBarButtonItem={
              <BarButtonItem onPress={this._goBack}>
                <Icons name={'arrow-left'} size={18} />
              </BarButtonItem>
            }
          />
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            <OpenFreeServiceBanner
              display={display_free_service_banner}
              banner={banner}
              onPress={this.goFreeService}
            />
            {with_free_service && (
              <ToteCartFreeService
                testID="toteCartFreeService"
                applyFreeServiceToToteCart={this.applyFreeServiceToToteCart}
                removeFreeServiceFromToteCart={
                  this.removeFreeServiceFromToteCartTips
                }
                togglePop={this._togglePop}
              />
            )}
            {with_free_service && this.state.isPopShow && (
              <TouchableOpacity
                onPress={this._togglePop}
                activeOpacity={0.8}
                style={styles.popView}>
                <View style={styles.arrow}>
                  <View style={styles.arrowA} />
                  <View style={styles.arrowB} />
                </View>
                <Text style={styles.popText}>{popText}</Text>
                <CloseIcon
                  name={'close'}
                  size={20}
                  style={styles.iconClose}
                  color={'#989A9C'}
                />
              </TouchableOpacity>
            )}
            <ShoppingCarItemList
              testID="clothing-item-list"
              column={'衣服'}
              type={'clothing'}
              products={clothing_items}
              maxCount={max_clothing_count}
              nowCount={nowClothingCount}
              didSelectedItem={this._pushToSwapCloset}
              removeFromToteCart={this.removeFromToteCart}
              customerCouponId={customer_coupon_id}
              couponStore={couponStore}
              operationCoupon={this.operationCoupon}
              navigation={navigation}
            />
            <ShoppingCarItemList
              testID="accessory-item-list"
              column={'配饰'}
              type={'accessory'}
              products={accessory_items}
              maxCount={max_accessory_count}
              nowCount={nowAccessoryCount}
              didSelectedItem={this._pushToSwapCloset}
              removeFromToteCart={this.removeFromToteCart}
              navigation={navigation}
              style={{ marginBottom: 40 }}
            />
          </ScrollView>
          {!!display_more_product_entry && (
            <TouchableOpacity
              style={[
                styles.pickMore,
                showValidateResult && styles.hasErrorPickMore
              ]}
              onPress={this.pickMoreClothes}>
              <Text testID="select-products" style={styles.pickMoreTitle}>
                去挑选更多服饰
              </Text>
            </TouchableOpacity>
          )}
          {showValidateResult && (
            <View testID="warning-tips" style={styles.validateResult}>
              <Image
                source={require('../../../assets/images/totes/warning_tips.png')}
              />
              <Text style={styles.validateResultText}>
                {newError[0].message}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.submitButton} onPress={this.sendTote}>
            <Text testID="lock-tote" style={styles.submitButtonText}>
              下单衣箱
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.helpMeChoose}
            onPress={this.addProduct}>
            <Image
              style={styles.helpMeChooseImage}
              source={require('../../../assets/images/totes/help_me_choose.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

class OpenFreeServiceBanner extends PureComponent {
  render() {
    const { display, banner, onPress } = this.props
    if (!display || !banner) {
      return null
    }
    const { url, height, width } = banner
    if (!url || !height || !width) return null

    return (
      <TouchableOpacity onPress={onPress}>
        <Image
          style={[
            styles.displayFreeServiceBanner,
            {
              height: p2d((height / width) * 343),
              width: p2d(343)
            }
          ]}
          source={{ uri: url }}
          resizeMode="contain"
        />
        <Text style={styles.descriptionText}>新衣箱页自在选开通banner</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: p2d(10)
  },
  pickMore: {
    width: p2d(123),
    height: p2d(41),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: p2d(100),
    backgroundColor: '#FFF',
    elevation: 1,
    shadowColor: 'rgb(0,0,0)',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.17,
    alignSelf: 'center',
    position: 'absolute',
    bottom: p2d(71)
  },
  hasErrorPickMore: {
    bottom: p2d(96)
  },
  pickMoreTitle: {
    fontSize: 12,
    color: '#666',
    marginRight: p2d(4)
  },
  helpMeChoose: {
    position: 'absolute',
    bottom: 66,
    right: p2d(4),
    zIndex: 2
  },
  submitButton: {
    width: p2d(343),
    height: p2d(44),
    backgroundColor: '#E85C40',
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom: p2d(6),
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700'
  },
  displayFreeServiceBanner: {
    marginTop: 12,
    alignSelf: 'center',
    borderRadius: 6,
    overflow: 'hidden'
  },
  validateResult: {
    width: p2d(375),
    height: p2d(32),
    backgroundColor: '#FFF8F8',
    position: 'relative',
    bottom: p2d(6),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  validateResultText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6
  },
  helpMeChooseImage: {
    width: 60,
    height: 60
  },
  descriptionText: {
    display: 'none'
  },
  popView: {
    position: 'absolute',
    top: 65,
    left: 5,
    backgroundColor: '#fff',
    width: p2d(311),
    borderRadius: 3,
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 20,
    shadowColor: '#000',
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.15,
    elevation: 3,
    zIndex: 100
  },
  popText: {
    color: '#5E5E5E',
    fontSize: 12,
    lineHeight: 20
  },
  iconClose: {
    position: 'absolute',
    right: 5,
    top: 5
  },
  arrow: {
    marginLeft: 50,
    zIndex: 20,
    position: 'absolute',
    top: -17,
    left: 57
  },
  arrowA: {
    height: 0,
    width: 0,
    borderColor: 'transparent',
    borderBottomColor: '#eee',
    borderWidth: 8
  },
  arrowB: {
    position: 'absolute',
    top: 3,
    left: 1,
    height: 0,
    width: 0,
    borderBottomColor: '#fff',
    borderColor: 'transparent',
    borderWidth: 7
  },
  tooFastText: {
    fontSize: 14,
    color: '#5E5E5E',
    margin: 28,
    lineHeight: 24
  },
  tooFastTextBold: {
    color: '#121212',
    fontWeight: '700'
  }
})
