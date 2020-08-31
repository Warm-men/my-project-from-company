import React from 'react'
import PageHelmet from 'src/app/lib/pagehelmet'
import './index.scss'
import { DEFAULT_APP_LINK } from '../../../constants/global_config'

class PlansSuccess extends React.PureComponent {
  handleDownLoad = () => {
    window.location.href = DEFAULT_APP_LINK
  }

  render() {
    return (
      <div>
        <PageHelmet title="Le Tote 托特衣箱" link="/plans_cancel" />
        <div className="plans-cancele-box">
          <img
            className="cancel-logo"
            src={require('./images/logo.png')}
            alt=""
          />
          <p className="cancel-text">下载「托特衣箱APP」，支持多种支付方式</p>
          <div className="cancel-pay-box">
            <div className="cancel-pay-container">
              <img src={require('./images/wxpay.png')} alt="" />
              <span>微信支付</span>
            </div>
            <div className="cancel-pay-container">
              <img src={require('./images/alipay.png')} alt="" />
              <span>支付宝支付</span>
            </div>
            <div className="cancel-pay-container">
              <img src={require('./images/jdpay.png')} alt="" />
              <span>京东支付</span>
            </div>
          </div>
          <div className="cancel-download-btn" onClick={this.handleDownLoad}>
            立即下载
          </div>
          <img
            className="cancel-qrcode"
            src={require('./images/qrcode.png')}
            alt=""
          />
          <p className="cancel-tips">
            或扫描二维码，进入应用市场下载「托特衣箱」APP
          </p>
        </div>
      </div>
    )
  }
}

export default PlansSuccess
