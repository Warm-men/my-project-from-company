import React, { PureComponent } from 'react'
import './index.scss'
import ICON_SORRY from './images/icon_sorry.png'
import PageHelmet from 'src/app/lib/pagehelmet'

export default class ActivityEnd extends PureComponent {
  render() {
    return (
      <div className="memvbership">
        <PageHelmet title="LeTote免费试用福利" link={`/new_clothes_free`} />
        <img src={ICON_SORRY} alt="...." />
        <p className="sorry-text-large">本活动已结束</p>
        <p className="sorry-text-large">请继续关注托特衣箱的其他活动</p>
      </div>
    )
  }
}
