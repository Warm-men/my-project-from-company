import React, { PureComponent } from 'react'
import { browserHistory } from 'react-router'
import './index.scss'

export default class AutoRenewDiscount extends PureComponent {
  gotoFreePassword = () => browserHistory.push('/free_password')

  render() {
    const { data, isNewPlans, platform } = this.props
    if (_.isEmpty(data)) {
      return null
    }
    if (!_.isEmpty(data.auto_renew_discount_hint)) {
      // NOTE:京东环境隐藏衣箱免密
      if (platform === 'jd') {
        return null
      }
      return (
        <div
          className={`auto_renew_discount_hint ${isNewPlans && 'none_border'}`}
        >
          <div>{data.auto_renew_discount_hint}</div>
          <div className="auto_renew_btn" onClick={this.gotoFreePassword}>
            去开通
          </div>
        </div>
      )
    }
    if (data.preview.auto_renew_discount > 0) {
      return (
        <div
          className={`auto_renew_discount_hint clear-margin ${isNewPlans &&
            'none_border'}`}
        >
          <div>已开通自动续费</div>
          <div className="auto_renew_discount_text">
            -¥{data.preview.auto_renew_discount}
          </div>
        </div>
      )
    }
    return null
  }
}
