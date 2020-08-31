import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions.js'
import { connect } from 'react-redux'
import Swiper from 'react-id-swiper'
import 'react-id-swiper/lib/styles/css/swiper.css'
import 'src/app/components/custom_components/swiper.scss'
@connect()
class CarouselSrcoll extends React.PureComponent {
  constructor(props) {
    super(props)
    this.options = {
      slidesPerView: 'auto',
      paginationClickable: true,
      freeMode: true,
      preloadImages: false,
      lazy: true,
      spaceBetween: 8
    }
  }

  handleClick = async props => {
    await this.props.dispatch(
      Actions.customerPhotosSummary.resetCustomerPhotosDetails()
    )
    const path = {
      pathname: '/customer_photos',
      query: { customer_photo_id: props.id }
    }
    browserHistory.push(path)
  }

  render() {
    const { photos } = this.props
    if (_.isEmpty(photos)) {
      return null
    }
    return (
      <div className="related-contents fix-margin-carousel">
        <div className="scroll-wrapper-view">
          <Swiper
            slideClass="custom-swiper-slide"
            wrapperClass="custom-swiper-wrapper"
            {...this.options}
          >
            {_.map(photos, (photo, index) => {
              return (
                <div
                  className="photo-view"
                  key={index}
                  onClick={() => this.handleClick(this.props, index)}
                >
                  <div
                    style={{
                      backgroundImage: `url(${photo.mobile_url})`
                    }}
                    className="photo-img"
                  />
                </div>
              )
            })}
          </Swiper>
        </div>
      </div>
    )
  }
}

export default CarouselSrcoll

CarouselSrcoll.propTypes = {
  customerPhotosImages: PropTypes.array.isRequired
}

CarouselSrcoll.defaultProps = {
  customerPhotosImages: [
    {
      mobile_url: 'https://',
      id: 1
    }
  ]
}
