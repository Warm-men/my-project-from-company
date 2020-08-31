import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import ProgressiveImage from 'src/app/components/ProgressiveImage'
import { placeholder_150_200 } from 'src/assets/placeholder'
import Swiper from 'react-id-swiper'
import Actions from 'src/app/actions/actions'
import { Column } from 'src/app/constants/column'

import 'react-id-swiper/lib/styles/css/swiper.css'
import 'src/app/components/custom_components/swiper.scss'
import { APPStatisticManager } from '../../../lib/statistics/app'

// NOTICE 不是通用的swiper just for brands
class HomepageSwiper extends React.Component {
  constructor(props) {
    super(props)
    this.options = {
      slidesPerView: 'auto',
      paginationClickable: true,
      freeMode: true,
      freeModeMinimumVelocity: 0.1,
      preloadImages: false,
      lazy: true,
      spaceBetween: 8,
      on: {
        touchEnd: _.debounce(this.setTouchPosition, 100, {
          leading: true
        }),
        transitionEnd: _.debounce(this.setTouchPosition, 100, {
          leading: true
        })
      }
    }
  }

  setTouchPosition = () => {
    if (!this.swiperDom) {
      return
    }
    const initPosition = this.swiperDom.childNodes[0].style.transform
    sessionStorage.setItem(this.cacheId, initPosition)
  }

  gotoProductDetail = async pathname => {
    await this.props.dispatch(Actions.allproducts.clearProducts(pathname))
    const column = Column.Brand
    browserHistory.push({ pathname, query: { column } })
  }

  handleClickBrandBox = e => {
    const element = e.currentTarget
    APPStatisticManager.onClickElement(element)
  }

  getSwiper = swiper => {
    if (swiper) {
      this.swiperDom = swiper.$el[0]
      this.cacheId =
        this.props.dataArr && JSON.stringify(this.props.dataArr).slice(0, 20)
      const cacheStyle = sessionStorage.getItem(this.cacheId)
      if (cacheStyle && this.swiperDom) {
        this.swiperDom.childNodes[0].style.transform = cacheStyle
      }
    }
  }

  renderItem(item, index) {
    return (
      <div className="brand-img" key={index}>
        <ProgressiveImage
          src={item.image_url}
          placeholder={placeholder_150_200}
        >
          {image => (
            <img
              alt=""
              src={image}
              onClick={() => this.gotoProductDetail(item.link)}
            />
          )}
        </ProgressiveImage>
      </div>
    )
  }

  gotoBrandsList = e => {
    const target = '/brands'
    APPStatisticManager.onRouterLeaveBefore({ element: e.currentTarget })
    browserHistory.push(target)
  }

  render() {
    return (
      <div className="homepage-products-list">
        <div className="title-box">
          <div className="title">
            <span className="title-border" />
            <span className="title-text">精选品牌</span>
            <span className="title-border" />
          </div>
          <div className="title-img">FEATURED BRANDS</div>
        </div>
        <div className="brand-box" onClick={this.handleClickBrandBox}>
          <Swiper
            getSwiper={this.getSwiper}
            slideClass="custom-swiper-slide"
            wrapperClass="custom-swiper-wrapper"
            {...this.options}
          >
            {this.props.dataArr.map((data, index) =>
              this.renderItem(data, index)
            )}
          </Swiper>
        </div>
        <img
          onClick={this.gotoBrandsList}
          className="share-more-img"
          src={require('../images/more.png')}
          alt="more"
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { homepage } = state
  return { ...homepage }
}

HomepageSwiper.defaultProps = {
  spaceBetween: 0,
  renderItem: () => {},
  dataArr: []
}

export default connect(mapStateToProps)(HomepageSwiper)
