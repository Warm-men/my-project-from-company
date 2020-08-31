import PropTypes from 'prop-types'
import '../customer_photos_details/index.scss'
import Header from '../customer_photos_details/header'
import CarouselSrcoll from './carousel_srcoll'
import { connect } from 'react-redux'
import Actions from 'src/app/actions/actions.js'
@connect()
class CustomerPhotosInProductItem extends React.PureComponent {
  componentDidMount() {
    const {
      dispatch,
      customerPhotosItem: { photos }
    } = this.props
    dispatch(Actions.fullScreenCarouselPhotos.setFullScreenPhoto(photos))
  }
  render() {
    const {
      customerPhotosItem: { photos, content, customer, share_topics, id },
      customerPhotosItem,
      dispatch,
      updateCustomerPhotoDetails
    } = this.props
    const title =
      !!share_topics.length && share_topics[0] && share_topics[0].title
    const desc = title && content ? title + content : content || title
    return (
      <div className="customerPhotoDetailsItem fix-bottom">
        <Header
          customer={customer}
          customerPhotosItem={customerPhotosItem}
          hasLikeButton={true}
          updateCustomerPhotoDetails={updateCustomerPhotoDetails}
        />
        {desc && (
          <div className="description-contents fix-margin-bottom">
            <span className="description-color">{desc}</span>
          </div>
        )}
        <CarouselSrcoll dispatch={dispatch} photos={photos} id={id} />
      </div>
    )
  }
}

CustomerPhotosInProductItem.propTypes = {
  customerPhotosItem: PropTypes.object.isRequired,
  product: PropTypes.object
}

export default CustomerPhotosInProductItem
