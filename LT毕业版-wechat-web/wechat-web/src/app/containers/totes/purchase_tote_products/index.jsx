import React, { Component } from 'react'
import { compose, lifecycle, branch, renderNothing } from 'recompose'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions.js'
import SubmitSuccess from 'src/app/containers/ratings/submit_success'
import wxInit from 'src/app/lib/wx_config.js'
import { navigateToMiniProgram } from 'src/app/containers/plans/mini_program/index.js'
import {
  JD_PAYMENT_METHODS_ID,
  UNWECHAT_PAYMENT_METHODS_ID,
  MINI_APP_PAYMENT_METHODS_ID,
  WECHAT_CONTRACT_METHODS_ID,
  MINIAPP_CONTRACT_METHODS_ID,
  MAX_CONTRACT_PAY_PRICE
} from 'src/app/lib/card_type.js'
import PageHelmet from 'src/app/lib/pagehelmet'
import ProductSwiperItem from './product_swiper'
import PromoceSelect from 'src/app/containers/account/payment_pending/products_item/promo_code_select'
import PurchaseGuide from 'src/app/containers/totes/purchase_tote_products/purchase_guide'
import './index.scss'

const ListLtem = React.memo(
  ({ title, price, className }) => (
    <div className={className || 'discount'}>
      {title}
      <span className="price">-&yen;{price}</span>
    </div>
  ),
  (prevProps, nextProps) => prevProps.price === nextProps.price
)

// NOTE: query contract payment result num
const QUERY_NUMBER = 10

const getState = (state, props) => {
  const { totes, customer, app, purchaseCheckout, promoCode } = state
  return {
    totes,
    currentTotes: _.find(
      totes.current_totes,
      v => v.id === Number(props.location.query.toteId)
    ),
    customer,
    app,
    purchaseCheckout,
    promoCode
  }
}

const enhance = compose(
  connect(getState),
  lifecycle({
    componentWillMount() {
      if (_.isEmpty(this.props.currentTotes)) {
        this.props.dispatch(Actions.totes.fetchLatestRentalAndPurchaseTote())
      }
    }
  }),
  branch(props => _.isEmpty(props.currentTotes), renderNothing)
)

