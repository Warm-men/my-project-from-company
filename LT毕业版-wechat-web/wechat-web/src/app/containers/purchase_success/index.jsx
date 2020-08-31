import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PageHelmet from 'src/app/lib/pagehelmet'
import Actions from 'src/app/actions/actions'
import './index.scss'
import { DEFAULT_APP_LINK } from '../../constants/global_config'

const getStae = state => {
  return {
    customer: state.customer,
    isWechat: state.app.isWechat,
    isMiniApp: state.app.platform === 'mini_app'
  }
}

@connect(getStae)
export default class PurchaseSuccess extends PureComponent {
  constructor(props) {
    super()
    this.QRCode = props.QRCode || require('./images/wechat.jpeg')
  }

  componentDidMount() {
    this.props.dispatch(Actions.currentCustomer.fetchMe())
  }

  handleDownload = () => (window.location.href = DEFAULT_APP_LINK)

  renderWechat = () => {
    const {
      isWechat,
      isMiniApp,
      customer: { subscription }
    } = this.props
    const isNotWechat = !isWechat || isMiniApp
    return (
      <div>
        <div className="desc-container">
          <div className="details">
            {subscription && (
              <p>
                {`会员期从首个衣箱寄出或${subscription.remain_additional_days}天后开始计算`}
              </p>
            )}
            请立即关注我们，开始使用吧！
          </div>
          <img src={this.QRCode} alt="" className="referral-code" />
          {isNotWechat && (
            <p className="follow-tips">截图页面至相册，用微信扫一扫即可轻松</p>
          )}
          <p className="follow-tips">
            {isNotWechat
              ? `关注“LeTote托特衣箱”公众号`
              : '长按二维码关注“LeTote托特衣箱”'}
          </p>
        </div>
        {!isMiniApp && (
          <div className="download-box">
            <img className="logo" src={require('./images/logo.svg')} alt="" />
            <div className="text-box">
              <p className="large">下载“托特衣箱APP”</p>
              <p className="middle">立享会员服务</p>
            </div>
            <span className="app-btn" onClick={this.handleDownload}>
              去下载
            </span>
          </div>
        )}
      </div>
    )
  }

  renderOther = () => {
    const {
      customer: { subscription },
      userType
    } = this.props
    return (
      <div className="desc-container">
        <div className="details">
          {subscription && userType !== 'renewMember' && (
            <p>
              {`会员期从首个衣箱寄出或${subscription.remain_additional_days}天后开始计算`}
            </p>
          )}
          请下载“托特衣箱APP”，开始使用吧！
        </div>
        <span className="other-btn" onClick={this.handleDownload}>
          下载APP
        </span>
        <p className="other-text">或在微信内搜索“LeTote托特衣箱”公众号关注</p>
      </div>
    )
  }

  render() {
    const { helmetTitle, helmetLink, desc, isWechat, QRCode } = this.props
    return (
      <div className="purchase-success">
        <PageHelmet title={helmetTitle} link={helmetLink} />
        <img
          src={require('./images/success.svg')}
          alt="purchase_img"
          className="refer-suc"
        />
        <p className="desc">{desc}</p>
        {isWechat || !_.isEmpty(QRCode)
          ? this.renderWechat()
          : this.renderOther()}
      </div>
    )
  }
}

PurchaseSuccess.defaultProps = {
  helmetTitle: '购买成功',
  helmetLink: '/purchase_success',
  desc: '购买成功'
}
