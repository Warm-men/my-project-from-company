import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ActivityIndicator,
  FlatList,
  DeviceEventEmitter,
  ScrollView,
  Text
} from 'react-native'
import AvailablePurchaseCredit from '../../../storybook/stories/account/join_member/available_purchase_credit'
import dateFns from 'date-fns'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import SubscriptionTypeItem from '../../../storybook/stories/account/join_member/subscription_type_item'
import { QNetwork, SERVICE_TYPES } from '../../expand/services/services'
import pay from '../../expand/tool/payment.js'
import Animation from 'lottie-react-native'
import p2d from '../../expand/tool/p2d'
import { inject, observer } from 'mobx-react'
import PopUpPanel from '../../components/pop_up_panel'
import PayType from '../../../storybook/stories/account/join_member/pay_type_view'
@inject(
  'currentCustomerStore',
  'couponStore',
  'appStore',
  'toteCartStore',
  'totesStore'
)
@observer
export default class JoinMemberListContainer extends Component {
  constructor(props) {
    super(props)
    const { subscriptionDate, isSubscriber } = props.currentCustomerStore
    this.state = {
      modalVisible: false,
      loadingModalVisible: true,
      subscriptionTypeList: [],
      plan: null,
      subscriptionTime: null,
      price: null,
      allAvailablePurchaseCredit: 0,
      availablePurchaseCredit: null,
      pupVisible: false
    }
    this.lastTime = subscriptionDate
    this.wasSubscriber = isSubscriber
    this.progress = new Animated.Value(0)
    this.isPay = false
    this.loopTime = 0
    this.isPaymentSucceed = false
    this.payType = 'wechat_native'
    this.occasionFilter = null
    const { params } = this.props.navigation.state
    if (params && params.occasion_filter) {
      this.occasionFilter = params.occasion_filter //'beach_vacation'
    }
  }
  componentDidMount() {
    this.getSubscriptionTypes()
  }

  componentWillUnmount() {
    this.loopTimer && clearTimeout(this.loopTimer)
    this.payTimer && clearTimeout(this.payTimer)
    this.gobackTime && clearTimeout(this.gobackTime)
  }

  getSubscriptionTypes = () => {
    let input = this.occasionFilter
      ? {
          filter: 'signupable',
          occasion_filter: this.occasionFilter
        }
      : {
          filter: 'signupable'
        }
    QNetwork(
      SERVICE_TYPES.common.QUERY_SUBSCRIPTION_TYPES,
      input,
      response => {
        const { subscription_types } = response.data
        if (subscription_types && subscription_types.length) {
          // 默认选中第一个套餐
          const item = subscription_types[0]
          this.setState(
            {
              subscriptionTypeList: subscription_types,
              plan: item,
              price: item.base_price,
              subscriptionTime: item.days_interval
            },
            () => {
              this.getAvailablePurchaseCredit()
            }
          )
        } else {
          this.setloadingModalVisible(false)
        }
      },
      () => {
        this.setloadingModalVisible(false)
      }
    )
  }

  openAgreement = () => {
    this.props.navigation.push('WebPage', {
      uri: 'https://wechat.letote.cn/agreement',
      title: '托特衣箱用户服务协议',
      hideShareButton: true
    })
  }

  setloadingModalVisible = visible => {
    this.setState({ loadingModalVisible: visible })
  }

  _selectPlan = item => {
    this.setState(
      {
        plan: item,
        price: item.base_price,
        subscriptionTime: item.days_interval
      },
      () => {
        this.calculatingPrice()
      }
    )
  }

  getAvailablePurchaseCredit = () => {
    QNetwork(
      SERVICE_TYPES.me.QUERY_ME_PURCHASE_CREDIT,
      {},
      response => {
        this.setState(
          {
            allAvailablePurchaseCredit:
              response.data.me.available_purchase_credit.amount
          },
          () => {
            this.calculatingPrice()
          }
        )
      },
      () => {
        this.setloadingModalVisible(false)
      }
    )
  }

