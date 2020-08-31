import React from 'react'
import 'src/assets/stylesheets/components/desktop/follow_wechat_account/follow_wechat_account.scss'
import PageHelmet from 'src/app/lib/pagehelmet'

export default class FollowWechatAccountContainer extends React.PureComponent {
  render() {
    return (
      <div className="qr-container">
        <PageHelmet title={'创始会员'} link={'/wechat'} />
        <img
          src={require('src/assets/images/follow_wechat_account/banner.png')}
          alt="banner"
        />
        <img
          className="qr-icon"
          src={require('src/assets/images/follow_wechat_account/qr_mobile.png')}
          alt="托特衣箱公众号二维码"
        />
        <p>关注LeTote托特衣箱公众号, 成为创始会员</p>
        <span>
          长按识别二维码关注，或者将图片保存到本地，然后在微信扫一扫中选择相册图片，进行关注
        </span>
      </div>
    )
  }
}