@enhance
export default class PurchaseToteProducts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      payment_state: 'unpaid',
      cash_price: null,
      final_price: null,
      promo_code_price: null,
      hasFetchPreview: false,
      next_promo_code_hint: null,
      valid_promo_codes: []
    }
    this.queryNum = 0
  }

  componentDidMount() {
    const { tote_id } = this.purchaseToteProduct
    const {
      params: { tote_product_id },
      promoCode: { code, codeState, type },
      purchaseCheckout: { purchase_ids }
    } = this.props
    const isPreview = type === 'reset' || type === 'DiscountPromoCode'
    const isDisable = _.isEmpty(code) && isPreview && codeState === 'valid'
    let tote_product_ids = purchase_ids
    if (_.isEmpty(purchase_ids)) {
      tote_product_ids = [Number(tote_product_id)]
      this.props.dispatch(
        Actions.purchaseCheckout.setPurchaseIds(tote_product_ids)
      )
    }
    this.getToteCheckoutPreview({
      code,
      tote_id,
      tote_product_ids,
      order_id: '',
      disable_promo_code: isDisable
    })
    wxInit()
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.payment_state !== this.state.payment_state) {
      if (nextState.payment_state === 'fail') {
        this.resetHint()
      } else if (nextState.payment_state === 'success') {
        this.resetHint(true)
      }
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
    this.contractPayTimer && clearTimeout(this.contractPayTimer)
  }

  getToteCheckoutPreview = ({
    code,
    tote_id,
    tote_product_ids,
    order_id,
    disable_promo_code = false
  }) => {
    this.props.dispatch(
      Actions.purchaseCheckout.totesCheckoutPreview({
        promo_code: code,
        tote_id: tote_id,
        tote_product_ids,
        order_id,
        disable_promo_code,
        success: this.handleToteCheckout
      })
    )
  }

  handleToteCheckout = (dispatch, resData) => {
    const {
      data: {
        tote_checkout_preview: {
          next_promo_code_hint,
          preview: { cash_price, final_price, promo_code_price },
          valid_promo_codes
        }
      }
    } = resData
    const { promoCode } = this.props
    if (promoCode.codeState !== 'valid') {
      dispatch(Actions.promoCode.set(valid_promo_codes[0]))
    }
    this.setState({
      cash_price,
      final_price,
      promo_code_price,
      hasFetchPreview: true,
      next_promo_code_hint,
      valid_promo_codes
    })
  }

  resetHint = (isGoback = false) => {
    this.timer = setTimeout(() => {
      this.setState({
        payment_state: 'unpaid'
      })
      isGoback && this.props.router.goBack()
      this.resetButtonState()
    }, 2000)
  }

  resetButtonState = state =>
    this.props.dispatch(Actions.app.buttonState(state))

  handlePurchaseProduct = () => {
    const {
        customer: { payment_methods },
        app: { platform },
        promoCode: { code, codeState },
        purchaseCheckout: { purchase_ids },
        dispatch
      } = this.props,
      payment_method = _.find(payment_methods, {
        payment_gateway: platform
      }),
      tote_product_ids = purchase_ids
    this.resetButtonState('pending')

    let payment_method_id = ''
    if (platform === 'mini_app') {
      payment_method_id =
        this.hasContract && this.isValidContractPay
          ? MINIAPP_CONTRACT_METHODS_ID
          : MINI_APP_PAYMENT_METHODS_ID
    } else if (platform === 'wechat') {
      payment_method_id =
        this.hasContract && this.isValidContractPay
          ? WECHAT_CONTRACT_METHODS_ID
          : !_.isEmpty(payment_method) && payment_method.id
    } else if (platform === 'jd') {
      payment_method_id = JD_PAYMENT_METHODS_ID
    } else {
      payment_method_id = UNWECHAT_PAYMENT_METHODS_ID
    }
    dispatch(
      Actions.purchaseCheckout.toteCheckoutProducts({
        tote_id: this.purchaseToteProduct.tote_id,
        tote_product_ids: tote_product_ids,
        payment_method_id,
        promo_code: codeState === 'valid' ? code : '',
        success: this.checkoutToteSuccess
      })
    )
  }

  checkToteProductOrder = (orders, id) => {
    let findIndex = -1
    orders.forEach((item, index) => {
      item.line_items.forEach(i => {
        if (i.product.id === id) {
          findIndex = index
        }
      })
    })
    if (findIndex !== -1) {
      return orders[findIndex]
    } else {
      return false
    }
  }

  checkoutToteSuccess = (dispatch, resData) => {
    const {
      app: { platform }
    } = this.props
    const { CheckoutToteProducts } = resData.data
    // NOTE: contract payment
    if (this.hasContract && this.isValidContractPay) {
      const order_id = CheckoutToteProducts.order.id
      this.fetchOrder(order_id)
      return null
    }

    if (CheckoutToteProducts.order.successful) {
      this.setState({
        payment_state: 'success'
      })
      return null
    }

    const { authorization_details } = CheckoutToteProducts.payment
    const authorizationDetails = JSON.parse(authorization_details)
    if (platform === 'jd') {
      window.location.href = authorizationDetails.url
      return null
    }

    //mini program
    if (platform === 'mini_app') {
      this.resetButtonState('reset')
      const params = {
        payParams: authorization_details,
        redirect_url: '/totes'
      }
      navigateToMiniProgram(params)
      return null
    }

    //NOTE: wechat payment
    wx.chooseWXPay({
      timestamp: authorizationDetails.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: authorizationDetails.nonceStr, // 支付签名随机串，不长于 32 位
      package: authorizationDetails.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      signType: authorizationDetails.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: authorizationDetails.paySign, // 支付签名
      success: () => {
        this.setState({ payment_state: 'success' })
        this.resetButtonState('reset')
      },
      fail: () => {
        this.setState({
          payment_state: 'fail'
        })
        this.resetButtonState('reset')
        wxInit(true, () => this.checkoutToteSuccess(dispatch, resData))
      },
      cancel: () => this.resetButtonState()
    })
  }

  fetchOrder = id => {
    this.queryNum++
    this.props.dispatch(
      Actions.orders.fetchOrder(id, this.handleFectchOrderSuc)
    )
  }

  handleFectchOrderSuc = (dispatch, resData, action) => {
    const {
      data: {
        order: { successful, payment_failed }
      }
    } = resData
    const id = action.variables.id
    if (successful) {
      this.setState({
        payment_state: 'success'
      })
    } else if (!payment_failed && this.queryNum < QUERY_NUMBER) {
      this.contractPayTimer = setTimeout(() => {
        this.fetchOrder(id)
      }, 2000)
    } else {
      this.setState({
        payment_state: 'fail'
      })
    }
  }

  handleSelectPromoCode = () => browserHistory.push('/promo_code_list')

  get purchaseToteProduct() {
    const { params, currentTotes } = this.props
    const tote_product_id = Number(params.tote_product_id),
      tote_product = _.find(currentTotes.tote_products, {
        id: tote_product_id
      })
    return {
      tote_id: currentTotes.id,
      tote_product_ids: tote_product_id,
      tote_product,
      tote: currentTotes
    }
  }

  get hasContract() {
    const {
      customer: { enable_payment_contract }
    } = this.props
    return enable_payment_contract.length > 0
  }

  get isValidContractPay() {
    return this.state.final_price <= MAX_CONTRACT_PAY_PRICE
  }

  handleProductPosition = products => {
    let firstProduct = null
    const newProducts = _.remove([...products], v => {
      if (v.transition_state === 'available_for_purchase') {
        if (v.id === Number(this.props.params.tote_product_id)) {
          firstProduct = v
          return
        }
        return true
      } else {
        return false
      }
    })
    return [firstProduct, ...newProducts]
  }

  selectPurchaseProduct = tote_product_ids => {
    const { dispatch } = this.props
    dispatch(Actions.promoCode.reset())
    const { tote_id } = this.purchaseToteProduct
    dispatch(Actions.purchaseCheckout.setPurchaseIds(tote_product_ids))
    this.getToteCheckoutPreview({
      code: '',
      tote_id,
      tote_product_ids,
      order_id: '',
      disable_promo_code: false
    })
  }

  getDiscountPrice = (cash_price = 0, promo_code_price = 0) => {
    return cash_price + promo_code_price
  }

  render() {
    if (!this.state.hasFetchPreview) return null
    const {
      app: { hasButtonActivated },
      promoCode: { type },
      currentTotes,
      purchaseCheckout: { isLoading, purchase_ids }
    } = this.props
    const {
      product: { id },
      product_item: { state }
    } = this.purchaseToteProduct.tote_product
    const { orders } = this.purchaseToteProduct.tote
    const {
      payment_state,
      cash_price,
      final_price,
      promo_code_price,
      next_promo_code_hint,
      valid_promo_codes
    } = this.state
    const summary =
      state === 'purchased' && this.checkToteProductOrder(orders, id).summary
    const isSuccess = payment_state === 'success'
    const allPrice = this.getDiscountPrice(cash_price, promo_code_price)
    return (
      <div className="purchase-tote-product">
        <PageHelmet title="折扣购买" />
        <div
          className={`purchase-product-loading ${isLoading ? '' : 'hidden'}`}
        >
          <img
            alt=""
            src={require('src/app/containers/products/products_loading/loading.gif')}
          />
        </div>
        <PurchaseGuide isHadHint={Boolean(next_promo_code_hint)} />
        {_.includes(['fail', 'success'], payment_state) && (
          <SubmitSuccess
            text={`支付${isSuccess ? '成功' : '失败'}`}
            isSuccess={isSuccess}
          />
        )}
        {next_promo_code_hint && (
          <div className="purchase-tips">{next_promo_code_hint}</div>
        )}
        <ProductSwiperItem
          products={this.handleProductPosition(currentTotes.tote_products)}
          purchase_ids={purchase_ids}
          selectPurchaseProduct={this.selectPurchaseProduct}
        />
        {summary ? (
          summary.discount ? (
            <ListLtem title="优惠券" price={summary.discount} />
          ) : null
        ) : (
          <PromoceSelect
            validCodeLength={valid_promo_codes.length}
            promoCodePrice={promo_code_price || 0}
            promoCodeType={type}
            handleSelectPromoCode={this.handleSelectPromoCode}
          />
        )}
        {summary ? (
          summary.purchase_credit ? (
            <ListLtem title="奖励金" price={summary.purchase_credit} />
          ) : null
        ) : cash_price ? (
          <ListLtem title="奖励金" price={cash_price} />
        ) : null}
        <ListLtem
          title="优惠合计"
          className="discount discount-border"
          price={allPrice}
        />

        <span className="instructions">
          <div className="title">购买说明</div>
          <div className="desc mt">
            1、购买成功后请将商品留下，其余商品随衣箱归还
          </div>
          <div className="desc">
            2、本平台所有商品皆为特殊商品，购买后不支持退换
          </div>
        </span>
        {state !== 'purchased' && (
          <div className="payment-buttom">
            <div className="purcahse-need-payment">
              合计:
              <span>&yen;{final_price}</span>
            </div>
            <button
              disabled={hasButtonActivated}
              className={`${hasButtonActivated ? 'disabled' : ''}`}
              onClick={this.handlePurchaseProduct}
            >
              {hasButtonActivated
                ? '处理中'
                : this.hasContract && this.isValidContractPay
                ? '免密支付'
                : '立即支付'}
            </button>
          </div>
        )}
      </div>
    )
  }
}
