import * as React from 'react'
import memorize from 'memoize-one'
import { connect } from 'react-redux'
import { Product } from '../../../typings/product'
import { ToteCart } from '../../../typings/tote_cart'
import ToteCartUtil from '../tote_swap/new_tote_swap_modal/utils/tote_cart_util'
/**
 * 加入购物车图标
 *
 * @export
 * @class AddToToteCartIcon
 * @extends {React.Component<{
 *   product: Product
 *   tote_cart: ToteCart
 *   isShowUnstock: boolean
 *   onClickAddToToteCart: Function
 * }>}
 */
@connect(state => ({ tote_cart: state.tote_cart }))
export default class AddToToteCartIcon extends React.Component<{
  product: Product
  tote_cart: ToteCart
  isShowUnstock: boolean
  onClickAddToToteCart: Function
}> {
  handleClickAddToToteCart = (e: React.MouseEvent) => {
    const { product, onClickAddToToteCart, isShowUnstock } = this.props
    e.stopPropagation()
    if (!isShowUnstock) {
      onClickAddToToteCart(product.id)
    }
  }

  render() {
    const { product, tote_cart, isShowUnstock } = this.props

    const isInToteCart = memorize((product, tote_cart) => {
      return ToteCartUtil.isInToteCart(product, tote_cart)
    })(product, tote_cart)

    return isInToteCart ? (
      <div className="add-to-tote-icon-wrapper">
        <img
          onClick={this.handleClickAddToToteCart}
          className={`add-to-tote-icon`}
          src={require('src/app/containers/products/images/add_to_tote_exist.png')}
          alt=""
        />
      </div>
    ) : (
      <img
        onClick={this.handleClickAddToToteCart}
        className={`add-to-tote-icon ${isShowUnstock ? 'unstock' : ''}`}
        src={require('src/app/containers/products/images/add_to_tote.svg')}
        alt=""
      />
    )
  }
}
