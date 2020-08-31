/* @flow */

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  DeviceEventEmitter,
  Text,
  AppState
} from 'react-native'
import ProductList from './product_list'
import {
  QNetwork,
  SERVICE_TYPES
} from '../../../../src/expand/services/services'
import { payOrder } from '../../../../src/expand/tool/payment'
import dateFns from 'date-fns'

import PaymentSuccessView from './payment_success'
import appsFlyer from 'react-native-appsflyer'
import { inject, observer } from 'mobx-react'
import { Client } from '../../../../src/expand/services/client'
import Statistics from '../../../../src/expand/tool/statistics'
import ToteBuyPromoCode from '../../totes/tote_buy_promo_code'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
@inject('currentCustomerStore', 'couponStore', 'appStore')
@observer
export default class PaymentPendingCard extends Component {
  constructor(props) {
    super(props)
    this.sortData()
    this.total_price = 0
    this.total_dynamic_price = 0
    this.tote_product_ids = []
    this.payResult = null
    const { line_items, tote } = props
    if (line_items) {
      line_items.map(item => {
        this.total_dynamic_price += item.amount
        this.total_price += item.product.full_price
        let toteProduct = tote.tote_products.find(function(i) {
          return i.product.id === item.product.id
        })
        this.tote_product_ids.push(toteProduct.id)
      })
    }
    this.PAY_STATUS = {
      PAID: 'PAID',
      PROCESSING: 'PROCESSING',
      UNPAID: 'UNPAID',
      QUERYPAYMENTRESULT: 'QUERYPAYMENTRESULT'
    }
    this.state = {
      payState: this.PAY_STATUS.UNPAID,
      nowPromoCode: null,
      promoCodes: [],
      cashPrice: null,
      finalPrice: null,
      promoCodePrice: null,
      validPromoCodes: [],
      invalidPromoCodes: []
    }
  }

  sortData = () => {
    const { tote, line_items } = this.props
    let map = {}
    this.dataSource = []
    line_items.map(item => {
      map[item.product.id] = item
      !item.product.category.accessory
        ? this.dataSource.unshift(item)
        : this.dataSource.push(item)
    })
    let toteProductList = []
    tote.tote_products.map(item => {
      !map[item.product.id]
        ? !item.product.category.accessory
          ? toteProductList.unshift(item)
          : toteProductList.push(item)
        : null
    })
    this.dataSource.push(...toteProductList)
  }

