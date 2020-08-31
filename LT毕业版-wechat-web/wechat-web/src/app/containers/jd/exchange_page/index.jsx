import { connect } from 'react-redux'
import { useState } from 'react'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions'
import PageHelmet from 'src/app/lib/pagehelmet'
import './index.scss'

const mutationJdPlusRedeemCode = (input, success) => {
  return {
    type: 'API:JDPLUS:REDEEMCODE',
    API: true,
    method: 'POST',
    url: '/api/query',
    data: {
      query: `mutation JdPlusRedeemCode($input: JdPlusRedeemCodeInput!) {
        JdPlusRedeemCode(input: $input) {
          success
          error { error_code  message }
        }
      }
      `,
      variables: { input }
    },
    success
  }
}

function JdEchangeRedeemCode(props) {
  const [status, setStatus] = useState('')

  const redeemCodeSuccess = (dispatch, res) => {
    const { success, error } = res.data.JdPlusRedeemCode
    if (success) {
      browserHistory.replace({
        pathname: '/jd_exchange_success',
        query: {
          isShowApp: true
        }
      })
    } else {
      if (error.error_code === 'error_wrong_code') {
        props.dispatch(
          Actions.tips.changeTips({
            isShow: true,
            content: error.message
          })
        )
      }
    }
  }

  const handleClick = _.debounce(() => {
    props.dispatch(
      mutationJdPlusRedeemCode({ code: status }, redeemCodeSuccess)
    )
  }, 250)

  const handleChange = e => setStatus(e.target.value)

  return (
    <div className="exchange-page">
      <PageHelmet title="兑换福利" link="/jd_exchange_page" />
      <div className="exchange-box">
        <img alt="" src={require('./images/exchange_input.png')} />
        <div className="text-box">
          <p>立即兑换你的专属福利</p>
          <p>价值499元1对1搭配师搭配服务一次</p>
        </div>
        <div className="btn-box">
          <input
            className="code-input"
            type="text"
            placeholder="请输入你的兑换码"
            onChange={handleChange}
          />
          <div className="exchange-btn" onClick={handleClick}>
            确定兑换
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect()(JdEchangeRedeemCode)
