import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import * as storage from 'src/app/lib/storage'

// 晒单业务 namespace: ShareList
// typescirpt type
// export type ShareList {
//   showShareIncentive: Boolean // 晒单奖励
// }

// ShareList 晒单业务统一处理函数
const WithShareListHandler = WrappedComponent => {
  class EnhancedComponent extends React.Component {
    render() {
      const {
        app,
        customer: { customer_photo_incentive_detail }
      } = this.props
      const isJdEnv = app.platform === 'jd'
      const showShareIncentive = customer_photo_incentive_detail && !isJdEnv

      const link_url =
        customer_photo_incentive_detail &&
        customer_photo_incentive_detail.link_url
      const incentive_hint =
        customer_photo_incentive_detail &&
        customer_photo_incentive_detail.incentive_hint

      const toShareListLink = (queryString = '', queryObject = {}) => {
        if (showShareIncentive && link_url) {
          window.location.href = link_url + queryString
        } else {
          const url = '/share_list'
          storage.set(url, 0)
          browserHistory.push({
            pathname: url,
            query: queryObject
          })
        }
      }

      return (
        <WrappedComponent
          {...this.props}
          ShareList={{
            showShareIncentive: showShareIncentive, // 提供统一的显示晒单奖励UI逻辑开关判断
            incentiveText: incentive_hint || '',
            linkUrl: link_url,
            toShareListLink
          }}
        />
      )
    }
  }
  return connect(({ app, customer }) => ({ app, customer }))(EnhancedComponent)
}

export default WithShareListHandler
