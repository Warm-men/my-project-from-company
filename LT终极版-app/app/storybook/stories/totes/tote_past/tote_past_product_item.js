/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../image'
import ToteSlot from '../../products/tote_slot'
import p2d from '../../../../src/expand/tool/p2d'
import { getDisplaySizeName } from '../../../../src/expand/tool/product_l10n'

export default class TotePastProductItem extends Component {
  _didSelectedItem = () => {
    const { didSelectedItem, toteProduct } = this.props
    didSelectedItem && didSelectedItem(toteProduct.product)
  }

  goToteBuyClothesDetails = () => {
    const { goToteBuyClothesDetails, toteId, toteProduct } = this.props
    goToteBuyClothesDetails && goToteBuyClothesDetails(toteProduct, toteId)
  }

  render() {
    const { toteProduct } = this.props
    const {
      product,
      transition_state,
      transition_info,
      product_size
    } = toteProduct
    const photo = product.catalogue_photos[0]
    const photoUrl = photo
      ? photo.thumb_url
        ? photo.thumb_url
        : photo.full_url
      : ''

    //是否购买过
    const hasPurchased = transition_state === 'purchased'
    const returned = transition_state === 'returned'
    const price = returned
      ? product.member_price
      : transition_info.modified_price
    const showToteSlot = product.tote_slot >= 2
    const sizeText = getDisplaySizeName(product_size.size_abbreviation)
    return (
      <View style={styles.productItem}>
        <TouchableOpacity onPress={this._didSelectedItem}>
          <Image
            source={{ uri: photoUrl }}
            style={styles.cataloguePhotos}
            resizeMode="cover"
          />
          {product.disabled && !hasPurchased && (
            <View style={[styles.cataloguePhotos, styles.abnormalStatus]}>
              <View style={styles.abnormalStatusView}>
                <Text style={styles.abnormalStatusTitle}>已下架</Text>
              </View>
            </View>
          )}
          {!hasPurchased && (
            <View style={styles.sizeTextWrapper}>
              <View style={styles.textView}>
                <Text style={styles.sizeText}>{sizeText}</Text>
              </View>
            </View>
          )}
          {showToteSlot && (
            <ToteSlot
              testID="tote-slot"
              style={styles.toteSlot}
              slotNum={product.tote_slot}
              type={product.type}
            />
          )}
          {hasPurchased ? (
            <View style={styles.hasPurchasedView}>
              <View style={styles.wrapperTextView}>
                <Text style={styles.purchasedText}>已购买</Text>
              </View>
              <TouchableOpacity
                style={styles.hasPurchasedButton}
                onPress={this.goToteBuyClothesDetails}>
                <Text style={styles.hasPurchasedButtonText}>查看详情</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buyView}>
              <Text
                style={[
                  styles.priceText,
                  hasPurchased && styles.hasPurchasedPrice
                ]}>
                ￥{price}
              </Text>
              <Text testID="full-price" style={styles.fullPriceText}>
                ￥{product.full_price}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  productItem: {
    paddingTop: 10,
    paddingBottom: 16,
    paddingHorizontal: p2d(5),
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#F3F3F3'
  },
  cataloguePhotos: {
    width: p2d(88),
    height: p2d(132)
  },
  sizeTextWrapper: {
    marginTop: p2d(-10),
    marginBottom: 3,
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
  cataloguePhotosPurchased: {
    backgroundColor: '#FFFFFF',
    opacity: 0.5
  },
  purchasedView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    top: 44,
    width: 58,
    height: 18,
    backgroundColor: '#242424',
    opacity: 0.6
  },
  wrapperTextView: {
    backgroundColor: '#F4F4F4',
    opacity: 0.95,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 3
  },
  purchasedText: {
    fontSize: 12,
    color: '#242424'
  },
  buyView: {
    alignItems: 'center'
  },
  priceText: {
    fontSize: 14,
    color: '#333'
  },
  toteSlot: {
    position: 'absolute',
    right: 0
  },
  fullPriceText: {
    fontSize: 12,
    color: '#ccc',
    textDecorationLine: 'line-through'
  },
  hasPurchasedPrice: {
    color: '#E85C40'
  },
  hasPurchasedView: {
    alignItems: 'center',
    marginTop: -12
  },
  hasPurchasedButton: {
    borderColor: '#CCC',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 2,
    marginTop: 6,
    paddingHorizontal: 5,
    paddingVertical: 3
  },
  hasPurchasedButtonText: {
    fontSize: 11,
    color: '#5E5E5E'
  },
  abnormalStatus: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  abnormalStatusView: {
    height: 18,
    width: 50,
    backgroundColor: 'rgba(51,51,51,0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  abnormalStatusTitle: {
    fontSize: 11,
    color: '#fff'
  }
})
