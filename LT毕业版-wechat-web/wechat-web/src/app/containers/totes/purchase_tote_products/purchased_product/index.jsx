import React, { useEffect } from 'react'
import ProductSelectItem from '../product_select'
import { format } from 'date-fns'
import { judgePayment } from 'src/app/lib/judgePayment.js'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions.js'
import PageHelmet from 'src/app/lib/pagehelmet'
import '../index.scss'
import './index.scss'

const getState = (state, props) => {
  const { totes } = state
  const { query } = props.location
  const handleTotes = query.isHistory ? totes.past_totes : totes.current_totes
  return {
    totes,
    currentTotes: _.find(
      handleTotes,
      v => v.id === Number(props.location.query.toteId)
    )
  }
}

const paymentIcon = {
  微信支付: require('./images/wechat.svg'),
  支付宝支付: require('./images/alipay.svg'),
  京东支付: require('./images/jd.svg')
}

export default connect(getState)(PurchasedProductDetail)
function PurchasedProductDetail(props) {
  const { currentTotes, dispatch } = props
  const { query } = props.location
  useEffect(() => {
    if (_.isEmpty(currentTotes)) {
      if (query.isHistory) {
        dispatch(Actions.totes.fetchPastTotes(1))
      } else {
        dispatch(Actions.totes.fetchLatestRentalAndPurchaseTote())
      }
    }
  }, [])

  if (_.isEmpty(currentTotes)) return null

  const getDiscountPrice = (cash_price = 0, promo_code_price = 0) => {
    return cash_price + promo_code_price
  }

  const tote_product = _.find(
    currentTotes.tote_products,
    v => v.id === Number(query.tote_product_id)
  )
  const { order } = tote_product
  const { summary } = order
  const payment = order.payment ? judgePayment(order.payment.gateway) : ''
  const icon = paymentIcon[payment]
  return (
    <div className="purchase-tote-product detail">
      <PageHelmet title="支付详情" />
      <HandleSelectRender order={order} />
      <div className="discount">
        优惠券
        <span className="price">-&yen;{summary.discount}</span>
      </div>
      {summary.purchase_credit > 0 && (
        <div className="discount">
          奖励金
          <span className="price">-&yen;{summary.purchase_credit}</span>
        </div>
      )}
      <div className="discount discount-border">
        优惠合计
        <span className="price">
          -&yen;
          {getDiscountPrice(summary.purchase_credit, summary.discount)}
        </span>
      </div>
      <div className="discount">
        实付
        <span className="price red">
          &yen;
          {summary.total_amount}
        </span>
      </div>
      {!_.isEmpty(payment) && (
        <div className="discount">
          支付方式
          <span className="price">
            {icon && <img alt="" src={icon} className="payment-icon" />}
            <span>{payment}</span>
          </span>
        </div>
      )}
      <div className="discount discount-border">
        支付时间
        <span className="price">
          {format(order.paid_at, 'YYYY.MM.DD HH:mm')}
        </span>
      </div>
      <span className="instructions">
        <div className="title">购买说明</div>
        <div className="desc mt">
          1、购买成功后请将商品留下，其余商品随衣箱归还
        </div>
        <div className="desc">
          2、本平台所有商品皆为特殊商品，购买后不支持退换
        </div>
      </span>
    </div>
  )
}

function HandleSelectRender(props) {
  let price = 0
  return _.map(props.order.line_items, (v, k) => {
    price += v.amount
    const tote_product = {
      ...v,
      product_size: { size: v.size },
      tote_specific_price: v.amount
    }
    if (k + 1 < props.order.line_items.length) {
      return <ProductSelectItem key={k} tote_product={tote_product} />
    } else {
      return (
        <React.Fragment key={k}>
          <ProductSelectItem tote_product={tote_product} />
          <div className="discount discount-border">
            商品小计
            <span className="price">¥{price}</span>
          </div>
        </React.Fragment>
      )
    }
  })
}
