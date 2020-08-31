import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import './index.scss'

const getState = state => {
  const { customer } = state
  return {
    customer
  }
}

@connect(getState)
class JdCreditJudge extends Component {
  constructor(props) {
    super(props)
    this.minScore = 90
    const { jd_credit_score } = props.customer
    this.isExcced = jd_credit_score && jd_credit_score.score >= this.minScore
  }

  componentWillMount() {
    if (this.isExcced) {
      const { query } = this.props.location
      const param = {
        pathname: '/promo_plans',
        query: {
          ...query,
          promo_code: 'LTCN_FREE_TOTE_79'
        }
      }
      browserHistory.replace(param)
    }
  }

  handleClick = () => browserHistory.replace('home')

  render() {
    return (
      <div className="jd-credit-judge">
        <img className="icon" src={require('./images/icon.svg')} alt="" />
        <p className="text">{`抱歉，本活动仅对小白信用分${this.minScore}以上用户开放`}</p>
        <span className="go-back-btn" onClick={this.handleClick}>
          返回首页
        </span>
      </div>
    )
  }
}

export default JdCreditJudge
