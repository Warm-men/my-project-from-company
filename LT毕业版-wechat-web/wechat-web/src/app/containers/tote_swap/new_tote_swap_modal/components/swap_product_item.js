/* @flow */

import React, { PureComponent } from 'react'
import ToteSlotIcon from 'src/app/containers/totes/tote_slot_icon'
import { getSizeName } from 'src/app/containers/product/detail_buttons/utils/product_detail_bottom_btn_util.js'

export default class ProductItem extends PureComponent {
  _didSelectedItem = () => {
    const { didSelectedItem, toteProduct, disable } = this.props
    if (!disable) {
      didSelectedItem && didSelectedItem(toteProduct)
    }
  }

  _getProductAbnormalStatus = () => {
    const { product, product_size } = this.props.toteProduct
    let tip = null
    if (product.disabled) {
      tip = '已下架'
    } else if (product.swappable) {
      if (product_size && !product_size.swappable) {
        const sizeName = this._handleSizeName(product_size)
        tip = sizeName + '无货'
      }
    } else {
      tip = `待返架`
    }
    return tip
  }

  _handleSizeName = data => {
    if (_.isEmpty(data) || _.isEmpty(data.size)) return null

    const { name } = data.size
    const sizeName = getSizeName(name)
    return _.includes(sizeName, '码') ? sizeName : `${sizeName}码`
  }

  render() {
    const { toteProduct, disable, isSelected, isOnboarding } = this.props
    const { product, slot } = toteProduct
    const photo = product.catalogue_photos[0]
      ? product.catalogue_photos[0].medium_url
      : ''

    const showToteSlot = slot >= 2
    const tips = this._getProductAbnormalStatus()
    return (
      <div className="products-box" onClick={this._didSelectedItem}>
        {!disable && (
          <div className="product-select-icon-box">
            <span
              className={`product-select-icon ${isSelected ? 'selected' : ''}`}
              alt=""
            />
          </div>
        )}
        <img className="tote-swap-product-img" src={photo} alt="" />
        {disable && <div className="tote-swap-product-opacity" />}
        {showToteSlot && !isOnboarding && (
          <div className="products-both-slot">
            <ToteSlotIcon slot={slot} type={product.type} />
          </div>
        )}
        {tips && (
          <div className="tote-swap-gallery-unstock">
            <span className="unstock-icon">{tips}</span>
          </div>
        )}
      </div>
    )
  }
}
