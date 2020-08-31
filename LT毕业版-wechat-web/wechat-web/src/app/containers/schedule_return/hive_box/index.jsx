import React, { PureComponent } from 'react'
import PageHelmet from 'src/app/lib/pagehelmet'
import './index.scss'

export default class HiveBox extends PureComponent {
  render() {
    return (
      <div className="hive-box">
        <PageHelmet title={'丰巢智能柜寄回'} link="/hive_box" />
        <div className="hive-box-hint">
          使用丰巢智能柜自助寄回，无需承担快递费。复制衣箱寄回地址，在丰巢公众号自助下单，粘贴衣箱寄回地址，快递服务选择「顺丰揽件」，付款方式选择「到付」。
        </div>
        <div className={'hive-box-guide'}>
          <span className="title">丰巢智能柜寄回衣箱指南</span>
          <img
            src={require('../images/send_back_flow.png')}
            className="send-back-flow"
            alt="send_back_flow"
          />
        </div>
      </div>
    )
  }
}
