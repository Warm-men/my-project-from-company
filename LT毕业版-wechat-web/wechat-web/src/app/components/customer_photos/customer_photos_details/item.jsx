import PropTypes from 'prop-types'
import Header from './header'
import PhotosCarousel from './carousel'
import Description from './description'
import Followers from './followers'
import Related from './related'
import './index.scss'

export default function CustomerPhotoDetailsItem(props) {
  const { dispatch, app, currentCustomer } = props

  const linkTitle = () => {
    if (app.platform !== 'jd') {
      const { share_topics } = props.customerPhotoDetailItem
      window.location.href = share_topics[0].url
    }
  }

  const {
    toggleCloset,
    didSelectedItem,
    customerPhotoDetailItem: {
      products,
      content,
      customer,
      photos,
      share_topics,
      like_customers,
      liked,
      likes_count,
      id
    },
    customerPhotoDetailItem
  } = props

  const isOwnShare = _.toNumber(currentCustomer.id) === customer.id
  return (
    <div className="customerPhotoDetailsItem">
      <Header
        customer={customer}
        customerPhotosItem={customerPhotoDetailItem}
      />
      <PhotosCarousel
        app={app}
        customerPhotosImages={photos}
        dispatch={dispatch}
      />
      <Description
        content={content}
        share_topics={share_topics}
        linkTitle={linkTitle}
      />
      <Followers
        like_customers={like_customers}
        likes_count={likes_count}
        liked={liked}
        maxLength={6}
        id={id}
        isOwnShare={isOwnShare}
      />
      <Related
        products={products}
        didSelectedItem={didSelectedItem}
        toggleCloset={toggleCloset}
      />
    </div>
  )
}

CustomerPhotoDetailsItem.propTypes = {
  customerPhotoDetailItem: PropTypes.object.isRequired
}

CustomerPhotoDetailsItem.defaultProps = {
  customerPhotoDetailItem: {}
}
