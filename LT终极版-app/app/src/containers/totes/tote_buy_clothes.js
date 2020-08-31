import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  DeviceEventEmitter,
  Text,
  Modal,
  AppState,
  FlatList,
  ActivityIndicator
} from 'react-native'
import {
  NavigationBar,
  BarButtonItem,
  SafeAreaView
} from '../../../storybook/stories/navigationbar'
import { QNetwork, SERVICE_TYPES, Mutate } from '../../expand/services/services'
import PaymentSuccessView from '../../../storybook/stories/account/payment_pending/payment_success'
import { inject } from 'mobx-react'
import p2d from '../../expand/tool/p2d'
import Statistics from '../../expand/tool/statistics'
import PopUpPanel from '../../components/pop_up_panel'
import PayType from '../../../storybook/stories/account/join_member/pay_type_view'
import { sendPayRequest, getPaymentId } from '../../expand/tool/payment'
import PaymentConstants from '../../expand/tool/payment_constanst'
import ToteBuyPromoCode from '../../../storybook/stories/totes/tote_buy_promo_code'
import { updateBalance } from '../../expand/tool/balance'
import NonReturnedItem from '../../../storybook/stories/totes/tote_buy_clothes/non_returned_item'
import SelectProductItem from '../../../storybook/stories/totes/tote_buy_clothes/select_product_item'
import BuyClothesGuide from '../../../storybook/stories/alert/buy_clothes_guide'
@inject('appStore', 'currentCustomerStore', 'modalStore', 'guideStore')
export default class ToteBuyClothesContainer extends Component {
  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    const { toteProduct, toteId } = params
    this.PAY_STATUS = {
      PAID: 'PAID',
      PROCESSING: 'PROCESSING',
      UNPAID: 'UNPAID',
      QUERYPAYMENTRESULT: 'QUERYPAYMENTRESULT'
    }
    const productState =
      params.toteProduct.product_item.state === 'purchased'
        ? this.PAY_STATUS.PAID
        : this.PAY_STATUS.UNPAID
    this.state = {
      allAvailablePurchaseCredit: 0,
      payState: productState,
      isLoading: true,
      nowPromoCode: null,
      discount: null,
      promoCodes: [],
      modalVisible: false,
      pupVisible: false,
      selectProduct: [toteProduct],
      cashPrice: null,
      finalPrice: null,
      promoCodePrice: null,
      validPromoCodes: [],
      invalidPromoCodes: [],
      discountTotal: 0,
      nextPromoCodeHint: null
    }
    this.payResult = null
    this.tote_id = toteId
    this.payment_method_id = -1
    this.deafultState = productState
    this.queryNum = 0
    this.orderId = 0
    this.paymentMethod = PaymentConstants.type.DEFAULT_PAYMENT_NATIVE
  }
  componentDidMount() {
    this.toteTransactionPreview()
    this.returnPaymentMethodId()
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange = nextAppState => {
    if (
      nextAppState === 'active' &&
      this.state.payState === this.PAY_STATUS.PROCESSING &&
      !this.payResult
    ) {
      this.setState({
        payState: this.PAY_STATUS.UNPAID,
        modalVisible: false
      })
    }
  }

  toteTransactionPreview = (refresh, disablePromoCode) => {
    this.setState({
      modalVisible: true
    })
    const { selectProduct } = this.state
    let tote_product_ids = []
    selectProduct.map(item => {
      tote_product_ids.push(item.id)
    })
    let input = {
      tote_id: this.tote_id,
      tote_product_ids
    }
    if (disablePromoCode) {
      input.disable_promo_code = true
    }
    if (this.state.nowPromoCode && !disablePromoCode) {
      input.promo_code = this.state.nowPromoCode.code
    }
    QNetwork(
      SERVICE_TYPES.totes.QUERY_TOTE_CHECKOUT_PREVIEW,
      input,
      response => {
        if (response) {
          const {
            invalid_promo_codes,
            preview,
            valid_promo_codes,
            next_promo_code_hint
          } = response.data.tote_checkout_preview
          const { cash_price, final_price, promo_code_price } = preview
          this.setState(
            {
              cashPrice: cash_price,
              finalPrice: final_price,
              promoCodePrice: promo_code_price,
              validPromoCodes: valid_promo_codes,
              invalidPromoCodes: invalid_promo_codes,
              nowPromoCode:
                valid_promo_codes.length > 0 && !refresh
                  ? valid_promo_codes[0]
                  : this.state.nowPromoCode,
              discountTotal: promo_code_price + cash_price,
              isLoading: false,
              nextPromoCodeHint: next_promo_code_hint,
              modalVisible: false
            },
            () => {
              const { guideStore, modalStore } = this.props
              if (!guideStore.buyClothesGuideShowed) {
                modalStore.show(
                  <BuyClothesGuide
                    onFinishedGuide={() => {
                      modalStore.hide()
                      guideStore.buyClothesGuideShowed = true
                    }}
                    style={!next_promo_code_hint ? { marginTop: -40 } : null}
                  />
                )
              }
            }
          )
        }
      },
      () => {
        this.setState({ modalVisible: false })
      }
    )
  }

  _popUpPanelOnClose = () => {
    this.setState({ pupVisible: false })
  }
  _showPannel = () => {
    if (!this.state.finalPrice) {
      this.payProduct()
    } else {
      this.setState({ pupVisible: true })
    }
  }
  _popPanelHide = () => {
    this._popUpPanel._onHide()
  }

  openPageReportEvent = () => {
    const { allAvailablePurchaseCredit, finalPrice } = this.state
    const { toteProduct } = this.props.navigation.state.params
    let input = {
      order_amount: toteProduct.tote_specific_price + '',
      has_promo_code: false,
      promo_code_name: '',
      promo_code_amount: '0',
      has_purchase_credit: !!allAvailablePurchaseCredit ? 'true' : 'false',
      purchase_credit_amount: allAvailablePurchaseCredit + '',
      id: toteProduct.product.id + '', //商品id
      title: toteProduct.product.title,
      first_category: toteProduct.product.category.name,
      second_category: '',
      brand_id: toteProduct.product.brand.id + '', //品牌id
      price: finalPrice + ''
    }
    Statistics.onEvent({
      id: 'visit_pay_product',
      label: '访问购买商品页',
      attributes: {
        ...input
      }
    })
  }

  componentWillUnmount() {
    this.payTimer && clearTimeout(this.payTimer)
    this.loopTimer && clearTimeout(this.loopTimer)
    this.contractPayTimer && clearTimeout(this.contractPayTimer)
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _goBack = free_service_fee_tip => {
    this.props.navigation.goBack()
    if (!free_service_fee_tip) {
      return
    }
    const { content, title } = free_service_fee_tip
    if (title && content) {
      const { showFreeSeverTip } = this.props.navigation.state.params
      showFreeSeverTip && showFreeSeverTip(title, content)
    }
  }

  returnPaymentMethodId = () => {
    const { currentCustomerStore } = this.props
    if (currentCustomerStore.enablePaymentContract.length > 0) {
      this.payment_method_id =
        currentCustomerStore.enablePaymentContract[0].payment_method_gateway ===
        'wechat_contract_official'
          ? -3
          : -4
    }
  }

  payWithPaymentMethodId = () => {
    this.payProduct(-1)
  }

  payError = () => {
    this.payWithPaymentMethodId()
  }

  _updateCredit = () => {
    updateBalance()
  }

  _reportEvent = (orderId, payDone) => {
    //上报
    const { allAvailablePurchaseCredit, finalPrice } = this.state
    const { toteProduct } = this.props.navigation.state.params
    let inputs = {
      order_amount: toteProduct.tote_specific_price + '',
      has_promo_code: false,
      promo_code_name: '',
      promo_code_amount: '0',
      has_purchase_credit: !!allAvailablePurchaseCredit ? 'true' : 'false',
      purchase_credit_amount: allAvailablePurchaseCredit + '',
      id: orderId + '', //订单ID
      product_id: toteProduct.product.id + '',
      title: toteProduct.product.title,
      first_category: toteProduct.product.category.name,
      second_category: '',
      brand_id: toteProduct.product.brand.id + '', //品牌id
      pay_type: PaymentConstants.type.WECHAT_NATIVE,
      pay_amount: finalPrice + ''
    }
    Statistics.onEvent({
      id: payDone ? 'pay_order' : 'submit_order',
      label: payDone ? '支付订单' : '提交购买订单',
      attributes: {
        ...inputs
      }
    })
    ///////
  }

  payProduct = currentPaymentMethodId => {
    if (this.state.payState !== this.PAY_STATUS.UNPAID) {
      return
    }
    this.setState({
      payState: this.PAY_STATUS.PROCESSING,
      modalVisible: true
    })
    this.queryNum = 0
    const { tote_id, payment_method_id } = this
    let paymenId = getPaymentId(
      this.paymentMethod,
      payment_method_id,
      currentPaymentMethodId,
      this.state.finalPrice
    )
    let tote_product_ids = []
    this.state.selectProduct.map(item => {
      tote_product_ids.push(item.id)
    })
    let input = {
      tote_id,
      tote_product_ids,
      payment_method_id: paymenId
    }
    if (this.state.nowPromoCode) {
      input.promo_code = this.state.nowPromoCode.code
    }
    Mutate(
      SERVICE_TYPES.totes.MUTATION_TOTE_CHECKOUT_PRODUCT,
      { input },
      response => {
        this.orderId = response.data.CheckoutToteProducts.order.id
        this._reportEvent(this.orderId, false)
        if (
          this.paymentMethod !== PaymentConstants.type.WECHAT_NATIVE ||
          paymenId === -1
        ) {
          this.normalPayResult(response)
        } else {
          this.contractPayResult(response.data.CheckoutToteProducts.order.id)
        }
      },
      () => {
        this.props.appStore.showToast('支付失败', 'error')
        this.setState({
          payState: this.PAY_STATUS.UNPAID,
          modalVisible: false
        })
      }
    )
  }

  //免密支付
  contractPayResult = id => {
    let input = {
      id
    }
    if (this.state.payState !== this.PAY_STATUS.QUERYPAYMENTRESULT) {
      this.setState({
        payState: this.PAY_STATUS.QUERYPAYMENTRESULT
      })
    }
    this.queryNum += 1
    QNetwork(SERVICE_TYPES.totes.QUERY_PRODUCT_ORDER, input, response => {
      const {
        successful,
        payment_failed,
        free_service_fee_tip
      } = response.data.order
      if (successful) {
        // 免密支付成功
        this.setState(
          {
            payState: this.PAY_STATUS.PAID,
            modalVisible: false
          },
          () => {
            this._reportEvent(this.orderId, true)
            DeviceEventEmitter.emit('onRefreshTotes')
            setTimeout(() => {
              this._goBack(free_service_fee_tip)
            }, 1000)
          }
        )
      } else if (!payment_failed && this.queryNum < 30) {
        this.contractPayTimer = setTimeout(() => {
          this.contractPayResult(id)
        }, 2000)
      } else {
        this.setState(
          {
            payState: this.PAY_STATUS.UNPAID,
            modalVisible: false
          },
          () => {
            this.payError()
          }
        )
      }
    })
  }
  //正常支付
  normalPayResult = response => {
    if (
      response.data.CheckoutToteProducts.payment &&
      response.data.CheckoutToteProducts.payment.authorization_details
    ) {
      let products = response.data.CheckoutToteProducts
      sendPayRequest(products).then(result => {
        this.payResult = result
        if (result && result.errCode === 0) {
          this.setState({
            payState: this.PAY_STATUS.QUERYPAYMENTRESULT
          })
          this.contractPayResult(this.orderId)
        } else {
          this.props.appStore.showToast('支付失败', 'error')
          this.setState({
            payState: this.PAY_STATUS.UNPAID,
            modalVisible: false
          })
          this.payResult = null
        }
      })
    } else {
      this.setState({
        payState: this.PAY_STATUS.QUERYPAYMENTRESULT
      })
      this.contractPayResult(this.orderId)
    }
  }

  _changeType = paymentMethod => {
    this.paymentMethod = paymentMethod
  }

  _userPromoCode = () => {
    const { nowPromoCode, validPromoCodes, invalidPromoCodes } = this.state
    this.props.navigation.navigate('UsePromoCode', {
      onSelect: this._onSelect,
      nowPromoCode,
      validPromoCodes,
      invalidPromoCodes
    })
  }

  _onSelect = nowPromoCode => {
    this.setState({ nowPromoCode }, () => {
      this.toteTransactionPreview(true, !nowPromoCode)
    })
  }

  _keyExtractor = (item, index) => index.toString()

  setSelectProduct = product => {
    const { selectProduct } = this.state
    const isSelected = selectProduct.find(i => {
      return i.id === product.id
    })
    let newSelectProduct = [...selectProduct]
    if (isSelected) {
      newSelectProduct = selectProduct.filter(item => {
        return item.id !== product.id
      })
    } else {
      newSelectProduct.push(product)
    }
    this.setState(
      {
        selectProduct: newSelectProduct,
        nowPromoCode: null
      },
      () => {
        this.toteTransactionPreview()
      }
    )
  }

  nonReturnedItem = ({ item, index }) => {
    const { selectProduct } = this.state
    const photo = item.product.catalogue_photos[0]
    const photoUrl = photo
      ? photo.thumb_url
        ? photo.thumb_url
        : photo.full_url
      : ''
    const isSelected = selectProduct.find(i => {
      return i.id === item.id
    })
    const url = isSelected
      ? require('../../../assets/images/me_style/focus_button.png')
      : require('../../../assets/images/me_style/blur_button.png')
    return (
      <NonReturnedItem
        iconUrl={url}
        setSelectProduct={this.setSelectProduct}
        photoUrl={photoUrl}
        product={item}
        index={index}
      />
    )
  }

  selectProductItem = ({ item }) => {
    const photo = item.product.catalogue_photos[0]
    const photoUrl = photo
      ? photo.thumb_url
        ? photo.thumb_url
        : photo.full_url
      : ''
    return (
      <SelectProductItem
        toteProduct={item}
        photoUrl={photoUrl}
        size={item.product_size.size_abbreviation}
        modifiedPrice={item.transition_info.modified_price}
      />
    )
  }

  listHeaderComponent = () => {
    return (
      <View style={styles.listHeaderComponent}>
        <Text style={styles.listHeaderComponentText}>已选购的商品</Text>
      </View>
    )
  }

  listFooterComponent = () => {
    const { selectProduct } = this.state
    let price = 0
    selectProduct.map(item => {
      price = price + item.transition_info.modified_price
    })
    return (
      <View style={styles.listFooterComponent}>
        <Text style={styles.listFooterComponentLeftText}>商品小计</Text>
        <Text style={styles.listFooterComponentRightText}>¥{price}</Text>
      </View>
    )
  }

  returnNewNonReturnedlist = () => {
    const { params } = this.props.navigation.state
    const { toteProduct, nonReturnedlist } = params
    let newNonReturnedlist = []
    newNonReturnedlist = nonReturnedlist.filter(item => {
      return item.id !== toteProduct.id
    })
    newNonReturnedlist.unshift(toteProduct)
    return newNonReturnedlist
  }

  render() {
    const { currentCustomerStore } = this.props
    const {
      nowPromoCode,
      cashPrice,
      finalPrice,
      discountTotal,
      promoCodePrice,
      validPromoCodes,
      nextPromoCodeHint,
      modalVisible
    } = this.state
    const newNonReturnedlist = this.returnNewNonReturnedlist()
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <NavigationBar
          title={'折扣购买'}
          leftBarButtonItem={
            <BarButtonItem onPress={this._goBack} buttonType={'back'} />
          }
        />
        <ScrollView>
          <View style={styles.container}>
            {nextPromoCodeHint && (
              <View style={styles.nextPromoCodeHintView}>
                <Text style={styles.nextPromoCodeHintText}>
                  {nextPromoCodeHint}
                </Text>
              </View>
            )}

            <FlatList
              style={styles.nonReturnedlist}
              data={newNonReturnedlist}
              keyExtractor={this._keyExtractor}
              renderItem={this.nonReturnedItem}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
            <FlatList
              style={styles.selectProductlist}
              scrollEnabled={false}
              data={this.state.selectProduct}
              keyExtractor={this._keyExtractor}
              renderItem={this.selectProductItem}
              ListHeaderComponent={this.listHeaderComponent}
              ListFooterComponent={this.listFooterComponent}
            />

            <View style={styles.priceContainerView}>
              <ToteBuyPromoCode
                isPayEnd={false}
                nowPromoCode={nowPromoCode}
                discount={promoCodePrice}
                userPromoCode={this._userPromoCode}
                promoCodesNum={validPromoCodes.length}
              />
              {cashPrice > 0 && (
                <View style={styles.specificPriceView}>
                  <Text style={styles.hui14}>奖励金</Text>
                  <Text style={styles.hei14}>-￥{cashPrice}</Text>
                </View>
              )}
              <View style={styles.specificPriceView}>
                <Text style={styles.hui14}>优惠合计</Text>
                <Text style={styles.hei14}>-￥{discountTotal}</Text>
              </View>
            </View>
            <View style={styles.tipsView}>
              <Text style={[styles.hei14, styles.tipsName]}>购买说明</Text>
              <View style={styles.tipsContainerView}>
                <Text style={styles.tipsText}>
                  1、购买成功后将此商品留下，其余商品随衣箱归还 {'\n'}
                  2、本平台所有商品皆为特殊商品，购买后不支持退换
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonView}>
          <View style={styles.leftButton}>
            <Text style={styles.hei14}>
              合计:
              <Text style={styles.payablePrice}>￥{finalPrice}</Text>
            </Text>
          </View>

          <TouchableOpacity
            onPress={this._showPannel}
            style={[
              styles.rightButton,
              this.state.payState === this.PAY_STATUS.PAID
                ? styles.buttonPayed
                : styles.buttonPay
            ]}
            disabled={
              this.state.payState === this.PAY_STATUS.PAID ||
              this.state.isLoading
            }>
            <Text style={styles.bai14}>
              {this.state.payState === this.PAY_STATUS.PROCESSING
                ? '支付中...'
                : this.state.payState === this.PAY_STATUS.QUERYPAYMENTRESULT
                ? '查询支付结果...'
                : this.state.payState === this.PAY_STATUS.PAID
                ? '支付成功'
                : '立即支付'}
            </Text>
          </TouchableOpacity>
          {this.state.payState === this.PAY_STATUS.PAID ? (
            <PaymentSuccessView
              style={styles.payView}
              ref={ref => (this.paymentSuccessView = ref)}
            />
          ) : null}
        </View>
        <Modal
          animationType={'none'}
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {}}
        />
        <PopUpPanel
          ref={popUpPanel => (this._popUpPanel = popUpPanel)}
          onClose={this._popUpPanelOnClose}
          visible={this.state.pupVisible}
          height={330}>
          <PayType
            isContract={currentCustomerStore.enablePaymentContract.length > 0}
            type={this.paymentMethod}
            changeType={this._changeType}
            price={finalPrice}
            pay={this.payProduct}
            onHide={this._popPanelHide}
          />
        </PopUpPanel>
        {modalVisible && (
          <View style={styles.loadingView}>
            <ActivityIndicator
              animating={true}
              style={styles.loadingViewIcon}
            />
          </View>
        )}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7'
  },
  nextPromoCodeHintView: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    paddingLeft: 16,
    backgroundColor: '#FEF8F2'
  },
  nextPromoCodeHintText: {
    fontSize: 12,
    color: '#BD8846'
  },
  loadingView: {
    position: 'absolute',
    flex: 1,
    height: '100%',
    width: '100%',
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingViewIcon: {
    height: 40,
    width: 40
  },
  priceContainerView: {
    backgroundColor: 'white',
    marginTop: 7,
    paddingLeft: 16,
    paddingRight: 16
  },
  hei14: {
    fontSize: 14,
    color: '#333'
  },
  hui14: {
    fontSize: 14,
    color: '#666'
  },
  bai14: {
    fontSize: 14,
    color: '#FFF'
  },
  specificPriceView: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F2F2F2'
  },
  PriceView: {
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  tipsView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 7,
    paddingTop: 16
  },
  tipsContainerView: {
    width: p2d(345),
    backgroundColor: '#F2F2F5',
    padding: 15,
    marginBottom: 16
  },
  tipsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 22
  },
  payablePrice: {
    fontSize: 16,
    color: '#EA5C39'
  },
  leftButton: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center'
  },
  rightButton: {
    flex: 1,
    height: 44,
    width: 185,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonPay: {
    backgroundColor: '#EA5C39'
  },
  buttonPayed: {
    backgroundColor: '#F8CEC3'
  },
  payView: {
    width: '100%',
    position: 'absolute',
    zIndex: 1
  },
  buttonView: {
    borderTopWidth: 1,
    borderTopColor: '#E6E6E6',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center'
  },
  listHeaderComponent: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2'
  },
  listHeaderComponentText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    marginTop: 16
  },
  listFooterComponent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15
  },
  listFooterComponentLeftText: {
    color: '#5e5e5e',
    fontSize: 14
  },
  listFooterComponentRightText: {
    fontSize: 14,
    color: '#333'
  },
  nonReturnedlist: {
    backgroundColor: '#fff',
    flex: 1
  },
  selectProductlist: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginTop: 7
  },
  tipsName: {
    marginBottom: 16,
    alignSelf: 'flex-start',
    marginLeft: 16
  }
})
