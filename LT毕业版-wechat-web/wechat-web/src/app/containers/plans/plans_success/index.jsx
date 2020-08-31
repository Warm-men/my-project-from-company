import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Actions from 'src/app/actions/actions'
import PageHelmet from 'src/app/lib/pagehelmet'
import Loader from 'src/assets/images/plans/Loader_SM.gif'
import PurchaseSuccess from 'src/app/containers/purchase_success'
import Authentication from 'src/app/lib/authentication'
import '../index.scss'
import { DEFAULT_APP_LINK } from '../../../constants/global_config'
import {
  APPStatisticManager,
  BaiduStatisService
} from '../../../lib/statistics/app'

class PlansSuccess extends Component {
  constructor(props) {
    super(props)
    this.timer = null
    this.initTime = 500
    this.state = {
      isSuccess: false
    }
  }

  componentDidMount() {
    this.props.dispatch(Actions.currentCustomer.linkedService())
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
    const subscriptionQuery = Actions.subscription.query(
      this.handleSubQuerySuccess,
      this.handleSubQueryError
    )
    this.props.dispatch(subscriptionQuery)
  }

  handleSubQuerySuccess = (dispatch, data) => {
    const { me } = data.data
    const { payType } = this.props.location.query
    if (!me) {
      this._hmt_querySubscriptionError(
        'subscription_query_success_have_not_me',
        {
          time: JSON.stringify(new Date())
        }
      )
    }
    if (
      me.subscription &&
      (payType === 'renewMember' || payType === 'openMember')
    ) {
      this.setState({
        isSuccess: true
      })
      this.timer && clearTimeout(this.timer)
    } else {
      this._hmt_querySubscriptionError(
        'subscription_query_success_not_renew_new_sub',
        {
          time: JSON.stringify(new Date()),
          me: JSON.stringify(me)
        }
      )
    }
  }

  handleSubQueryError = (dispatch, data) =>
    this._hmt_querySubscriptionError('subscription_query_error', {
      time: JSON.stringify(new Date()),
      error: JSON.stringify(data)
    })

  renderHandleResult = () => {
    return (
      <div className="plans-handle">
        <img src={Loader} alt="" />
        <p>正在处理中</p>
      </div>
    )
  }

  handleDownload = () => {
    window.location.href = DEFAULT_APP_LINK
  }

  renderNotFollowUser = () => {
    const { query } = this.props.location
    const isRenewMember = query && query.payType === 'renewMember'
    return (
      <PurchaseSuccess
        helmetTitle={isRenewMember ? '续费成功' : '购买成功'}
        helmetLink="/plans_success"
        desc={isRenewMember ? '续费成功' : '购买成功'}
      />
    )
  }

  handleRender = () => {
    const {
      location: {
        query: { tel_state, payType, isReferral }
      },
      customer: { linked_service, finished_onboarding_questions, subscription }
    } = this.props
    const newestVersion2 =
      !Authentication(this.props.customer).isSubscriber &&
      finished_onboarding_questions === 'ALL'
    if (this.state.isSuccess) {
      // NOTE: 绑定手机号跳过直接去定制
      if (payType === 'openMember' && tel_state) return <PaymentRenewResult />

      //NOTE: referral result page
      if (isReferral)
        return (
          <PurchaseSuccess
            helmetTitle="购买会员结果"
            helmetLink="/plans_success"
            desc="购买成功"
          />
        )

      if (linked_service && linked_service.subscribe === 0)
        return this.renderNotFollowUser()

      return payType === 'renewMember' ? (
        <PaymentRenewResult />
      ) : (
        <PaymentResult
          subscription={subscription}
          newestVersion2={!!newestVersion2}
        />
      )
    } else {
      return tel_state ? (
        <PaymentResult
          subscription={subscription}
          newestVersion2={!!newestVersion2}
        />
      ) : (
        this.renderHandleResult()
      )
    }
  }

  render() {
    return (
      <div>
        <PageHelmet title="购买会员结果" link="/plans_success" />
        {this.handleRender()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    customer: state.customer
  }
}

export const PaymentResult = ({ newestVersion2, subscription }) => (
  <div className="plans-success">
    <div className="plans-image" />
    <p className="plans-title">成功加入托特衣箱</p>
    <p className="plans-text clear-margin">会员期从首个衣箱寄出</p>
    <p className="plans-text">
      或{subscription.remain_additional_days}天后开始计算
    </p>
    <Link
      className="plans-success-btn"
      to={newestVersion2 ? '/confirm_personal_info' : '/totes'}
    >
      开启时尚之旅
    </Link>
  </div>
)

export const PaymentRenewResult = () => (
  <div className="plans-success">
    <div className="plans-image" />
    <p className="plans-text">续费成功</p>
    <Link className="plans-renew-btn" to="/totes">
      返回
    </Link>
  </div>
)

export default connect(mapStateToProps)(PlansSuccess)
