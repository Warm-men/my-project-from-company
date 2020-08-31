import Headportrait from 'src/assets/images/account/mine_headportrait.svg'
import banner_img from './images/my_center_banner_background.png'
import VipIcon from 'src/app/containers/customer_photos/images/vip_icon.png'
import { browserHistory } from 'react-router'
import './index.scss'

const MyCenterBanner = props => {
  const { nickname, avatar_url, customer_photo, roles } = props.customer
  if (!customer_photo) {
    return null
  }
  const { customer_photo_count, liked_count } = customer_photo

  const handleClick = () => {
    browserHistory.push('/customer_photos_mycenter')
  }

  const renderNumber = number => {
    if (!_.isNumber(number)) return 0
    let result = number || 0
    if (_.gte(number, 1000)) {
      result = Math.round(number / 100) / 10 + 'k'
    }
    if (_.gte(number, 10000)) {
      result = Math.round(number / 1000) / 10 + 'w'
    }
    return result
  }

  return (
    <div className="my_center_banner" onClick={handleClick}>
      <div className="container">
        <img src={banner_img} alt="" className="banner-img" />
        <div className="content">
          <div className="message">
            <div className="avatar-wrapper">
              <img
                className="avatar-img"
                src={avatar_url || Headportrait}
                alt=""
              />
              {_.find(roles, { type: 'stylist' }) && (
                <img src={VipIcon} alt="" className="vip-icon" />
              )}
            </div>
            <span className="username">{nickname}</span>
            <div className="vline" />
            <span className="number">{renderNumber(customer_photo_count)}</span>
            <span className="text">晒单</span>
            <span className="number">{renderNumber(liked_count)}</span>
            <span className="text">获赞</span>
          </div>
          <div className="button">
            <span className="span">查看</span>
            <div className="arrow"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyCenterBanner
