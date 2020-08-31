import { connect } from 'react-redux'
import PageHelmet from 'src/app/lib/pagehelmet'
import { browserHistory } from 'react-router'
import './index.scss'

const getState = state => {
  return { app: state.app }
}

export default connect(getState)(SharePhotoIncentive)
function SharePhotoIncentive({ app }) {
  return (
    <div className="share-photo-incentive">
      <PageHelmet title="LE TOTE 托特衣箱" link="/share-photo-incentive" />
      <img
        src={require('src/app/containers/complete_size/images/success_logo.png')}
        alt="purchase_img"
        className="logo"
      />
      <h5 className="finish-text">提交成功</h5>
      <div className="border" />
      <h5 className="amount-text">恭喜获得15元</h5>
      <img
        className="amount-img"
        src={require('./images/success_amount.png')}
        alt=""
      />
      <p className="amount-tips">奖励金已到账，可在“我的-信用账户”中查看</p>
      <p className="amount-tips clear-margin">继续晒单有机会得5元哦！</p>
      {app.isWechat && (
        <div className="finish-btn" onClick={browserHistory.goBack}>
          返回
        </div>
      )}
    </div>
  )
}
