/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../image'
import p2d from '../../../../src/expand/tool/p2d'
import { getDisplaySizeName } from '../../../../src/expand/tool/product_l10n'
import ToteSlot from '../../products/tote_slot'
export default class ProductItem extends PureComponent {
  _didSelectedItem = () => {
    const { product, didSelectedItem } = this.props
    didSelectedItem && didSelectedItem(product)
  }

  _goBuy = () => {
    const {
      toteBuyProduct,
      toteProduct,
      toteId,
      orders,
      nonReturnedlist
    } = this.props
    const isPurchased = toteProduct.transition_state === 'purchased'
    toteBuyProduct &&
      toteBuyProduct(toteProduct, toteId, orders, nonReturnedlist, isPurchased)
  }

  render() {
    const {
      product,
      toteProduct: { transition_state, transition_info, product_size },
      index
    } = this.props
    const photo = product.catalogue_photos[0]
    const photoUrl = photo
      ? photo.thumb_url
        ? photo.thumb_url
        : photo.full_url
      : ''
    const modifiedPrice = transition_info && transition_info.modified_price
    //已归还
    const isReturned = transition_state === 'returned'
    //已经被购买的商品
    const isPurchased = transition_state === 'purchased'
    //显示按钮
    const isShowSale =
      (transition_state !== 'none' && !!modifiedPrice) || isPurchased
    const productMark = isPurchased ? '已购买' : isReturned ? '已归还' : null
    const isShowToteSlot = product.tote_slot >= 2
    const buttonText = isPurchased ? '查看详情' : '折扣购买'
    const buttonStyle = isPurchased ? styles.detailButton : styles.buyButton
    const buyButtonText = isPurchased
      ? styles.detailButtonText
      : styles.buyButtonText
    const isLastRowChild = (index + 1) % 4 === 0
    const sizeText = getDisplaySizeName(product_size.size_abbreviation)
    return (
      <View
        style={[styles.productItem, !isLastRowChild && styles.itemRightBorder]}>
        <TouchableOpacity testID={'image'} onPress={this._didSelectedItem}>
          <Image
            source={{ uri: photoUrl }}
            style={styles.cataloguePhotos}
            resizeMode={'cover'}
          />
          {productMark && (
            <View style={styles.purchasedView}>
              <View style={styles.purchasedTextView}>
                <Text
                  testID={'product-item-status'}
                  style={styles.purchasedText}>
                  {productMark}
                </Text>
              </View>
            </View>
          )}
          {!!isShowToteSlot && (
            <ToteSlot
              testID="tote-slot"
              style={styles.toteSlotImage}
              slotNum={product.tote_slot}
              type={product.type}
            />
          )}
        </TouchableOpacity>
        {!isShowSale && (
          <View
            style={styles.sizeTextWrapper}
            testID="product-size-description">
            <View style={styles.textView}>
              <Text style={styles.sizeText}>{sizeText}</Text>
            </View>
          </View>
        )}
        {isShowSale && (
          <View style={styles.buyView}>
            <Text
              testID={'product-item-specific-price'}
              style={styles.specificPriceText}>{`¥${modifiedPrice}`}</Text>
            <Text
              style={styles.fullPriceText}
              testID={'product-item-full-price'}>{`¥${
              product.full_price
            }`}</Text>
            {!isReturned && (
              <TouchableOpacity
                style={[styles.buttonItem, buttonStyle]}
                activeOpacity={0.8}
                onPress={this._goBuy}>
                <Text testID={'purchase-button'} style={buyButtonText}>
                  {buttonText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  productItem: {
    paddingTop: p2d(12),
    paddingBottom: p2d(16),
    borderBottomColor: '#F3F3F3',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  itemRightBorder: {
    borderRightColor: '#F3F3F3',
    borderRightWidth: StyleSheet.hairlineWidth
  },
  cataloguePhotos: {
    width: p2d(85),
    height: p2d(128)
  },
  sizeTextWrapper: {
    marginTop: p2d(-18),
    alignItems: 'center'
  },
  textView: {
    backgroundColor: '#F3F3F3',
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignItems: 'center'
  },
  sizeText: {
    fontSize: 12,
    color: '#242424'
  },
  purchasedView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: p2d(-128),
    width: p2d(85),
    height: p2d(128),
    backgroundColor: 'rgba(255,255,255,0.5)'
  },
  purchasedTextView: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 5,
    paddingVertical: 3
  },
  purchasedText: {
    fontSize: 10,
    color: '#fff'
  },
  buyView: {
    width: p2d(85),
    marginTop: p2d(10),
    alignItems: 'center'
  },
  specificPriceText: {
    fontSize: 14,
    color: '#242424',
    letterSpacing: 0.4
  },
  fullPriceText: {
    fontSize: 11,
    letterSpacing: 0.4,
    color: '#CCCCCC',
    textDecorationLine: 'line-through'
  },
  buttonItem: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E85C40',
    borderRadius: 2,
    width: p2d(56),
    height: p2d(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2
  },
  buyButton: {
    borderColor: '#E85C40'
  },
  detailButton: {
    borderColor: '#999'
  },
  buyButtonText: {
    color: '#E85C40',
    fontSize: 11
  },
  detailButtonText: {
    color: '#999',
    fontSize: 11
  },
  toteSlotImage: {
    position: 'absolute',
    top: 0,
    left: 0
  }
})
