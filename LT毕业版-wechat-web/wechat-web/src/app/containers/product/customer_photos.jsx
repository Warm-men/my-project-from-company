import RectangleLoader from 'src/app/containers/tote_swap/rectangle_loader'
import Swiper from 'react-id-swiper'
import { l10setSizeInfo } from 'src/app/lib/product_l10n.js'
import { useRef } from 'react'
import { placeholder_500_500 } from 'src/assets/placeholder'
import 'src/app/components/custom_components/swiper.scss'

function CustomerPhoto({ styleShare, index }) {
  const {
    customer_nickname,
    customer_city,
    customer_height_inches,
    product_size
  } = styleShare
  return (
    <div key={index} id="focus-customer-photo" data-index={index}>
      <RectangleLoader
        placeholder={placeholder_500_500}
        className="style-share-image-middle"
        src={styleShare.mobile_url || styleShare.url}
      />
      <div className="user-info">
        <span>{customer_nickname}</span>
        <span>{customer_city}</span>
        {customer_height_inches && <span>身高{customer_height_inches}CM</span>}
        {product_size !== '' && (
          <span>
            {product_size === 'OS'
              ? '均码'
              : `${l10setSizeInfo(product_size)}码`}
          </span>
        )}
      </div>
    </div>
  )
}

export default function ProductCustomerPhotos(props) {
  const options = {
    slidesPerView: 'auto',
    paginationClickable: true,
    freeMode: true,
    freeModeMinimumVelocity: 0.1,
    preloadImages: false,
    lazy: true,
    spaceBetween: 0
  }

  const swiperRef = useRef(null)

  const changeIndex = index => () => swiperRef.current.slideTo(index)

  const getSwiper = swiper => swiper && (swiperRef.current = swiper.$el[0])

  const { customer_photos: photos } = props.product
  return (
    <div className="style-share">
      <div className="style-share-count">最新晒单</div>
      <Swiper
        getSwiper={getSwiper}
        slideClass="share-swiper-wrapper"
        wrapperClass="share-swiper-wrapper"
      >
        {_.map(photos, (value, index) => (
          <CustomerPhoto styleShare={value} index={index} />
        ))}
      </Swiper>
      <div className="customer-small-photo-slider">
        <Swiper
          slideClass="custom-swiper-slide"
          wrapperClass="custom-swiper-wrapper"
          {...options}
        >
          {!_.isEmpty(photos) && photos.length > 1 ? (
            _.map(photos, (styleShare, index) => (
              <div
                key={index}
                className="style-share-image-container"
                id="focus-customer-photo"
                onClick={changeIndex(index)}
              >
                <RectangleLoader
                  placeholder={placeholder_500_500}
                  className={'style-share-image-middle'}
                  src={styleShare.mobile_url || styleShare.url}
                />
              </div>
            ))
          ) : (
            <></>
          )}
        </Swiper>
      </div>
    </div>
  )
}
