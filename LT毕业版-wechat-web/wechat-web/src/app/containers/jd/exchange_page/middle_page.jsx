import { connect } from 'react-redux'
import { useEffect, useState } from 'react'
import { browserHistory } from 'react-router'
import PageHelmet from 'src/app/lib/pagehelmet'
import './index.scss'

function ErrorPage({ text }) {
  return (
    <div className="error-page">
      <PageHelmet title="兑换失败" link="/jd_exchange_mid_page" />
      <img className="error-icon" src={require('./images/icon.png')} alt="" />
      {_.map(text, (v, k) => (
        <p key={k}>{v}</p>
      ))}
    </div>
  )
}

const mutatuibJdPlusExchange = success => {
  return {
    type: 'API:JDPLUS:EXCHANGE',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: `mutation {
        JdPlusValidateExchange(input: {}) {
          success
          error { error_code }
        }
      }`
    },
    success
  }
}

function JdEchangeMiddlePage(props) {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const getExchangeStatue = (dispatch, res) => {
      const { success, error } = res.data.JdPlusValidateExchange
      if (success) {
        browserHistory.replace('/jd_exchange_page')
      } else {
        if (error.error_code === 'error_not_subscribed') {
          const route = { pathname: '/plans', query: { jdExchange: true } }
          browserHistory.replace(route)
          return null
        }
        if (error.error_code === 'error_already_redeemed') {
          browserHistory.replace({
            pathname: '/jd_exchange_success',
            query: {
              isShowApp: true
            }
          })
          return null
        }
        setStatus(error.error_code)
      }
    }
    props.dispatch(mutatuibJdPlusExchange(getExchangeStatue))
  }, [])

  if (_.isEmpty(status)) return null

  if (status === 'error_not_new_subscription_type') {
    return <ErrorPage text={['本活动仅限新用户参与']} />
  }
  if (status === 'error_subscribed_overdue') {
    return <ErrorPage text={['哎呀！来晚了', '你已错过福利领取时间']} />
  }

  return <div className="jd-credit-judge"></div>
}

export default connect()(JdEchangeMiddlePage)
