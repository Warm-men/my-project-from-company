import React, { Component } from 'react'
import './index.scss'
export default class Header extends Component {
  render() {
    const { platform } = this.props
    return (
      <div className="header-container">
        <div className="credit-banner">
          <div className="text-balance-container">
            <span className="text-balance">余额(元)</span>
            <span className="price">{this.props.balance}</span>
          </div>
          <div className="contract-refund-container">
            {this.props.isContracted ? (
              <div className="contract-container">
                <img
                  alt=""
                  src={require('../../../../assets/images/credit_account/contracted.svg')}
                />
                <span className="text-contract">已开通免密支付</span>
              </div>
            ) : null}
            {this.props.balance < 0 ? (
              <div
                onClick={this.props.refundClick}
                className="refund-container"
              >
                <span className="refund-text">立即还款</span>
              </div>
            ) : null}
          </div>
        </div>
        {platform !== 'jd' && (
          <div className="referral-banner-container">
            <span className="referral-text">
              你通过邀请好友累积获得
              <span className="total-bonus">{this.props.referralAmount}元</span>
              奖励金，继续邀请获得更多
            </span>
            <div className="referral-button-container">
              <span
                className="referral-button"
                onClick={this.props.referralClick}
              >
                邀请好友
              </span>
            </div>
          </div>
        )}
        <div className="account-details-container">
          <span className="account-details">账户明细</span>
        </div>
      </div>
    )
  }
}
