/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Image from '../../image'

export default class ProductItem extends PureComponent {
  _didSelectedItem = () => {
    const { product, didSelectedItem } = this.props
    didSelectedItem && didSelectedItem(product)
  }

  render() {
    const {
      product,
      index,
      customerCouponId,
      removeCouponToTote,
      inTote,
      state,
      showPurchasedIcon
    } = this.props
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
          {showPurchasedIcon && (
            <View style={styles.purchasedImage}>
              <Image
                source={require('../../../../assets/images/totes/purchased.png')}
                resizeMode="cover"
              />
            </View>
          )}
          {!!customerCouponId &&
            inTote &&
            (state === 'styled' || state === 'viewed') && (
              <Image
                style={styles.usedClothes}
                source={require('../../../../assets/images/totes/used_clothes_coupon.png')}
                resizeMode="cover"
              />
            )}
        </TouchableOpacity>
        {!!customerCouponId &&
          inTote &&
          (state === 'styled' || state === 'viewed') && (
            <TouchableOpacity
              onPress={removeCouponToTote}
              style={styles.delIcon}>
              <Image
                source={require('../../../../assets/images/totes/del_icon.png')}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  productFirstItem: {
    marginLeft: 8
  },
  productItem: {
    marginRight: 8,
    paddingTop: 20
  },
  cataloguePhotos: {
    width: 76,
    height: 110
  },
  delIcon: {
    position: 'absolute',
    top: 5,
    left: 56,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  usedClothes: {
    position: 'absolute',
    top: 92
  },
  purchasedImage: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -110,
    width: 76,
    height: 110,
    backgroundColor: 'rgba(255,255,255,0.5)'
  }
})
