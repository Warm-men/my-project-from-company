import React from 'react'
import PropTypes from 'prop-types'
import RelatedItem from './related_item'
import './index.scss'
import { sortRelatedProducts } from 'src/app/lib/customer_photos'
import Swiper from 'react-id-swiper'
import 'react-id-swiper/lib/styles/css/swiper.css'
import 'src/app/components/custom_components/swiper.scss'

class CustomerPhotosDetailItemRelated extends React.PureComponent {
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
  render() {
    const { products, toggleCloset, didSelectedItem } = this.props
    if (_.isEmpty(products)) {
      return null
    }
    const newProducts = sortRelatedProducts(products)
    return (
      <div className="related-contents">
        <div className="title-view">关联单品</div>
        <div className="related-swipper">
          <Swiper
            slideClass="custom-swiper-slide"
            wrapperClass="custom-swiper-wrapper"
            {...this.options}
          >
            {_.map(newProducts, (item, index) => (
              <div className="related-item-view" key={index}>
                <RelatedItem
                  toteProduct={item}
                  index={index}
                  toggleCloset={toggleCloset}
                  didSelectedItem={didSelectedItem}
                />
              </div>
            ))}
          </Swiper>
        </div>
      </div>
    )
  }
}

export default CustomerPhotosDetailItemRelated

CustomerPhotosDetailItemRelated.propTypes = {
  products: PropTypes.array.isRequired
}

CustomerPhotosDetailItemRelated.defaultProps = {
  products: []
}
