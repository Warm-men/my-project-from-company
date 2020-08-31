import PropTypes from 'prop-types'
import VipIcon from 'src/app/containers/customer_photos/images/vip_icon.png'
import Headportrait from 'src/assets/images/account/mine_headportrait.svg'
import LikeButton from 'src/app/containers/customer_photos/like_button'
import { l10nForSize } from 'src/app/lib/product_l10n.js'

const CustomerPhotosDetailItemHeader = props => {
  const {
    hasLikeButton,
    customerPhotosItem,
    updateCustomerPhotoDetails
  } = props
  const { products, customer } = customerPhotosItem
  const { nickname, avatar, city, height_inches, roles } =
    props.customer || customer
  const size_abbreviation =
    !!products.length &&
    products[0].product_size &&
    products[0].product_size.size_abbreviation
  const avatarImg = avatar || Headportrait
  const size = l10nForSize(size_abbreviation, true)

  const info =
    hasLikeButton && size
      ? height_inches
        ? `${city} | ${height_inches}cm | ${size}`
        : `${city} | ${size}`
      : height_inches
      ? `${city} | ${height_inches}cm`
      : `${city}`
  const nikenameStyle = (hasLikeButton, isStylelist) => {
    let base = 'nikname'
    if (hasLikeButton) {
      base += ' fix-niname-width'
    }
    if (isStylelist) {
      base += ' gold'
    }
    return base
  }
  const isStylelist = _.find(roles, { type: 'stylist' })

  return (
    <div className="header-contents">
      <div className="left-view">
        <div className="avatar-wrapper">
          <img src={avatarImg} alt="" className="avatar" />
          {isStylelist && <img src={VipIcon} alt="" className="vip-icon" />}
        </div>
        <div className="info-box">
          <div className={nikenameStyle(hasLikeButton, isStylelist)}>
            {nickname}
          </div>
          <div className="rest-info">
            <div className="city">{info}</div>
          </div>
        </div>
      </div>
      {hasLikeButton && (
        <LikeButton
          item={customerPhotosItem}
          updateCustomerPhotoDetails={updateCustomerPhotoDetails}
          inDetails={true}
        />
      )}
    </div>
  )
}

export default React.memo(CustomerPhotosDetailItemHeader)

CustomerPhotosDetailItemHeader.propTypes = {
  customer: PropTypes.object.isRequired
}

CustomerPhotosDetailItemHeader.defaultProps = {
  customer: {
    nickname: ' ',
    avatar: 'https://',
    city: ' ',
    heihgt: ' '
  }
}
