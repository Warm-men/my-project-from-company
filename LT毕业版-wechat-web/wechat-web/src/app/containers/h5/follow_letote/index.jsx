import React, { PureComponent } from 'react'
import './index.scss'
import { DEFAULT_APP_LINK } from '../../../constants/global_config'

class FollowLetote extends PureComponent {
  render() {
    return (
      <div className="follow-lt">
        <p>请立即关注我们吧！</p>
        <i className="qr_code" />
        <span className="detail">
          截图页面至相册，用微信扫一扫即可轻松
          <br />
          关注“LeTote托特衣箱”公众号
        </span>
        <footer>
          <i className="logo" />
          <span>
            <div className="download-text">下载“托特衣箱APP”</div>
            <div>立享会员服务</div>
          </span>
          <button onClick={() => (window.location.href = DEFAULT_APP_LINK)}>
            去下载
          </button>
        </footer>
      </div>
    )
  }
}

export default FollowLetote
