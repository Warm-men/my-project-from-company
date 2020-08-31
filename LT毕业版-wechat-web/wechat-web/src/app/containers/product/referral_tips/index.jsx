import ReferralTipsHOC from 'src/app/components/referrral_tips/referral_tips_hoc.jsx'
import './index.scss'

export default ReferralTipsHOC(ProductDetailReferral)
function ProductDetailReferral(props) {
  const { handleClick, avatar, nickname, customer } = props
  return (
    <div onClick={handleClick} className="product-detail-referral-tips">
      <img className="avatar" src={avatar} alt="" />
      <span className="text">{nickname || '小姐姐'}</span>
      <span style={{ wordBreak: 'keep-all' }}>送你</span>
      <span className="price">
        {customer.active_referral_program &&
          customer.active_referral_program.sender_amount}
        元
      </span>
      <div className="cover-btn" />
    </div>
  )
}
