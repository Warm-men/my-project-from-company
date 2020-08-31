import React from 'react'
import Swiper from 'react-id-swiper'
import ProgressiveImage from 'src/app/components/ProgressiveImage'
import Actions from 'src/app/actions/actions'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { placeholder_690_279 } from 'src/assets/placeholder'
import AddToClosetButton from 'src/app/components/shared/add_to_closet_redux_button'
import Title from '../../title'
import './index.scss'
import { APPStatisticManager } from '../../../../lib/statistics/app'

class HomepageProductsList extends React.PureComponent {
  constructor(props) {
    super(props)
    this.params = {
      slidesPerView: 'auto',
      spaceBetween: 8,
      freeMode: true,
      on: {
        touchEnd: _.debounce(this.setTouchPosition, 100, {
          leading: true
        }),
        transitionEnd: _.debounce(this.setTouchPosition, 100, {
          leading: true
        })
      }
    }
    this.swiperDom = null
    this.cacheId = null
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.products && nextProps.products.length > 0) {
      const products = nextProps.products
      this.cacheId = products && JSON.stringify(products).slice(0, 20)
      const cacheStyle = sessionStorage.getItem(this.cacheId)
      if (cacheStyle && this.swiperDom) {
        this.swiperDom.childNodes[0].style.transform = cacheStyle
      }
    }
  }

  setTouchPosition = () => {
    if (!this.swiperDom || _.isEmpty(this.cacheId)) {
      return null
    }
    const initPosition = this.swiperDom.childNodes[0].style.transform
    sessionStorage.setItem(this.cacheId, initPosition)
  }

  gotoProductDetail = product => {
    const img = product.catalogue_photos[0].full_url
    window.adhoc('track', 'enter_product_detail_v2', 1)
    browserHistory.push({
      pathname: `/products/${parseInt(product.id, 10)}`,
      state: {
        img_url: img,
        column_name: this.props.getReportData.column_name,
        product
      }
    })
  }

  toggleCloset = (id, reportData) => {
    const inCloset = _.includes(this.props.closetProductIds, id)
    if (inCloset) {
      this.props.dispatch(Actions.closet.remove([id]))
    } else {
      window.adhoc('track', 'add_closet_v2', 1)
      this.props.dispatch(Actions.closet.add([id], reportData))
    }
  }

  getSwiper = swiper => {
    if (swiper) {
      this.swiperDom = swiper.$el[0]
      if (this.props.products) {
        const products = this.props.products
        this.cacheId = products && JSON.stringify(products).slice(0, 20)
        const cacheStyle = sessionStorage.getItem(this.cacheId)
        if (cacheStyle && this.swiperDom) {
          this.swiperDom.childNodes[0].style.transform = cacheStyle
        }
      }
    }
  }

  renderSwiper = () => {
    const { products, closetProductIds } = this.props
    return (
      <Swiper {...this.params} getSwiper={this.getSwiper}>
        {_.map(products, (v, k) => (
          <div
            className="product-img"
            key={k}
            onClick={() => this.gotoProductDetail(v)}
          >
            <ProgressiveImage
              src={v.catalogue_photos[0].medium_url}
              placeholder={placeholder_690_279}
            >
              {image => <img alt="" src={image} />}
            </ProgressiveImage>
            <AddToClosetButton
              inCloset={_.includes(closetProductIds, v.id)}
              toggleCloset={e => {
                e.stopPropagation()
                this.toggleCloset(v.id, {
                  ...this.props.getReportData,
                  index: k + 1
                })
              }}
            />
          </div>
        ))}
      </Swiper>
    )
  }

  handleClickProductList = e => {
    APPStatisticManager.onRouterLeaveBefore({ element: e.currentTarget })
  }

  render() {
    const { title, title_content, logo, products } = this.props
    return (
      <div className="homepage-products-list">
        {title && <Title title={title} title_content={title_content} />}
        <div className="products-box">
          {logo && (
            <div onClick={this.handleLogoClick} className="logo-box">
              <img alt="" src={logo} />
              <span className="logo-arrow" />
            </div>
          )}
          <div
            className={logo ? 'products-list' : 'products-list clear-padding'}
            onClick={this.handleClickProductList}
          >
            {!_.isEmpty(products) ? this.renderSwiper() : null}
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(HomepageProductsList)
