import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions.js'
import ProductList from './product_list'
import { format } from 'date-fns'
import classnames from 'classnames'
import { paymentMethodId } from 'src/app/lib/payment_method_id.js'
import * as storage from 'src/app/lib/storage.js'
import { navigateToMiniProgram } from 'src/app/containers/plans/mini_program/index.js'
import PromoceSelect from './promo_code_select'
import './index.scss'

class ProductsItem extends Component {
  constructor(props) {
    super(props)
    this.PAY_STATUS = {
      PAID: 'PAID',
      PROCESSING: 'PROCESSING',
      UNPAID: 'UNPAID'
    }

    this.state = {
      payState: this.PAY_STATUS.UNPAID,
      cash_price: null,
      final_price: null,
      promo_code_price: null,
      hasFetchPreview: false
    }

    this.total_price = 0
    this.total_dynamic_price = 0
    props.line_items.forEach(item => {
      this.total_price += item.product.full_price
      this.total_dynamic_price += item.amount
    })
    this.save_price = this.total_price - this.total_dynamic_price
  }

  componentDidMount() {
    const {
      promoCode: { code, codeState, type },
      tote: { id: tote_id, tote_products },
      id: order_id
    } = this.props
    const tote_product_id = tote_products
      .filter(item => item.product_item.state === 'needs_payment')
      .map(item => item.id)
    const isPreview = type === 'reset' || type === 'DiscountPromoCode'
    const isDisable = _.isEmpty(code) && isPreview && codeState === 'valid'
    this.getToteCheckoutPreview({
      code,
      tote_id,
      tote_product_id,
      order_id,
      disable_promo_code: isDisable
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.promoCode, this.props.promoCode)) {
      const {
        promoCode: { code, codeState, type },
        tote: { id: tote_id, tote_products },
        id: order_id
      } = nextProps
      if (codeState === 'valid' && type === 'DiscountPromoCode') {
        const tote_product_id = tote_products
          .filter(item => item.product_item.state === 'needs_payment')
          .map(item => item.id)
        this.getToteCheckoutPreview({
          code,
          tote_id,
          tote_product_id,
          order_id
        })
      }
    }
  }

  getToteCheckoutPreview = ({
    code,
    tote_id,
    tote_product_id,
    order_id,
    disable_promo_code = false
  }) => {
    this.props.dispatch(
      Actions.purchaseCheckout.totesCheckoutPreview({
        promo_code: code,
        tote_id: tote_id,
        tote_product_ids: tote_product_id,
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
          preview: { cash_price, final_price, promo_code_price },
          valid_promo_codes
        }
      }
    } = resData
    const { promoCode, purchaseCheckout } = this.props
    if (
      !_.isEmpty(purchaseCheckout.tote_transaction_promo_codes) &&
      promoCode.codeState !== 'valid'
    ) {
      dispatch(Actions.promoCode.set(valid_promo_codes[0]))
    }
    this.setState({
      cash_price,
      final_price,
      promo_code_price,
      validCodeLength: valid_promo_codes.length,
      hasFetchPreview: true
    })
  }
  handleRetryPayment = () => {
    const {
      id,
      payment_methods,
      platform,
      promoCode: { code, codeState }
    } = this.props

    storage.set('order_id', id)

    if (
      this.state.payState === this.PAY_STATUS.PAID ||
      this.state.payState === this.PAY_STATUS.PROCESSING
    )
      return null
    this.setState({
      payState: this.PAY_STATUS.PROCESSING
    })
    const params = {
      order_id: id,
      payment_method_id: paymentMethodId(platform, payment_methods),
      promo_code: codeState === 'valid' ? code : ''
    }
    this.props.dispatch(
      Actions.retryPayment.fetchRetryPayment({
        params,
        success: this.retryPaymentSuccess,
        error: this.retryPaymentError
      })
    )
  }

  retryPaymentError = () =>
    this.setState({
      payState: this.PAY_STATUS.UNPAID
    })

  retryPaymentSuccess = (dispatch, data) => {
    const {
      data: {
        RetryPayment: {
          payment,
          order: { successful }
        }
      }
    } = data
    const auth_details = payment && JSON.parse(payment.authorization_details)

    if (successful) {
      this.setState({
        payState: this.PAY_STATUS.PAID
      })
      this.paymentSuccess()
      return null
    }
    // NOTE: jd platform, link to jd payment
    if (this.props.platform === 'jd') {
      window.location.href = auth_details.url
      return null
    }

    //mini program
    if (this.props.platform === 'mini_app') {
      this.setState({
        payState: this.PAY_STATUS.UNPAID
      })
      const { authorization_details } = payment
      const params = {
        payParams: authorization_details,
        redirect_url: '/payment_success'
      }
      navigateToMiniProgram(params)
      return null
    }

    wx.chooseWXPay({
      timestamp: auth_details.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: auth_details.nonceStr, // 支付签名随机串，不长于 32 位
      package: auth_details.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      signType: auth_details.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: auth_details.paySign, // 支付签名
      success: () => {
        this.setState({
          payState: this.PAY_STATUS.PAID
        })
        this.paymentSuccess()
      },
      cancel: () =>
        this.setState({
          payState: this.PAY_STATUS.UNPAID
        }),
      fail: () =>
        this.props.wxInit(true, () => this.retryPaymentSuccess(dispatch, data))
    })
  }

  paymentSuccess = () =>
    browserHistory.push({
      pathname: '/payment_success',
      query: {
        pay_way: 'wechat'
      }
    })

  handleSelectPromoCode = () =>
    browserHistory.push({
      pathname: '/promo_code_list',
      query: {
        isPaymentPending: true
      }
    })

  render() {
    if (!this.state.hasFetchPreview) return null
    const {
        overdue_surcharge_tips,
        date,
        promoCode: { type }
      } = this.props,
      {
        payState,
        cash_price,
        final_price,
        promo_code_price,
        validCodeLength
      } = this.state,
      classname = classnames({
        'set-gray': payState === this.PAY_STATUS.PROCESSING
      })
    return (
      <div className="products-item mid">
        <div className="payment-time">{format(date, 'YYYY-MM-DD')}</div>
        <ProductList {...this.props} />
        <div className="discount">
          商品小计{' '}
          <span className="price">&yen; {this.total_dynamic_price}</span>
        </div>
        <PromoceSelect
          promoCodePrice={promo_code_price}
          handleSelectPromoCode={this.handleSelectPromoCode}
          promoCodeType={type}
          validCodeLength={validCodeLength}
        />
        {cash_price > 0 && (
          <div className="discount">
            奖励金
            <span className="price">-&yen;{cash_price}</span>
          </div>
        )}
        {overdue_surcharge_tips && (
          <div className="overdue_surcharge_tips">
            <img
              className="overdue_surcharge_tips_img"
              src={require('./images/alert_circle.svg')}
              alt=""
            />
            <span className="overdue_surcharge_tips_text">
              {overdue_surcharge_tips}
            </span>
          </div>
        )}
        <div className="payment-button">
          <span className="total-price">&yen;{final_price}</span>
          <span className="save-price">
            为你节省&yen;{this.save_price + promo_code_price + cash_price}
          </span>
          <button onClick={this.handleRetryPayment} className={classname}>
            {payState === this.PAY_STATUS.PROCESSING
              ? '支付中...'
              : payState === this.PAY_STATUS.PAID
              ? '支付成功'
              : '立即支付'}
          </button>
        </div>
      </div>
    )
  }
}

export default ProductsItem
