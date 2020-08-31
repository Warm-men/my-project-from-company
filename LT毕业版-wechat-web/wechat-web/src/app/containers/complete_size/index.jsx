import { connect } from 'react-redux'
import PageHelmet from 'src/app/lib/pagehelmet'
import { browserHistory } from 'react-router'
import './index.scss'

const getStae = state => {
  return { app: state.app }
}

export default connect(getStae)(CompleteSizeSuccess)
function CompleteSizeSuccess({ app }) {
  return (
    <div className="complete-size-success">
      <PageHelmet title="LE TOTE 托特衣箱" link="/complete_size_success" />
      <img
        src={require('./images/success_logo.png')}
        alt="purchase_img"
        className="logo"
      />
      <h5 className="amount-text">恭喜获得5元奖励金</h5>
      <img
        className="amount-img"
        src={require('./images/success_amount.png')}
        alt=""
      />
      <p className="amount-tips">奖励金已到账，可在“我的-信用账户”中查看</p>
      {app.isWechat && (
        <div className="finish-btn" onClick={browserHistory.goBack}>
          返回
        </div>
      )}
    </div>
  )
}
