import React, { Component } from 'react'
import * as CARD_TYPE from 'src/app/lib/card_type.js'
import { browserHistory } from 'react-router'
import './index.scss'

function FreePasswordTips({
  customer,
  isOtherText,
  subscription,
  handleOpenFreepassword,
  isWechat
}) {
  if (!_.isEmpty(customer.enable_payment_contract)) {
    const discount = subscription.preview.auto_renew_discount
    return discount ? (
      <div className="freepassword-tips-box">
        <div className="tips-dec">
          <span className="tips-open">已开通自动续费，已减¥{discount}</span>
        </div>
      </div>
    ) : null
  } else {
    if (subscription.auto_renew_discount_amount > 0 && isWechat) {
      return (
        <div className="freepassword-tips-box">
          <div className="tips-dec">
            <span className="tips-title">
              开通自动续费，
              <span className="price">
                每月直减¥{subscription.auto_renew_discount_amount}
              </span>
            </span>
            <span className="tips-text">自动续费可随时关闭</span>
          </div>
          <div className="tips-btn" onClick={handleOpenFreepassword}>
            {isOtherText ? '开通领优惠' : '立即开通'}
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

export default class SubscriberList extends Component {
  constructor() {
    super()
    this.subList = [
      'monthly_subscription_type',
      'quarterly_subscription_type',
      'annual_subscription_type'
    ]
    this.state = {
      isOhterPages: null,
      isOtherText: null
    }
  }

  componentDidMount() {
    if (this.props.isWechat) {
      window.adhoc('getFlags', flag => {
        this.setState({
          isOhterPages: flag.get('other_plans_page'),
          isOtherText: flag.get('D190515_PLANS_FREEPASSWORD') === 2
        })
      })
    } else {
      window.adhoc('getFlags', flag => {
        this.setState({
          isOtherText: flag.get('D190515_PLANS_FREEPASSWORD') === 2
        })
      })
    }
  }

  handleSelect = sub => () => {
    const { handleSelectSub } = this.props
    if (_.isFunction(handleSelectSub())) {
      handleSelectSub(sub)()
      return null
    }
    handleSelectSub && handleSelectSub(sub)
  }

  getSubscriptionList = () => {
    const {
      subscription,
      authentication: { isExpiredSubscriber, isVacation },
      isHideAnnualCard
    } = this.props
    if (_.isEmpty(subscription)) return []
    const { subscription_type } = subscription
    if (_.isEmpty(subscription_type)) return []
    let list = []
    _.map(subscription_type, (v, k) => {
      const index = _.indexOf(this.subList, k)
      if (index >= 0) {
        list[index] = subscription_type[k]
      }
    })
    if (isExpiredSubscriber || isVacation) {
      return list
    } else {
      // NOTE:referral购买不显示年卡
      if (isHideAnnualCard) {
        return _.filter(
          list,
          v => v && v.interval < 12 && subscription_type.interval <= v.interval
        )
      }
      return _.filter(list, v => v && subscription_type.interval <= v.interval)
    }
  }

  testRender = () => {
    const { selectSub, subscription, isReferral } = this.props
    const array = isReferral ? this.getSubscriptionList() : subscription
    return (
      <div className="plans-subscription-list test">
        {_.map(array, (v, k) => {
          const icon = v.operation_plan ? v.operation_plan.icon_v2_url : null
          const isSelected = selectSub.id === v.id

          return (
            <div
              onClick={this.handleSelect(v)}
              className={`subscription-select-box test ${
                isSelected ? 'selected' : ''
              }`}
              key={k}
            >
              <div className="plans-select-container">
                <div className="sub-introduce">
                  <p className="title">
                    {`${v.display_name}${CARD_TYPE.getCardType(v.interval)}`}卡
                    {icon ? <img className="icon" alt="" src={icon} /> : null}
                  </p>
                  <p className="text">
                    每次
                    <b className="test-price">
                      {v.clothing_count + v.accessory_count}
                    </b>
                    件
                  </p>
                  <p className="text">免邮免清洗</p>
                </div>
              </div>
              <div className="price-container">
                <div className="final-price">
                  <span className="unit">¥</span>
                  <span style={{ fontWeight: 'bold' }}>{v.base_price}</span>
                </div>
                <div className="original-price">
                  {`${
                    v.original_price !== v.base_price
                      ? `¥${v.original_price}`
                      : ''
                  }`}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  defaultRedner = () => {
    const {
      selectSub,
      subscription,
      isReferral,
      customer,
      authentication,
      isWechat
    } = this.props
    const array = isReferral ? this.getSubscriptionList() : subscription
    return (
      <div className="plans-subscription-list">
        {_.map(array, (v, k) => {
          const icon = v.operation_plan ? v.operation_plan.icon_v2_url : null
          const isSelected = selectSub.id === v.id

          return (
            <div className="subscription-select-container" key={k}>
              <div
                onClick={this.handleSelect(v)}
                className={`subscription-select-box ${
                  isSelected ? 'selected' : ''
                }`}
              >
                <div className="plans-select-container">
                  <span
                    className={`select-icon ${isSelected ? 'selected' : ''}`}
                  />
                  <div className="sub-introduce">
                    <p className="title">
                      {`${v.display_name}${CARD_TYPE.getCardType(v.interval)}`}
                      卡
                      {icon ? <img className="icon" alt="" src={icon} /> : null}
                    </p>
                    <p className="text">{v.description}</p>
                  </div>
                </div>
                <div className="price-container">
                  <span className="final-price">
                    <span className="unit">¥</span>
                    <span style={{ fontWeight: 'bold' }}>{v.base_price}</span>
                  </span>
                  {v.original_price !== v.base_price && (
                    <span className="original-price">
                      <span>¥{v.original_price}</span>
                    </span>
                  )}
                </div>
              </div>
              {isSelected &&
                v.interval === 1 &&
                authentication.isValidSubscriber && (
                  <FreePasswordTips
                    isWechat={isWechat}
                    customer={customer}
                    subscription={v}
                    isOtherText={this.state.isOtherText}
                    handleOpenFreepassword={this.handleOpenFreepassword}
                  />
                )}
            </div>
          )
        })}
      </div>
    )
  }

  handleOpenFreepassword = () => {
    window.adhoc('track', 'click_free_password_btn', 1)
    browserHistory.push('/free_password')
  }

  render() {
    const { authentication, isWechat } = this.props
    const { isOhterPages } = this.state
    if (!isWechat) {
      return this.defaultRedner()
    }
    if (isOhterPages) {
      if (isOhterPages === '2' && !authentication.isSubscriber) {
        return this.testRender()
      } else {
        return this.defaultRedner()
      }
    } else {
      return null
    }
  }
}
