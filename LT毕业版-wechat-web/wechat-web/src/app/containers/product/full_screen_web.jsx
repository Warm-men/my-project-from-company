import Swiper from 'react-id-swiper'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import 'swiper/dist/css/swiper.min.css'
import 'src/assets/stylesheets/components/desktop/product/full_screen.scss'

function mapStateToProps(state, props) {
  const { query } = props.location
  const { fullScreenCarousel, fullScreenCarouselInProduct } = state
  const { photos } = query.isCustomerPhotosInDetails
    ? fullScreenCarouselInProduct
    : fullScreenCarousel
  return {
    photos,
    initIndex: state.fullScreenCarousel.initIndex
  }
}

export default connect(mapStateToProps)(FullScreenWeb)
function FullScreenWeb({ initIndex, dismiss, photos }) {
  const pagination = { el: '.swiper-pagination', clickable: true }
  return (
    <div onClick={dismiss} className="full-screen-container">
      <div className="swiper-wrapper">
        <Swiper pagination={pagination} initialSlide={initIndex}>
          {_.map(photos, photo => {
            const url = photo.giant_url || photo.full_url || photo.mobile_url
            return _.isEmpty(url) ? null : (
              <img alt="" key={photo.id} src={url} />
            )
          })}
        </Swiper>
      </div>
      <div className="back-icon" onClick={browserHistory.goBack}>
        {'\u2573'}
      </div>
      <div className="swiper-pagination" />
    </div>
  )
}
