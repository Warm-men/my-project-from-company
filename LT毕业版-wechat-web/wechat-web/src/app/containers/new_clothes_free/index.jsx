import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { isWithinRange } from 'date-fns'
import authentication from 'src/app/lib/authentication'
import Loading from 'src/app/components/LoadingPage'
import './index.scss'
import ICON_SORRY from './images/icon_sorry.png'
import PageHelmet from 'src/app/lib/pagehelmet'
import * as storage from 'src/app/lib/storage.js'
import Actions from 'src/app/actions/actions'

const getState = state => {
  const { customer } = state
  return {
    customer: customer,
    authentication: authentication(customer)
  }
}

@connect(getState)
class NewClothesFree extends Component {
  constructor(props) {
    super(props)
    const {
      pathname,
      query: { start_time, end_time, pre_page, promo_code }
    } = props.location
    this.isSeventyNine =
      pre_page === 'letote_free_tote_79' || promo_code === 'LETOTE_FREE_TOTE_79'
    const isOther = pathname.match('new_clothes_free_special'),
      isValid = isWithinRange(
        new Date(),
        new Date(start_time),
        new Date(end_time)
      )
    if (this.isSeventyNine) {
      if (isOther) {
        this.isEnd = false
      } else if (isValid) {
        this.isEnd = false
      } else {
        // NOTE：原先的全部活动截止
        this.isEnd = true
      }
    }
  }

  componentDidMount() {
    this.props.dispatch(Actions.currentCustomer.fetchMe())
  }

  componentWillReceiveProps(nextProps) {
    const {
      authentication,
      customer: { credit_scores }
    } = nextProps
    const { pre_page, referral_code, referrral_code } = nextProps.location.query
    if (!pre_page || this.isEnd) {
      return null
    }
    const referralCode = referral_code || referrral_code
    referralCode && storage.set('REFERRAL_CODE', referralCode)
    if (nextProps.customer !== this.props.customer && nextProps.customer.id) {
      if (!authentication.isSubscriber) {
        if (credit_scores && credit_scores[0] && credit_scores[0].score) {
          if (this.isSeventyNine) {
            storage.set('LETOTE_FREE_TOTE_79', true)
            browserHistory.replace({
              pathname: '/promo_plans',
              query: {
                ...nextProps.location.query,
                promo_code: 'LTCN_FREE_TOTE_79',
                referral_code: referralCode
              }
            })
            return null
          }
          const url =
            pre_page === 'referral' ? `/referral_plans` : '/application_result'
          browserHistory.push(url)
        } else {
          this.isSeventyNine && storage.set('LETOTE_FREE_TOTE_79', true)
          pre_page !== 'referral' && storage.set('APPLY_CLOTHES_FREE', true)
          if (pre_page === 'referral') {
            const { telephone } = this.props.customer
            browserHistory.replace({
              pathname: _.isEmpty(telephone)
                ? '/sesamecredit'
                : '/referral_plans',
              query: {
                ...nextProps.location.query,
                isReferral: true,
                next_page: 'referral',
                referral_code: referralCode
              }
            })
          } else {
            browserHistory.push('/plans')
          }
        }
      }
    }
  }

  render() {
    const {
      authentication,
      customer: { id },
      location: {
        query: { pre_page, promo_code }
      }
    } = this.props
    if ((!pre_page && !promo_code) || this.isEnd) {
      return <ActivityEnd pre_page={pre_page} />
    }
    if (!id) {
      return <Loading text={'正在检查活动参与资格'} />
    } else if (authentication.isSubscriber) {
      //NOTE: 已经是会员不能申请
      return <Membership pre_page={pre_page} />
    } else {
      return null
    }
  }
}

export const ActivityEnd = () => {
  return (
    <div className="memvbership">
      <PageHelmet title={'活动已结束'} link={window.location.pathname} />
      <img src={ICON_SORRY} alt="...." />
      <p className="sorry-text-large">
        本活动已结束，请继续关注LeTote托特衣箱的其他活动
      </p>
    </div>
  )
}

export const Membership = () => (
  <div className="memvbership">
    <PageHelmet title={'Le Tote 托特衣箱'} link={`/new_clothes_free`} />
    <img src={ICON_SORRY} alt="...." />
    <p className="sorry-text-large">本活动限新用户参加</p>
  </div>
)

export default NewClothesFree
