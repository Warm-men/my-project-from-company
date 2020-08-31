import './index.scss'
import Hint from 'src/app/components/hint'
import CouponBanner from './coupon_banner'
import { browserHistory } from 'react-router'
import Actions from 'src/app/actions/actions'
import PageHelmet from 'src/app/lib/pagehelmet'
import ToteSlotIcon from 'src/app/containers/totes/tote_slot_icon'
import CounponToteCart from 'src/app/actions/tote_cart_coupon_actions.js'
import { getSizeName } from 'src/app/containers/product/detail_buttons/utils/product_detail_bottom_btn_util.js'
import { Column } from 'src/app/constants/column'

export default class CartProducts extends React.Component {
  state = { isShowHint: false }

  handleRemoveFromCart = value => () => {
    if (this.isLoading) return null

    this.isLoading = true
    const { dispatch } = this.props

    dispatch(
      Actions.toteCart.removeFromToteCart(
        value.product_size.id,
        this.removeFromCartSuccess,
        this.removeFromCartError
      )
    )
  }

  removeFromCartSuccess = () => {
    this.isLoading = false
  }

  removeFromCartError = () => {
    this.isLoading = false
  }

  gotoProductDetail = id => () => browserHistory.push(`/products/${id}`)

  handleGotoCollection = async () => {
    const { dispatch, filter_terms } = this.props
    const pathname = '/customize/closet'

    dispatch(Actions.toteSwap.setToteSwapHeader(['closet']))
    await dispatch(Actions.allproducts.clearProducts(pathname))
    await dispatch(Actions.mycloset.setWishingClosetFilter(filter_terms))
    const column = Column.SwapCloset
    browserHistory.push({ pathname, query: { filter_terms, column } })
  }

  handleArr = (products, length) => {
    let maxLength = length
    _.map(products, v => {
      if (v && v.slot > 1) {
        maxLength = maxLength + 1 - v.slot
      }
    })
    const arr = [...products]
    arr.length = maxLength

    return arr
  }

  hanldeCurNum = products => {
    let num = 0
    _.map(products, v => {
      if (v) {
        num += v.slot
      }
    })
    return num
  }

  handleUseClothingCoupon = () => {
    browserHistory.push({
      pathname: '/totes_clothes_coupon',
      query: { isToteCart: true }
    })
  }

  handleRemoveCoupon = () => {
    const { dispatch } = this.props

    this.setState({ isShowHint: false }, () => {
      dispatch(
        CounponToteCart.removeCouponFromToteCart({}, (dispatch, data) => {
          const {
            RemoveCouponFromToteCart: { errors }
          } = data.data
          if (!_.isEmpty(errors)) {
            dispatch(
              Actions.common.changeToast({
                isShow: true,
                content: errors[0].message,
                timer: 2
              })
            )
          }
        })
      )
    })
  }

  handleSizeName = product_size => {
    if (_.isEmpty(product_size) || _.isEmpty(product_size.size)) {
      return null
    }
    const { name } = product_size.size
    const sizeName = getSizeName(name)
    return _.includes(sizeName, '码') ? sizeName : `${sizeName}码`
  }

  hideHint = () => {
    this.setState({ isShowHint: false })
  }

  showHint = () => {
    this.setState({ isShowHint: true })
  }

  render() {
    const {
      title,
      maxNum,
      coupons,
      products,
      usedCoupons,
      placeholderImg
    } = this.props

    const newProducts = _.chunk(this.handleArr(products, maxNum), 3)
    return (
      <div className="tote-cart-products">
        <PageHelmet title="新衣箱" />
        <div className="cart-products-title">
          <span className="cart-title-left">
            <span className="cart-title-text">{title}</span>
            <span className="products-number">
              (
              <span className="current-num">{this.hanldeCurNum(products)}</span>
              /{maxNum})
            </span>
          </span>
        </div>

        <CouponBanner
          coupons={coupons}
          usedCoupons={usedCoupons}
          onCancel={this.showHint}
          onOk={this.handleUseClothingCoupon}
        />

        {this.state.isShowHint && (
          <Hint
            textAlign="center"
            content="确认本次不使用加衣券？"
            leftBtnText="取消"
            rightBtnText="确认"
            leftButton={this.hideHint}
            rightButton={this.handleRemoveCoupon}
          />
        )}
        {_.map(newProducts, (v, k) => {
          return (
            <div className="cart-product-col" key={k}>
              {_.map(v, (value, index) => {
                if (_.isEmpty(value)) {
                  return (
                    <div
                      onClick={this.handleGotoCollection}
                      className="cart-product"
                      key={index}
                    >
                      <img
                        className="cart-product-placeholder"
                        alt=""
                        src={placeholderImg}
                      />
                    </div>
                  )
                }
                const { product, product_size } = value
                const sizeName = this.handleSizeName(product_size)
                return (
                  <div className="cart-product" key={index}>
                    <span
                      className="close-box"
                      onClick={this.handleRemoveFromCart(value)}
                    >
                      <span className="close-icon" />
                    </span>
                    {product.tote_slot > 1 && (
                      <div className="cart-slot-box">
                        <ToteSlotIcon
                          slot={product.tote_slot}
                          type={product.type}
                        />
                      </div>
                    )}
                    <img
                      onClick={this.gotoProductDetail(product.id)}
                      alt=""
                      src={product.catalogue_photos[0].medium_url}
                      className="cart-product-img"
                    />
                    <CartTipsBox
                      product={product}
                      product_size={product_size}
                      gotoProductDetail={this.gotoProductDetail}
                      sizeName={sizeName}
                    />
                    {product.type === 'Clothing' && (
                      <span className="cart-product-size">{sizeName}</span>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
}

function CartTipsBox({ product, product_size, sizeName, gotoProductDetail }) {
  const isEmptyTip = product.swappable && product_size.swappable
  return isEmptyTip ? null : (
    <div className="cart-tips-box" onClick={gotoProductDetail(product.id)}>
      <span className="cart-size-tips">
        {product.disabled
          ? '已下架'
          : !product.swappable
          ? '待返架'
          : `${sizeName}无货`}
      </span>
    </div>
  )
}
