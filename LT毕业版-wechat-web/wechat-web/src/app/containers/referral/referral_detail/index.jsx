import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PageHelmet from 'src/app/lib/pagehelmet'
import ReferralItem from './item'
import './index.scss'

const getState = state => ({
  customer: state.customer
})

@connect(getState)
class ReferralDetail extends PureComponent {
  render() {
    const {
      time_cash_transactions,
      available_purchase_credit,
      spent_purchase_credit
    } = this.props.customer
    return (
      <div className="referral">
        <PageHelmet title="奖励金" link={`/referrl_detail`} />
        <div className="referral-head">
          <span className="title">余额(元)</span>
          <span className="text">{available_purchase_credit.amount}</span>
        </div>
        <div className="price-box">
          <div className="box">
            <span className="title">
              {available_purchase_credit.amount + spent_purchase_credit.amount}
            </span>
            <span className="text">累计获得(元)</span>
          </div>
          <div className="box">
            <span className="title">{spent_purchase_credit.amount}</span>
            <span className="text">已使用(元)</span>
          </div>
        </div>
        <div className="invitation-progress">
          <div className="top-title">奖励金明细</div>
          <div className="top-description">
            奖励金可用于续费或购买服饰，可累计使用
          </div>
          {_.map(time_cash_transactions, (v, k) => (
            <ReferralItem item={v} key={k} />
          ))}
        </div>
      </div>
    )
  }
}

export default ReferralDetail
