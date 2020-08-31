import React from 'react'
import 'src/assets/stylesheets/mobile/homepage.scss'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { l10setSizeInfo } from 'src/app/lib/product_l10n.js'
import Actions from 'src/app/actions/actions'
import wxInit from 'src/app/lib/wx_config'
import deviceType from 'src/app/lib/device_type'
import Avator from 'src/assets/images/avator.png'
import { APPStatisticManager } from '../../../lib/statistics/app'

const homepageShowCount = 3

class HomepageSharing extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = /MicroMessenger/i.test(navigator.userAgent)
      ? this.handleWeChatClick
      : this.handleWebClick
  }

  componentDidMount() {
    this.getSharingData()
    if (deviceType().isiOS) {
      wxInit()
    } else {
      wxInit(true, null, true)
    }
  }

  handleWeChatClick = product => {
    const img = product.url || product.mobile_url
    const NewArr = [img]
    wx.previewImage({
      urls: NewArr, // 需要预览的图片http链接列表
      fail: () => wxInit(true, () => this.handleWeChatClick(product))
    })
  }

  handleWebClick = product => {
    this.props.dispatch(
      Actions.fullscreencarousel.setFullScreenPhoto([product])
    )
    browserHistory.push('/fullscreen')
  }

  getSharingData = () => {
    const { customer_photos, dispatch } = this.props
    if (_.isEmpty(customer_photos)) {
      dispatch(Actions.homepage.fetchCustomerPhotos(homepageShowCount))
    }
  }

  gotoSharingList = () => {
    sessionStorage.setItem('refreshCustomerPhotos', true)
    browserHistory.push('/customer-photos')
  }

  productDetail = shareProduct => () => {
    window.adhoc('track', 'enter_product_detail_v2', 1)
    browserHistory.push({
      pathname: `/products/${parseInt(shareProduct.product_id, 10)}`,
      state: {
        img_url: shareProduct.product_photo,
        column_name: 'LatestCustomerPhotos'
      }
    })
  }

  handleClickCustomerPhoto = e => {
    APPStatisticManager.onClickElement(e.currentTarget)
  }

  render() {
    const { customer_photos } = this.props
    return customer_photos && customer_photos.length > 0 ? (
      <div className="homepage-products-list">
        <div className="title-box">
          <div className="title">
            <span className="title-border" />
            <span className="title-text">最新晒单</span>
            <span className="title-border" />
          </div>
          <div className="title-img">NEW SHOW</div>
        </div>
        {_.map(customer_photos, (v, k) => {
          return (
            <div
              onClick={this.handleClickCustomerPhoto}
              key={k}
              className={k === 0 ? 'share-box clear-padding' : 'share-box'}
            >
              <div className="share-title-box">
                <div className="share-title-img">
                  <img
                    src={v.customer_avatar ? v.customer_avatar : Avator}
                    alt=""
                  />
                </div>
                <div className="share-title-text">
                  <span className="share-nickname">{v.customer_nickname}</span>
                  <span className="share-information">{`${v.customer_city} ${
                    v.customer_height_inches
                      ? `| 身高${v.customer_height_inches}CM`
                      : ``
                  } | ${
                    v.product_size !== '' && v.product_size === 'OS'
                      ? '均码'
                      : `${l10setSizeInfo(v.product_size)}码`
                  }`}</span>
                </div>
              </div>
              {/* <p className="rating-text">
                和闺蜜们一起开启时尚之旅，这件衣服非常喜欢，穿起来也非常舒适。大爱这件单品。
              </p> */}
              <div onClick={() => this.handleClick(v)}>
                <img className="rating-img" src={v.mobile_url} alt="" />
              </div>
              <div onClick={this.productDetail(v)} className="product-box">
                <div className="product-img">
                  <img src={v.product_photo} alt="" />
                </div>
                <div className="product-information">
                  <span className="name">{v.product_title}</span>
                  <span className="brand">{v.product_brand}</span>
                </div>
              </div>
            </div>
          )
        })}
        <img
          onClick={this.gotoSharingList}
          className="share-more-img"
          src={require('../images/more.png')}
          alt="more"
        />
      </div>
    ) : null
  }
}

function mapStateToProps({ homepage }) {
  return homepage
}
export default connect(mapStateToProps)(HomepageSharing)
