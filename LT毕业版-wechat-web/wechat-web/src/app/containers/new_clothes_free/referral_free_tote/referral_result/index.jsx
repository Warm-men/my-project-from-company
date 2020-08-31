import { format } from 'date-fns'
import './index.scss'

export default ({ billing_date }) => (
  <div className="referral-success">
    <img
      src={require('../../images/success.png')}
      alt="referral_img"
      className="refer-suc"
    />
    <p className="desc">购买会员成功</p>
    <div className="details">
      会员有效期至{format(billing_date, 'YYYY年MM月DD日')}
      <br />
      请立即关注我们，开始使用吧！
    </div>
    <img
      src={require('../../images/referral_code.png')}
      alt=""
      className="referral-code"
    />
  </div>
)
