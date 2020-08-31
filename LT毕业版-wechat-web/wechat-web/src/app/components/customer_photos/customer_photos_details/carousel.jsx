import PropTypes from 'prop-types'
import { useState, useRef, useLayoutEffect } from 'react'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions.js'
import wxInit from 'src/app/lib/wx_config'
import Swiper from 'react-id-swiper'
import ImageStickers from 'src/app/components/customer_photos/customer_photos_details/image_stickers'
import 'react-id-swiper/lib/styles/css/swiper.css'
import './carousel.scss'

export default function PhotosCarousel(props) {
  const [activeIndex, setActiveIndex] = useState(1)
  const [offsetWidth, setOffsetWidth] = useState(0)
  const [offsetHeight, setOffsetHeight] = useState(0)
  const swiperEl = useRef(null)

  const slideNext = () => setActiveIndex(index => index + 1)

  const slidePrev = () => setActiveIndex(index => index - 1)

  useLayoutEffect(() => {
    setOffsetWidth(swiperEl.current.offsetWidth)
    setOffsetHeight(swiperEl.current.offsetHeight)
  }, [swiperEl.current])

  const handleWeChatClick = (props, index) => () => {
    const NewArr = []
    _.map(props.customerPhotosImages, photo => {
      NewArr.push(photo.url || photo.mobile_url)
      return false
    })
    wx.ready(() => {
      wx.previewImage({
        current: NewArr[index], // 当前显示图片的http链接
        urls: NewArr, // 需要预览的图片http链接列表
        fail: () => wxInit(true, () => handleWeChatClick(props, index))
      })
    })
  }

  const handleWebClick = (props, index) => () => {
    const { customerPhotosImages, dispatch } = props

    dispatch(
      Actions.fullscreencarousel.setFullScreenPhoto(customerPhotosImages)
    )
    dispatch(Actions.fullscreencarousel.setInitIndex(index))
    browserHistory.push('/fullscreen')
  }

  const handleClick = props.app.isWechat ? handleWeChatClick : handleWebClick

  const options = {
    on: {
      slideNextTransitionEnd: _.debounce(slideNext, 100, { leading: true }),
      slidePrevTransitionEnd: _.debounce(slidePrev, 100, { leading: true })
    },
    pagination: { showsPagination: false },
    shouldSwiperUpdate: true
  }

  const getImageStyle = photo => {
    // const scale = photo.width / photo.height
    let style = {
      backgroundImage: `url(${photo.url})`
    }
    if (!photo.width || !photo.height) {
      style = {
        ...style,
        backgroundSize: 'cover'
      }
    } else {
      // style = {
      //   ...style,
      //   backgroundSize:
      //     photo.height > photo.width
      //       ? `100% ${offsetWidth / scale}px`
      //       : `${100 * scale}% 100%`
      // }
    }
    return style
  }
  const { customerPhotosImages } = props
  const pageLength = customerPhotosImages.length
  return (
    <div
      id="customer-photo-detail-carousel"
      className="swiper-wrapper swiper-photo-carousel-wrapper"
    >
      <Swiper {...options}>
        {_.map(customerPhotosImages, (photo, photoIndex) => {
          return (
            <div
              ref={swiperEl}
              className="swiper-slide swiper-image-container customer-photo-detail-image"
              key={photoIndex}
              style={getImageStyle(photo)}
              onClick={handleClick(props, photoIndex)}
            >
              <ImageStickers
                offsetWidth={offsetWidth}
                offsetHeight={offsetHeight}
                photo={photo}
                stickers={photo.stickers}
              />
            </div>
          )
        })}
      </Swiper>
      <div className="pageActiveIndex">{`${activeIndex}/${pageLength}`}</div>
    </div>
  )
}

PhotosCarousel.propTypes = {
  customerPhotosImages: PropTypes.array.isRequired
}

PhotosCarousel.defaultProps = {
  customerPhotosImages: [
    {
      mobile_url: 'https://',
      url: 'https://'
    }
  ]
}
