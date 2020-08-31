/* @flow */

import React, { PureComponent } from 'react'

export default class BottomView extends PureComponent {
  _getToteSlotStatus = () => {
    const {
      currentProduct,
      selectedProducts,
      isOnboarding,
      voidCount
    } = this.props
    const toteSlot = currentProduct.tote_slot

    let message = '替换这件'
    if (toteSlot > 1 && !isOnboarding && selectedProducts.length) {
      const count = this.getToteSlot(selectedProducts) + voidCount
      message = `替换这件(${count > toteSlot ? toteSlot : count}/${toteSlot})`
    }
    return message
  }

  getToteSlot = cartItems => {
    let currentCount = 0
    cartItems &&
      cartItems.forEach(item => {
        currentCount = currentCount + item.product.tote_slot
      })
    return currentCount
  }

  _onClick = () => {
    const { selectedProducts, onClick } = this.props
    selectedProducts.length && onClick && onClick()
  }

  render() {
    const { selectedProducts } = this.props
    const buttonTitle = this._getToteSlotStatus()

    const disabled = !selectedProducts.length
    const className = 'modal-btn ' + (disabled ? 'disabled' : 'active')

    return (
      <div className="tote-swap-modal-btns">
        <div className={className} onClick={this._onClick}>
          {buttonTitle}
        </div>
      </div>
    )
  }
}
