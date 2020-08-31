import PageHelmet from 'src/app/lib/pagehelmet'
import './success.scss'
import { DEFAULT_APP_LINK } from '../../../constants/global_config'

export default function RedeemCodeSuccess(props) {
  return (
    <div className="exchange-page-success">
      <PageHelmet title="兑换成功" link="/jd_exchange_success" />
      <div className="exchange-page-success-bg" />
      <div className="title-box">
        <h5 className="title">恭喜你，你已成功兑换</h5>
        <p className="title-tips">价值499元的高级搭配师1对1的服务</p>
      </div>
      <div className="qrcode-box">
        <h5 className="qrcode-title">立即开启搭配服务</h5>
        <h5 className="qrcode-title">添加搭配师小助理特特</h5>
        <p className="ps-text">【请备注：京东+手机号】</p>
        <img className="qrcode" alt="" src={require('./images/qrcode.png')} />
        <p className="ps-text">长按识别二维码</p>
      </div>
      {props.location.query.isShowApp && (
        <div
          onClick={() => (window.location.href = DEFAULT_APP_LINK)}
          className="download"
          alt=""
        />
      )}
    </div>
  )
}
