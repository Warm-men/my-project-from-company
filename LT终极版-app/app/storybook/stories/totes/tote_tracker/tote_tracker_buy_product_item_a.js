/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../image'

export default class BuyProductItemA extends Component {
  _didSelectedItem = () => {
    const { didSelectedItem, toteProduct, toteId } = this.props
    didSelectedItem && didSelectedItem(toteProduct, toteId)
  }

  render() {
    const { toteProduct, index, state } = this.props
    const product = toteProduct.product
    const photo = product.catalogue_photos[0]
    const photoUrl = photo
      ? photo.thumb_url
        ? photo.thumb_url
        : photo.full_url
      : ''
    return (
      <View style={[!index && styles.productFirstItem, styles.productItem]}>
        <TouchableOpacity onPress={this._didSelectedItem}>
          <Image
            source={{ uri: photoUrl }}
            style={styles.cataloguePhotos}
            resizeMode="cover"
          />
          {state === 'purchased' && (
            <View style={styles.purchasedImage}>
              <Image
                source={require('../../../../assets/images/totes/purchased.png')}
                resizeMode="cover"
              />
            </View>
          )}
          <View style={styles.buyView}>
            <Text style={styles.priceText}>
              ￥{toteProduct.tote_specific_price}
            </Text>
            <View
              style={[
                styles.buyButton,
                state !== 'purchased' ? styles.willBuyButton : null
              ]}>
              <Text style={styles.buyButtonText}>
                {state === 'purchased' ? '已购买' : '去购买'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  productFirstItem: {
    marginLeft: 15
  },
  productItem: {
    marginRight: 8
  },
  cataloguePhotos: {
    width: 76,
    height: 110
  },
  cataloguePhotosPurchased: {
    backgroundColor: '#FFFFFF',
    opacity: 0.5
  },
  purchasedImage: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -110,
    width: 76,
    height: 110,
    backgroundColor: 'rgba(255,255,255,0.5)'
  },
  buyView: {
    marginTop: 11,
    alignItems: 'center'
  },
  priceText: {
    fontSize: 14,
    color: '#EA5C39'
  },
  buyButton: {
    marginTop: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 17
  },
  willBuyButton: {
    borderWidth: 1,
    borderColor: '#D7D7D7'
  },
  buyButtonText: {
    fontSize: 10,
    color: '#999'
  }
})
