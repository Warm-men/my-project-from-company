import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions'
import authentication from 'src/app/lib/authentication'
import { format, differenceInDays } from 'date-fns'
import './payment_suc.scss'
import LoadingPage from 'src/app/components/LoadingPage'
import PurchaseSuccess from 'src/app/containers/purchase_success'
import {
  PaymentResult,
  PaymentRenewResult
} from 'src/app/containers/plans/plans_success'
import * as storage from 'src/app/lib/storage.js'
import {
  APPStatisticManager,
  BaiduStatisService
} from '../../../lib/statistics/app'

const MAX_LOOP_NUMBER = 5

const getStae = state => {
  const { customer, app } = state
  return {
    customer: customer,
    app
  }
}

@connect(getStae)
class PaymentSuccess extends Component {
  constructor(props) {
    super(props)
    this.timer = null
    this.initTime = 500
    this.state = {
      isSuccess: false
    }
    this.initCustomer = this.props.customer
    this.time = 0
    this.promoCode = storage.get('promo_code', localStorage)
  }

  componentDidMount() {
    this.continuedQuery()
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  continuedQuery = () => {
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.querySubscription()
      if (this.initTime < 2000) {
        this.initTime = 2000
      }
      this.continuedQuery()
    }, this.initTime)
  }

  _hmt_querySubscriptionError = (category, opt_label) =>
    APPStatisticManager.service(BaiduStatisService.id).track(
      category,
      opt_label
    )

  querySubscription = () => {
    this.time++
    const subscriptionQuery = Actions.subscription.query(
      this.handleSubQuerySuccess,
      this.handleSubQueryError
    )
    this.props.dispatch(subscriptionQuery)
  }

  isNewSubscription = (initData, fetchData) => {
    return (
      !authentication(initData).isSubscriber &&
      authentication(fetchData).isSubscriber
    )
  }

  isRenew = (initData, fetchData) => {
    const initSubcriberTime = format(
      initData.subscription && initData.subscription.billing_date,
      'YYYY-MM-DD'
    )
    const newSubcriberTime = format(
      fetchData.subscription && fetchData.subscription.billing_date,
      'YYYY-MM-DD'
    )
    return (
      authentication(fetchData).isSubscriber &&
      differenceInDays(initSubcriberTime, newSubcriberTime) < 0
    )
  }

  handleSubQuerySuccess = (dispatch, data) => {
    const me = data.data.me
    const { platform } = this.props.app
    if (
      this.isNewSubscription(this.initCustomer, me) ||
      this.isRenew(this.initCustomer, me) ||
      (platform === 'jd' && !_.isEmpty(me))
    ) {
      this.setState({
        isSuccess: true
      })
      // NOTE：度假套餐返回需要进行清除
      storage.get('vacation_plans') && storage.remove('vacation_plans')
      storage.get('pay_way') && storage.remove('pay_way')
      // NOTE：promo_plans返回需要进行清除
      storage.get('promo_code', localStorage) &&
        storage.remove('promo_code', localStorage)
      this.timer && clearTimeout(this.timer)
    } else {
      this._hmt_querySubscriptionError(
        'subscription_query_success_not_renew_new_sub',
        {
          time: JSON.stringify(new Date()),
          me: JSON.stringify(me),
          initCustomer: JSON.stringify(this.initCustomer)
        }
      )
    }

    if (this.time > MAX_LOOP_NUMBER) {
      this.paymentLink()
    }
  }

  paymentLink = () => {
    let url = '/plans?next_page=h5_page'
    // NOTE：有promo_code就属于promo_plans
    if (this.promoCode) {
      url = {
        pathname: '/promo_plans',
        query: {
          next_page: 'h5_page',
          promo_code: this.promoCode
        }
      }
    } else if (storage.get('pay_way') === 'mplans') {
      url = `/${storage.get('pay_way')}`
    }
    browserHistory.replace(url)
  }

  handleSubQueryError = (dispatch, data) => {
    this._hmt_querySubscriptionError('subscription_query_error', {
      time: JSON.stringify(new Date()),
      error: JSON.stringify(data)
    })
    if (this.time > MAX_LOOP_NUMBER) {
      this.paymentLink()
    }
  }

  render() {
    const {
      app: { platform },
      location: { query },
      customer: { subscription }
    } = this.props
    if (this.state.isSuccess) {
      if (platform === 'jd') {
        return storage.get('userType') === 'openMember' ? (
          <PaymentResult subscription={subscription} />
        ) : (
          <PaymentRenewResult />
        )
      }
      const title = query.userType === 'openMember' ? '购买成功' : '续费成功'
      return (
        <PurchaseSuccess
          userType={query.userType}
          helmetTitle={title}
          desc={title}
          helmetLink="/h5_plans_success"
          QRCode={query.QRCode}
        />
      )
    }

    return <LoadingPage text={'正在处理中'} />
  }
}

export default PaymentSuccess
