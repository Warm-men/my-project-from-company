import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions'
import classnames from 'classnames'
import './index.scss'
import CODE from '../../images/code.jpg'
import SUCCESS from '../../images/success.png'
import {
  APPStatisticManager,
  BaiduStatisService
} from '../../../../lib/statistics/app'

const getState = state => {
  const { subscriptionTypes } = state
  // FIXME:目前使用is_signupable判断，后期有多个可购买套餐需要调整规则
  const subscriptionData = _.filter(
    subscriptionTypes,
    subscription => subscription.is_signupable === true
  )
  return {
    data: subscriptionData[0]
  }
}

@connect(getState)
class OpenService extends Component {
  constructor() {
    super()
    this.state = {
      isOk: false
    }
  }

  componentWillMount() {
    const fetch = Actions.subscriptionTypes.fetchSubscriptionTypes('signupable')
    this.props.dispatch(fetch)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      nextProps.data.id && this.handleExtendSubscription(nextProps.data.id)
    }
  }

  handleExtendSubscription = id => {
    const action = Actions.subscription.extendSubscription(
      {
        subscription_type_id: id,
        promo_code: 'ltcn_free_tote'
      },
      this.extendSubscriptionSuccess,
      this.extendSubscriptionError
    )
    this.props.dispatch(action)
  }

  extendSubscriptionSuccess = () => {
    this.props.dispatch(Actions.currentCustomer.fetchMe(this.handleFetchMeSuc))
  }

  handleFetchMeSuc = () => this.setState({ isOk: true })

  extendSubscriptionError = (_, data) => {
    APPStatisticManager.service(BaiduStatisService.id).track(
      'new_clothes_for_free',
      data
    )
  }

  handleGoTote = () => browserHistory.push('/totes')

  render() {
    const { isOk } = this.state,
      classname = classnames({
        'open-pending': !isOk
      })
    return (
      <div className="open-service">
        <div className="header">
          <img src={SUCCESS} alt="..." className="success" />
          <p className="apply-suc">申请成功</p>
        </div>
        <img src={CODE} alt="..." className="code" />
        <div>
          请扫码添加 LT 时尚顾问为好友
          <br />
          享受更贴心服务
        </div>
        <button className={classname} onClick={this.handleGoTote}>
          {isOk ? '开启服务' : '处理中'}
        </button>
      </div>
    )
  }
}

export default OpenService
