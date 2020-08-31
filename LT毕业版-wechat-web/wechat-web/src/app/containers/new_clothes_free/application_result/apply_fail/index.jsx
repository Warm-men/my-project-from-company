import React from 'react'
import { browserHistory } from 'react-router'
import './index.scss'
import ZHIMA_CREDIT from '../../images/zhimaxinyong.png'
import TITLE from '../../images/zhima_title.png'
import * as storage from 'src/app/lib/storage.js'

const goHomePage = () => {
  browserHistory.push('/home')
}

const ApplyFail = props => {
  const isFreeTote79 = storage.get('LETOTE_FREE_TOTE_79')
  return (
    <div className="apply-fail">
      <img src={ZHIMA_CREDIT} alt="..." />
      <span>我的芝麻分</span>
      <p>{props.score}</p>
      <div className="result">
        {isFreeTote79 ? '抱歉，7天体验会员' : '抱歉，免费试用活动'}
        <br />
        仅针对芝麻分650以上用户开放
      </div>
      <img src={TITLE} alt="..." />
      <div className="detail" style={{ marginTop: '20px' }}>
        芝麻分不足，并不代表你的信用不好，建议从以下两方面着手提升你的芝麻分
      </div>
      <div className="detail" style={{ marginTop: '14px' }}>
        1、完善支付宝账户资料，包括学历学籍、职业信息、公积金、车辆房产信息等等
      </div>
      <div className="detail" style={{ marginTop: '14px' }}>
        2、使用支付宝中的各种服务，例如生活缴费、城市服务、绑定银行卡、蚂蚁花呗、余额宝等
      </div>
      <button onClick={goHomePage}>更多活动去首页看看</button>
    </div>
  )
}

export default ApplyFail
