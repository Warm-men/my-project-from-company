/* @flow */

import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Image from '../../image'

export default class BuyProductItemB extends Component {
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
          {state !== 'purchased' && (
            <View style={styles.tipsView}>
              <Text style={styles.tipsText}>折扣购买</Text>
            </View>
          )}
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
            <Text style={styles.fullPrice}>
              ￥{toteProduct.product.full_price}
            </Text>
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
  fullPrice: {
    fontSize: 12,
    color: '#D0D0D0',
    marginTop: 3,
    textDecorationLine: 'line-through'
  },
  tipsView: {
    width: 51,
    height: 17,
    backgroundColor: '#EA5C39',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: -24,
    marginBottom: 7
  },
  tipsText: {
    fontSize: 10,
    color: '#FFF'
  }
})