  calculatingPrice = () => {
    let allAvailablePurchaseCredit = this.state.allAvailablePurchaseCredit
    let price = this.state.price
    if (allAvailablePurchaseCredit > 0) {
      let finalPrice = price - allAvailablePurchaseCredit
      if (finalPrice >= 0) {
        this.purchase_amount = allAvailablePurchaseCredit
        this.setState({
          price: finalPrice,
          availablePurchaseCredit: allAvailablePurchaseCredit,
          loadingModalVisible: false
        })
      } else {
        this.purchase_amount =
          allAvailablePurchaseCredit - (allAvailablePurchaseCredit - price)
        this.setState({
          availablePurchaseCredit:
            allAvailablePurchaseCredit - (allAvailablePurchaseCredit - price),
          price: 0,
          loadingModalVisible: false
        })
      }
    } else {
      this.purchase_amount = '0'
      this.setState({
        availablePurchaseCredit: 0,
        loadingModalVisible: false
      })
    }
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  pay = () => {
    const { appStore } = this.props
    if (!this.isPay) {
      this.isPay = true
      try {
        pay(this.state.plan.id, '', this.payType).then(result => {
          if (result && result.errCode === 0) {
            this.payTimer = setTimeout(() => {
              this.setState({ modalVisible: true }, () => {
                this.play()
              })
              this.getCurrentCustomer()
            }, 100)
          } else {
            if (result && result.error) {
              appStore.showToast(result.error, 'error')
            }
            this.isPay = false
          }
        })
      } catch (e) {
        this.isPay = false
      }
    }
  }

  payDone = () => {
    const newSubscriber = this.isFirstTimeSubscription()
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
        navigation.navigate('CreateMember', {
          type: 'customView',
          onboardingTote: totesStore.latest_rental_tote ? true : false
        })
      } else {
        navigation.navigate('Totes')
      }
    } else {
      if (navigation.state.params) {
        const { refresh } = navigation.state.params
        refresh && refresh()
      }
      navigation.navigate('CreateMember', {
        type: 'renew'
      })
    }
  }

  isFirstTimeSubscription = () => {
    return this.lastTime === '' && !this.wasSubscriber
  }

  getCurrentCustomer = () => {
    this.loopTime += 0.5
    const { currentCustomerStore, couponStore, toteCartStore } = this.props
    if (!this.isPaymentSucceed) {
      QNetwork(
        SERVICE_TYPES.me.QUERY_ME,
        {},
        response => {
          const me = response.data.me
          couponStore.validPromoCodes = me.valid_promo_codes
          couponStore.validCoupons = me.valid_coupons
          toteCartStore.updateToteCart(me.tote_cart)
          if (me.subscription && me.subscription.billing_date) {
            let newestBillingDate = dateFns.format(
              me.subscription.billing_date,
              'YYYY年MM月DD日'
            )
            if (newestBillingDate !== this.lastTime) {
              const {
                isSubscriber,
                canViewNewestProducts
              } = currentCustomerStore

              DeviceEventEmitter.emit('onRefreshTotes')

              if (
                !isSubscriber ||
                me.can_view_newest_products !== canViewNewestProducts
              ) {
                DeviceEventEmitter.emit('onRefreshProductsClothing', {
                  isRefresh: true
                })
                DeviceEventEmitter.emit('onRefreshProductsAccessory', {
                  isRefresh: true
                })
                setTimeout(() => {
                  DeviceEventEmitter.emit('refreshHomePage')
                }, 1000)
              }
              this.isPaymentSucceed = true
              this.play()
              if (me) {
                currentCustomerStore.updateCurrentCustomer(me)
                couponStore.updateValidCoupons(me)
              }
            } else {
              this.play()
              this.loopTimer = setTimeout(() => {
                this.getCurrentCustomer()
              }, this.loopTime * 1000)
            }
          } else {
            this.play()
            this.loopTimer = setTimeout(() => {
              this.getCurrentCustomer()
            }, this.loopTime * 1000)
          }
        },
        () => {
          this.play()
          this.loopTimer = setTimeout(() => {
            this.getCurrentCustomer()
          }, this.loopTime * 1000)
        }
      )
    }
  }

  play = () => {
    if (!this.isPlay) {
      this.isPlay = true
      this.progress.setValue(0)
      Animated.timing(this.progress, {
        toValue: 0.29,
        duration: 500,
        useNativeDriver: true,
        isInteraction: false
      }).start(() => {
        this.isPlay = false
        if (this.isPaymentSucceed) {
          this.progress.setValue(0)
          Animated.timing(this.progress, {
            toValue: 1,
            duration: 1250,
            useNativeDriver: true,
            isInteraction: false
          }).start(() => {
            this.gobackTime = setTimeout(() => {
              this.setState({ modalVisible: false }, () => {
                this.payDone()
              })
            }, 100)
          })
        } else {
          this.play()
        }
      })
    }
  }

  _renderItem = ({ item }) => {
    let isSelected = false
    const { plan } = this.state
    if (plan && plan.id && item.id === plan.id) {
      isSelected = true
    }
    return (
      <SubscriptionTypeItem
        isSelected={isSelected}
        item={item}
        didSelectedItem={this._selectPlan}
      />
    )
  }

  _extractUniqueKey(item, index) {
    return index.toString()
  }

  _productListHeader = () => {
    return <View style={{ height: 30, backgroundColor: '#fff' }} />
  }

  _selectPayType = () => {
    const { plan, loadingModalVisible, price } = this.state
    if (plan && !loadingModalVisible) {
      if (!price) {
        this.pay()
      } else {
        this.setState({ pupVisible: true })
      }
    }
  }

  _changeType = payType => {
    this.payType = payType
  }

  _popUpPanelOnClose = () => {
    this.setState({ pupVisible: false })
  }
  _popPanelHide = () => {
    this._popUpPanel._onHide()
  }

  render() {
    const {
      price,
      subscriptionTime,
      allAvailablePurchaseCredit,
      availablePurchaseCredit
    } = this.state
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          hasBottomLine={false}
          title={'购买度假套餐'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {this.state.loadingModalVisible ? (
            <View style={styles.loadingModal}>
              <ActivityIndicator animating={true} style={{ height: 80 }} />
            </View>
          ) : (
            <View>
              <FlatList
                showsVerticalScrollIndicator={false}
                keyExtractor={this._extractUniqueKey}
                data={this.state.subscriptionTypeList}
                extraData={this.state.plan}
                renderItem={this._renderItem}
                ListHeaderComponent={this._productListHeader}
              />
              {allAvailablePurchaseCredit > 0 ? (
                <View style={styles.payTypeView}>
                  <AvailablePurchaseCredit
                    allAvailablePurchaseCredit={allAvailablePurchaseCredit}
                    availablePurchaseCredit={availablePurchaseCredit}
                    style={styles.availablePurchaseCredit}
                  />
                </View>
              ) : null}
              <View style={styles.agreementView}>
                <Icon name={'info'} size={14} color="#ddd" />
                <Text style={styles.agreementMessage}>
                  本服务不支持退款，购买即视为同意
                  <Text
                    onPress={this.openAgreement}
                    style={{ color: '#2A2A2A', lineHeight: 16 }}>
                    《用户服务协议》
                  </Text>
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
        <View style={styles.payButtonView}>
          <View style={{ margin: 20, flex: 1 }}>
            <View style={styles.priceView}>
              <Text style={styles.priceLeftText}>应付</Text>
              <Text allowFontScaling={false} style={styles.priceRightText}>
                ￥{price}
              </Text>
            </View>
            <Text allowFontScaling={false} style={styles.subscriptionTime}>
              有效期{subscriptionTime}天
            </Text>
          </View>
          <TouchableOpacity
            style={styles.payButton}
            onPress={this._selectPayType}>
            <Text style={styles.payButtonTitle}>立即支付</Text>
          </TouchableOpacity>
        </View>
        <PopUpPanel
          ref={popUpPanel => (this._popUpPanel = popUpPanel)}
          onClose={this._popUpPanelOnClose}
          visible={this.state.pupVisible}
          height={330}>
          <PayType
            type={this.payType}
            changeType={this._changeType}
            price={price}
            pay={this.pay}
            onHide={this._popPanelHide}
          />
        </PopUpPanel>
        <Modal
          animationType={'none'}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}>
          {this.state.modalVisible ? (
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.35)'
              }}>
              <View style={styles.animationView}>
                <Animation
                  loop={true}
                  source={require('../../../assets/animation/payment/paysucces.json')}
                  progress={this.progress}
                />
              </View>
            </View>
          ) : null}
        </Modal>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  mainView: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
    alignItems: 'center'
  },
  subscriptionTime: {
    fontSize: 10,
    height: 12,
    color: '#C4C4C4'
  },
  payTypeView: {
    backgroundColor: '#fff'
  },
  payButtonView: {
    height: 50,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
    flexDirection: 'row',
    alignItems: 'center'
  },
  payButton: {
    width: p2d(210),
    height: p2d(44),
    backgroundColor: '#EA5C39',
    borderRadius: 2,
    marginRight: 3,
    justifyContent: 'center'
  },
  payButtonTitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#FFFFFF'
  },
  agreementView: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  availablePurchaseCredit: {
    marginLeft: p2d(20),
    width: p2d(335),
    height: p2d(44),
    backgroundColor: '#FFF',
    borderColor: '#d9d9d9',
    paddingHorizontal: p2d(15),
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth
  },
  agreementMessage: {
    fontSize: 12,
    marginLeft: 6,
    color: '#C4C4C4',
    lineHeight: 16
  },
  agreementButton: {
    marginLeft: 10
  },
  animationView: {
    height: 150,
    width: 150,
    position: 'absolute',
    top: Dimensions.get('window').height / 2 - 75,
    left: Dimensions.get('window').width / 2 - 75
  },
  loadingModal: {
    justifyContent: 'center'
  },
  priceView: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  priceLeftText: {
    fontSize: 14
  },
  priceRightText: {
    color: '#EA5C39',
    fontSize: 16
  }
})
