import PropTypes from 'prop-types'
import { useEffect, useState, useRef, useMemo, useLayoutEffect } from 'react'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions.js'
import wxInit from 'src/app/lib/wx_config'
import Swiper from 'react-id-swiper'
import deviceType from 'src/app/lib/device_type'
import { placeholder_500_750 } from 'src/assets/placeholder'
import ProgressiveImage from 'src/app/components/ProgressiveImage'
import { shareReferralUrl } from 'src/app/lib/share_referral_url.js'
import 'react-id-swiper/lib/styles/css/swiper.css'
import 'src/assets/stylesheets/mobile/homepage.scss'
import './index.scss'
import {
  APPStatisticManager,
  BaiduStatisService
} from '../../lib/statistics/app'

function ProductImage({ props, handleClickImg, index, product }) {
  const handleClick = () => handleClickImg(props, index)
  const { state } = props.location
  const useImgUrl = index === 0 && state && state.img_url
  const placeholder = useImgUrl || placeholder_500_750
  return (
    <div className="swiper-slide swiper-image-container" onClick={handleClick}>
      <ProgressiveImage src={product.giant_url} placeholder={placeholder}>
        {url => <img className="product-catalogue-photo" alt="" src={url} />}
      </ProgressiveImage>
    </div>
  )
}
export default function ProductCarousel(props) {
  const { customer, app, dispatch } = props

  const [activeIndex, setAvtiveIndex] = useState(1)
  const productCarousel = useRef(null)

  const { location } = props

  useLayoutEffect(() => {
    setAvtiveIndex(1)
  }, [props.product.id])

  useEffect(() => {
    const { updateProductPhotoHeight } = props
    const height =
      productCarousel.current && productCarousel.current.offsetHeight
    updateProductPhotoHeight && updateProductPhotoHeight(height)
  }, [])

  const postMiniApp = () => {
    // NOTE:小程序环境postMessage处理ios分享
    if (app.platform === 'mini_app') {
      const { mini_share, product } = props
      // NOTE：因helmet影响，title不是进入界面就是正确的title，需要在页面更换标题后进行postMessage处理
      const data = {
        url: handleShareUrl(product.id) || window.location.origin,
        title: mini_share ? mini_share.title : '一件衣服价格，穿遍全球服饰',
        imageUrl: handleImage(
          mini_share
            ? mini_share.imgUrl
            : location.state
            ? location.state.img_url
            : '',
          product.type
        )
      }
      wx.miniProgram.postMessage({ data })
    }
  }
  useEffect(() => {
    if (deviceType().isiOS) {
      wxInit()
    } else {
      wxInit(true, null, true)
    }
    postMiniApp()
    //WECHATSHARE:  PRODUCT商品详情页微信分享
    wx.ready(() => {
      onMenuShareTimeline()
      onMenuShareAppMessage()
    })
  }, [props.product.id])

  const { catalogue_photos: cataloguePhotos } = props.product
  if (_.isEmpty(cataloguePhotos)) {
    return null
  }

  const handleShareUrl = id => {
    const url = `https://${window.location.host}/products/${id}`
    return shareReferralUrl(customer, url)
  }

  const handleImage = (img, type) => {
    return _.isEmpty(img)
      ? 'https://static.letote.cn/logo/mini_app.png'
      : type === 'Clothing'
      ? `${img}?imageMogr2/thumbnail/500x/crop/!500x400a0a0`
      : `${img}?imageView2/1/w/500/h/400`
  }

  const handleAnalyze = () => {
    const { product } = props
    APPStatisticManager.service(BaiduStatisService.id).track(
      'share',
      { productId: product.id },
      'share_product'
    )
  }

  const onMenuShareTimeline = () => {
    const { id, brand, title } = props.product
    wx.onMenuShareTimeline({
      title: `${brand ? brand.name : ''} ${title}`,
      link: handleShareUrl(id), // 分享链接，该链接域名必须与当前企业的名一致
      imgUrl: 'https://qimg.letote.cn/logo/12logo400x400.png', // 分享图标
      fail: () => wxInit(true, onMenuShareTimeline),
      complete: handleAnalyze
    })
  }

  const onMenuShareAppMessage = () => {
    const { id, brand, title } = props.product
    wx.onMenuShareAppMessage({
      title: `${brand ? brand.name : ''} ${title}`, // 分享标题
      desc: '来自美国的时装共享平台，成为会员即刻随心穿搭，尽情尝试不同风格', // 分享描述
      link: handleShareUrl(id), // 分享链接，该链接域名必须与当前企业的名一致
      imgUrl: 'https://qimg.letote.cn/logo/12logo400x400.png', // 分享图标
      type: 'link', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      fail: () => wxInit(true, onMenuShareAppMessage),
      complete: handleAnalyze
    })
  }

  const handleWeChatClick = (props, index) => {
    const { catalogue_photos } = props.product,
      NewArr = []
    catalogue_photos.map(photo => {
      const url = photo.giant_url || photo.full_url || photo.mobile_url
      NewArr.push(url)
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

  const handleWebClick = (props, index) => {
    dispatch(Actions.fullscreencarousel.setInitIndex(index))
    browserHistory.push('/fullscreen')
  }

  const handleClick = /MicroMessenger/i.test(navigator.userAgent)
    ? handleWeChatClick
    : handleWebClick

  const options = useMemo(() => {
    return {
      on: {
        slideChangeTransitionEnd: function() {
          setAvtiveIndex(this.activeIndex + 1)
        }
      },
      pagination: { showsPagination: false },
      observer: true
    }
  })

  const pageLength = cataloguePhotos.length

  return (
    <div className="swiper-product-carousel-container" ref={productCarousel}>
      <div className="swiper-product-carousel">
        <div className="swiper-wrapper swiper-product-carousel-wrapper">
          {!_.isEmpty(cataloguePhotos) && (
            <Swiper {...options}>
              {_.map(cataloguePhotos, (photo, index) => {
                return (
                  <ProductImage
                    key={index}
                    index={index}
                    product={photo}
                    props={props}
                    handleClickImg={handleClick}
                  />
                )
              })}
            </Swiper>
          )}
          <div className="pageActiveIndex">{`${activeIndex}/${pageLength}`}</div>
        </div>
      </div>
    </div>
  )
}

ProductCarousel.propTypes = {
  product: PropTypes.object.isRequired
}
