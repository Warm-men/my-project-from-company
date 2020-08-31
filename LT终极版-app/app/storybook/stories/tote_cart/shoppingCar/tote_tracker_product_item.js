/* @flow */

import React, { PureComponent } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Image from '../../image'
import p2d from '../../../../src/expand/tool/p2d'
import ToteSlot from '../../products/tote_slot'
export default class ProductItem extends PureComponent {
  _didSelectedItem = () => {
    const { product, didSelectedItem } = this.props
    didSelectedItem && didSelectedItem(product)
  }

  render() {
    const { product, disabled } = this.props
    const photo = product.catalogue_photos[0]
    const photoUrl = photo.medium_url
    const showToteSlot = product.tote_slot >= 2
    return (
      <View style={[styles.productItem]}>
        <TouchableOpacity
          disabled={disabled ? disabled : false}
          onPress={this._didSelectedItem}>
          <Image
            source={{ uri: photoUrl }}
            style={styles.cataloguePhotos}
            resizeMode={'cover'}
          />
          {showToteSlot && (
            <ToteSlot
              testID="tote-slot"
              style={styles.toteSlot}
              slotNum={product.tote_slot}
              type={product.type}
            />
          )}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  productItem: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  cataloguePhotos: {
    height: p2d(120),
    width: p2d(80)
  },
  toteSlot: {
    position: 'absolute'
  }
})
