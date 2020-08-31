import { useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions.js'
import ProductsItem from './products_item'
import wxInit from 'src/app/lib/wx_config.js'
import LoadingPage from 'src/app/components/LoadingPage'
import PageHelmet from 'src/app/lib/pagehelmet'
import './index.scss'

const getState = state => ({
  ...state.orders,
  payment_methods: state.customer.payment_methods,
  platform: state.app.platform,
  purchaseCheckout: state.purchaseCheckout,
  promoCode: state.promoCode
})

export default connect(getState)(PaymentPendingWrapper)
function PaymentPendingWrapper(props) {
  const { dispatch, loadedOrders } = props
  useEffect(() => {
    dispatch(Actions.orders.fetchOrders())
    dispatch(Actions.currentCustomer.fetchMe())
    wxInit()
    return () => dispatch(Actions.orders.initialOrdersData())
  }, [])

  return (
    <>
      <PageHelmet title="待付款" link="/payment_pending" />
      {loadedOrders ? (
        <PaymentPending {...props} />
      ) : (
        <LoadingPage text="加载中..." />
      )}
    </>
  )
}

const PaymentPending = React.memo(props => {
  const { orders } = props
  if (
    _.isEmpty(orders) ||
    //NOTE: when payment pending orders only one and line_items === []，As not orders shown
    (!_.isEmpty(orders) && _.isEmpty(orders[0].line_items))
  ) {
    return <BlankPage />
  }
  return (
    <div className="payment-pending">
      <header />
      <div className="warning">如果忘记归还了，请联系我们客服进行处理</div>
      {_.map(orders, item => {
        if (!_.isEmpty(item.line_items)) {
          return (
            <ProductsItem
              {...props}
              {...item}
              date={item.created_at}
              key={item.id}
              wxInit={wxInit}
            />
          )
        }
      })}
      <div className="instruction">
        <p className="payment-instr">付款说明</p>
        <div className="instr-desc">
          1、待付款商品为特殊商品，购买后不支持退换
        </div>
        <div className="instr-desc">
          2、请在规定时间内完成支付，否则将会产生商品滞还金
        </div>
        <div className="instr-desc">
          3、如果由于忘记归还或遗漏商品而产生订单，请尽快归还或联系在线客服进行处理
        </div>
      </div>
    </div>
  )
})

const BlankPage = React.memo(() => (
  <div className="blank-page">
    <span className="blank-icon mid" />
    <h3 className="title">暂无待付款信息</h3>
    <p>
      衣箱签收后你可直接购买心仪的服饰
      <br />
      或在归还衣箱时，留下喜欢的服饰，我
      <br />
      们收到后会给你生成待付款订单，你只
      <br />
      需按照提示完成支付即可
    </p>
  </div>
))
