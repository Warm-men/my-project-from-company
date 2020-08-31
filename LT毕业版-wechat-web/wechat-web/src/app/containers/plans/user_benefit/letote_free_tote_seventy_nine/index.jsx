import React from 'react'
import './index.scss'
import '../index.scss'

export default () => (
  <div className="benefits">
    <div className="user-benefit">
      <i className="img-same-style three-add-two" />
      <i className="img-same-style  intelligent-laundry" />
      <i className="img-same-style  professional-care" />
      <i className="img-same-style  shunfeng-courier" />
      <i className="img-same-style one-hundred" />
      <i className="img-same-style more-right" />
    </div>
  </div>
)

export const ActivityRules = ({ gotoAgreement }) => (
  <div className="activity-rule">
    <p>活动规则</p>
    <div className="activity-desc">
      1、活动仅针对芝麻信用分650分及以上的用户（免押金）；
    </div>
    <div className="activity-desc">
      2、每位体验卡用户限体验一个衣箱（包含3件衣服+2件配饰）；
    </div>
    <div className="activity-desc">
      3、付款成功后需于7天内下单，下单后开始计算时间；
    </div>
    <div className="activity-desc">
      4、体验到期的最后一天需预约归还衣箱（续费可推迟归还）；
    </div>
    <div className="activity-desc">5、体验卡使用期间不可暂停；</div>
    <div className="activity-desc">
      6、本服务不支持退款，购买即视为同意
      <span
        onClick={gotoAgreement}
        style={{
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#242424'
        }}
      >
        《用户服务协议》
      </span>
    </div>
  </div>
)
