import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions.js'
import LoadingPage from 'src/app/components/LoadingPage'
import * as storage from 'src/app/lib/storage.js'
import './index.scss'

const MAX_LOOP_NUMBER = 5

const getState = state => ({
  ...state.orders,
  isMiniApp: state.app.platform === 'mini_app',
  hasOrders: !_.isEmpty(state.orders.orders)
})

const mapDispatchToProps = dispatch => ({
  fetchOrders: () => dispatch(Actions.orders.fetchOrders()),
  dispatch
})

@connect(
  getState,
  mapDispatchToProps
)
export default class PendingPaymentSuccess extends React.Component {
  constructor(props) {
    super(props)
    this.timer = null
    this.initTime = 500
    this.time = 0
    this.state = {
      success: false
    }
  }

  componentWillMount() {
    const { isMiniApp, location } = this.props
    if (location.query.pay_way === 'wechat' || isMiniApp) {
      this.getOrders()
      this.setState({
        success: true
      })
      return null
    }
    //NOTE: jd need rotation
    this.continuedQuery()
  }

  componentWillUnmount() {
    this.props.dispatch(Actions.orders.initialOrdersData())
  }

  getOrders = () => {
    this.time++
    this.props.fetchOrders()
  }

  continuedQuery = () => {
    this.timer && clearTimeout(this.timer)

    if (
      this.props.loadedOrders &&
      _.isEmpty(_.find(this.props.orders, { id: storage.get('order_id') }))
    ) {
      this.setState({
        success: true
      })
      return null
    }

    if (this.time > MAX_LOOP_NUMBER) {
      browserHistory.replace('/payment_pending')
      return null
    }

    this.timer = setTimeout(() => {
      this.getOrders()
      if (this.initTime < 2000) {
        this.initTime = 2000
      }
      this.continuedQuery()
    }, this.initTime)
  }

  linkTo = () => {
    const url = this.props.hasOrders ? '/payment_pending' : '/totes'
    browserHistory.replace(url)
  }

  render() {
    return this.state.success ? (
      <div className="payment-pending-suc">
        <div className="payment-bg" />
        <span className="pay-suc">支付成功</span>
        <div className="go-back" onClick={this.linkTo}>
          返回
        </div>
      </div>
    ) : (
      <LoadingPage text={'正在处理中'} />
    )
  }
}