  componentDidMount() {
    this.toteTransactionPreview()
    DeviceEventEmitter.addListener('orderPaySuccess', () => {
      if (this.state.payState !== this.PAY_STATUS.PAID) {
        this.toteTransactionPreview()
      }
    })
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange = nextAppState => {
    if (
      nextAppState === 'active' &&
      this.state.payState === this.PAY_STATUS.PROCESSING &&
      !this.payResult
    ) {
      this.setState({ payState: this.PAY_STATUS.UNPAID })
    }
  }

  toteTransactionPreview = (lockPromoCode, disablePromoCode) => {
    const { tote, id } = this.props
    let input = {
      tote_id: tote.id,
      tote_product_ids: this.tote_product_ids,
      order_id: id
    }
    if (disablePromoCode) {
      input.disable_promo_code = true
    }
    if (lockPromoCode && this.state.nowPromoCode) {
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
            valid_promo_codes
          } = response.data.tote_checkout_preview
          const { cash_price, final_price, promo_code_price } = preview

          let nowPromoCode
          if (valid_promo_codes.length) {
            if (lockPromoCode) {
              nowPromoCode = this.state.nowPromoCode
            } else {
              nowPromoCode = valid_promo_codes[0]
            }
          } else {
            nowPromoCode = null
          }

          this.setState({
            nowPromoCode,
            cashPrice: cash_price,
            finalPrice: final_price,
            promoCodePrice: promo_code_price,
            validPromoCodes: valid_promo_codes,
            invalidPromoCodes: invalid_promo_codes
          })
        }
      }
    )
  }

  payment = paymentMethod => {
    if (
      this.state.payState === this.PAY_STATUS.PAID ||
      this.state.payState === this.PAY_STATUS.PROCESSING ||
      this.state.payState === this.PAY_STATUS.QUERYPAYMENTRESULT
    ) {
      return null
    }
    this.setState({ payState: this.PAY_STATUS.PROCESSING })
    let promoCode = this.state.nowPromoCode
      ? this.state.nowPromoCode.code
      : null
    payOrder(this.props.id, promoCode, paymentMethod).then(result => {
      this.payResult = result
      if (result && result.errCode === 0) {
        this.setState({ payState: this.PAY_STATUS.QUERYPAYMENTRESULT })
        this.payTimer = setTimeout(() => {
          this.props.queryResult(this.queryPaymentResult)
        }, 500)
      } else {
        this.props.appStore.showToast('支付失败', 'error')
        this.setState({ payState: this.PAY_STATUS.UNPAID })
        this.payResult = null
      }
    })
  }

  queryPaymentResult = response => {
    let isPaySuccess = true
    if (response.orders) {
      response.orders.map(item => {
        if (item.id === this.props.id) {
          isPaySuccess = false
          this.loopTimer = setTimeout(() => {
            this.props.queryResult(this.queryPaymentResult)
            this.loopTimer = 0
          }, 1000)
        }
      })
    }
    if (isPaySuccess) {
      this.setState({ payState: this.PAY_STATUS.PAID }, () => {
        this.refreshPromoCode()
        DeviceEventEmitter.emit('orderPaySuccess')
        DeviceEventEmitter.emit('onRefreshTotes')
        this.props.paySuccess(response)
        this._reportEvent()
      })
    }
  }
  _reportEvent = () => {
    const { id } = this.props.currentCustomerStore
    const amounts = this.total_dynamic_price - this.purchase_credit
    Statistics.onEvent({
      id: 'pay_products',
      label: '购买待付款商品',
      attributes: { amounts: amounts + '', userId: id + '' }
    })

    // 正式环境才上报appsflyer事件
    if (Client.ORIGIN.indexOf('wechat.') !== -1) {
      const eventName = 'pay_products'
      const eventValues = { af_currency: 'CNY', af_revenue: amounts }
      appsFlyer.trackEvent(eventName, eventValues, () => {}, () => {})
    }
  }

  refreshPromoCode = () => {
    QNetwork(
      SERVICE_TYPES.me.QUERY_ME_VALID_PROMOCODES,
      { type: 'All' },
      response => {
        const { me } = response.data
        this.props.couponStore.validPromoCodes = me.valid_promo_codes
      }
    )
  }

  componentWillUnmount() {
    this.payTimer && clearTimeout(this.payTimer)
    this.loopTimer && clearTimeout(this.loopTimer)
    AppState.removeEventListener('change', this._handleAppStateChange)
    DeviceEventEmitter.removeAllListeners('orderPaySuccess')
  }

  openProductDetail = item => {
    this.props.onPressProduct && this.props.onPressProduct(item)
  }

  _userPromoCode = () => {
    const { nowPromoCode, validPromoCodes, invalidPromoCodes } = this.state
    this.props.navigation.navigate('UsePromoCode', {
      onSelect: this._onSelect,
      nowPromoCode,
      validPromoCodes,
      invalidPromoCodes,
      hideDiffAmount: true
    })
  }

  _onSelect = nowPromoCode => {
    this.setState({ nowPromoCode }, () => {
      this.toteTransactionPreview(true, !nowPromoCode)
    })
  }
  showPannel = () => {
    this.props.preparePayment(this.payment, this.state.finalPrice)
    this.props.showPannel()
  }

  render() {
    const { style, created_at } = this.props
    const {
      nowPromoCode,
      cashPrice,
      finalPrice,
      promoCodePrice,
      validPromoCodes
    } = this.state
    let discountPrice = this.total_price - finalPrice
    return (
      <View style={style}>
        <Text style={styles.date}>
          {dateFns.format(created_at, 'YYYY-MM-DD')}
        </Text>
        <ProductList
          onPress={this.openProductDetail}
          style={styles.product}
          data={this.dataSource}
        />
        <View style={styles.priceContainerView}>
          <View style={styles.specificPriceView}>
            <Text style={styles.hui14}>商品小计</Text>
            <Text style={styles.hei14}>￥{this.total_dynamic_price}</Text>
          </View>
          <ToteBuyPromoCode
            nowPromoCode={nowPromoCode}
            isPayEnd={this.state.payState === this.PAY_STATUS.PAID}
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
        </View>
        {this.props.overdue_surcharge_tips && (
          <View style={styles.messageContainer}>
            <Icon name={'alert-circle'} color={'#E85C40'} size={20} />
            <Text style={styles.message}>
              {this.props.overdue_surcharge_tips}
            </Text>
          </View>
        )}
        <View style={styles.payContainer}>
          <View style={styles.textDynamicContainer}>
            <Text style={styles.textDynamic}>
              合计: ￥<Text style={styles.textDynamicPrice}>{finalPrice}</Text>
            </Text>
          </View>
          <View style={styles.textSaveContain}>
            <Text style={styles.textSave}>为你节省￥{discountPrice}</Text>
          </View>
          <TouchableOpacity
            style={
              this.state.payState === this.PAY_STATUS.PAID
                ? styles.buttonPayed
                : styles.buttonPay
            }
            disabled={this.state.payState !== this.PAY_STATUS.UNPAID}
            onPress={this.showPannel}>
            <Text style={styles.textPay}>
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
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  payContainer: {
    backgroundColor: '#F2F2F5',
    marginTop: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textDynamic: {
    fontSize: 12,
    color: '#242424'
  },
  textDynamicPrice: {
    fontSize: 16,
    color: '#121212'
  },
  textDynamicContainer: {
    borderRightWidth: 1,
    borderRightColor: '#D8D8D8',
    width: '33%',
    height: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textSave: {
    fontSize: 12,
    color: '#989898'
  },
  textSaveContain: {
    width: '33%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textPay: {
    fontSize: 14,
    color: '#FFFFFF'
  },
  buttonPay: {
    backgroundColor: '#EA5C39',
    alignItems: 'center',
    width: '34%',
    height: 48,
    justifyContent: 'center'
  },
  buttonPayed: {
    backgroundColor: '#F8CEC3',
    alignItems: 'center',
    width: '34%',
    height: 48,
    justifyContent: 'center'
  },
  product: {
    marginBottom: 10
  },
  date: {
    fontSize: 14,
    color: '#242424',
    marginBottom: 14
  },
  payView: {
    width: '100%',
    position: 'absolute',
    zIndex: 1
  },
  priceContainerView: {
    backgroundColor: 'white',
    marginTop: 7
  },
  hei14: {
    fontSize: 14,
    color: '#333'
  },
  hui14: {
    fontSize: 14,
    color: '#666'
  },
  specificPriceView: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F2F2F2'
  },
  messageContainer: {
    marginTop: 18,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center'
  },
  message: {
    fontSize: 12,
    color: '#E85C40',
    marginLeft: 7
  }
})
