import PropTypes from 'prop-types'
import LikeButton from 'src/app/containers/customer_photos/like_button.jsx'
import Headportrait from 'src/assets/images/account/mine_headportrait.svg'
import VipIcon from 'src/app/containers/customer_photos/images/vip_icon.png'
import './index.scss'

class CustomerPhotosInHomeItem extends React.PureComponent {
  didSelectedCustomerPhoto = () => {
    const {
      didSelectedCustomerPhoto,
      item: { id }
    } = this.props
    didSelectedCustomerPhoto(id)
  }
  render() {
    const { item } = this.props
    const { photos, customer, content } = item
    const { avatar, nickname, roles } = customer

    const mobile_url = photos && photos[0].mobile_url
    const avatarImg = avatar || Headportrait
    const isStylelist = _.find(roles, { type: 'stylist' })
    return (
      <div className="item-container" onClick={this.didSelectedCustomerPhoto}>
        <div
          style={{
            backgroundImage: `url(${mobile_url})`
          }}
          className="photo_img"
        />
        <div
          style={{ WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}
          className="description"
        >
          {content}
        </div>
        <div className="flower">
          <div className="info">
            <div className="avatar-wrapper">
              <img src={avatarImg} alt="" className="avatar-img" />
              {isStylelist && <img src={VipIcon} alt="" className="vip-icon" />}
            </div>
            <div className={isStylelist ? 'nikname gold' : 'nikname'}>
              {nickname}
            </div>
          </div>
          <LikeButton item={item} />
        </div>
      </div>
    )
  }
}

CustomerPhotosInHomeItem.propTypes = {
  item: PropTypes.object.isRequired,
  didSelectedCustomerPhoto: PropTypes.func.isRequired
}

CustomerPhotosInHomeItem.defaultProps = {
  item: {},
  didSelectedCustomerPhoto: () => {}
}

export default CustomerPhotosInHomeItem
