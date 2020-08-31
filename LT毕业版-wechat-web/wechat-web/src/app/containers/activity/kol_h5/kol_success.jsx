import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions'
import LoadingPage from 'src/app/components/LoadingPage'
import { browserHistory } from 'react-router'
import authentication from 'src/app/lib/authentication'
import { format, differenceInDays } from 'date-fns'
import TipsModal from 'src/app/containers/schedule_return/tips_modal'
import * as storage from 'src/app/lib/storage.js'
import PurchaseSuccess from 'src/app/containers/purchase_success'
import './index.scss'
import {
  APPStatisticManager,
  BaiduStatisService
} from '../../../lib/statistics/app'

const MAX_LOOP_NUMBER = 5

const getStae = state => {
  const { customer } = state
  return {
    customer: customer
  }
}

@connect(getStae)
export default class ActivitySuccess extends PureComponent {
  constructor(props) {
    super(props)
    this.timer = null
    this.initTime = 500
    this.state = {
      isSuccess: false,
      isShowTips: false
    }
    this.isWechat = /MicroMessenger/i.test(navigator.userAgent)
    this.initCustomer = this.props.customer
    this.time = 0
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
    if (
      this.isNewSubscription(this.initCustomer, me) ||
      this.isRenew(this.initCustomer, me)
    ) {
      this.timer && clearTimeout(this.timer)
      const { promo_code } = this.props.location.query
      const isSeventyNine = promo_code === 'LETOTE_FREE_TOTE_79'
      isSeventyNine && storage.remove('LETOTE_FREE_TOTE_79')
      this.setState({
        isSuccess: true
      })
    }
    if (this.time > MAX_LOOP_NUMBER) {
      this.setState({
        isShowTips: true
      })
      this.timer && clearTimeout(this.timer)
    }
  }

  handleSubQueryError = () => {
    if (this.time > MAX_LOOP_NUMBER) {
      browserHistory.replace(this.handleUtmUrl())
      return null
    }
  }

  handleLeftClick = () => {
    browserHistory.replace(this.handleUtmUrl())
  }

  handleUtmUrl = () => {
    const {
      utm_source,
      utm_medium,
      utm_campaign,
      promo_code
    } = this.props.location.query
    const isSeventyNine = promo_code === 'LETOTE_FREE_TOTE_79'
    isSeventyNine && storage.set('LETOTE_FREE_TOTE_79', true)
    let utmUrl = isSeventyNine
      ? `/promo_plans?next_page=kol_activity`
      : `/plans?next_page=kol_activity`
    if (utm_source) {
      utmUrl += `&utm_source=${utm_source}`
    }
    if (utm_medium) {
      utmUrl += `&utm_medium=${utm_medium}`
    }
    if (utm_campaign) {
      utmUrl += `&utm_campaign=${utm_campaign}`
    }
    return utmUrl
  }

  handleRightClick = () => {
    this.setState(
      {
        isShowTips: false
      },
      () => {
        this.time = 0
        this.continuedQuery()
      }
    )
  }

  render() {
    if (!this.state.isSuccess) {
      return (
        <div>
          <LoadingPage text={'正在处理中'} />
          {this.state.isShowTips && (
            <TipsModal
              title={`是否已完成支付？`}
              leftBtn="返回重新支付"
              rightBtn="已完成支付"
              leftBtnClick={this.handleLeftClick}
              rightBtnClick={this.handleRightClick}
            />
          )}
        </div>
      )
    }
    return <PurchaseSuccess helmetTitle="购买成功" helmetLink="/kol_success" />
  }
}
